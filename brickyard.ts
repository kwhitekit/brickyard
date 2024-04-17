import { is_obj } from "./is-obj.util.ts";

/**
 * @description
 * ### How to use (possible example):
 * 1. First:
 * ```ts
 * Brickyard.pre_init().intercept("some_fn", { fn: () => 'fake result!' });
 * ```
 * 2. Second:
 * ```ts
 * import { some_fn } from "./some_fn.ts";
 * import { another_fn } from "./another_fn.ts";
 *
 * const brickyard = await Brickyard.init();
 *
 * export const {
 *  some_fn,
 *  another_fn,
 * } = brickyard.enroll({ some_fn, antoher_fn });
 *
 * 3. Use `some_fn` and `another_fn` as usual but import from this file.
 *
 * ## P.S.
 * #### (possible additional usage)
 * * add file from punkt 1 to .gitignore
 * * so in punkt so something like `const bricks = await Brickyard.init('./path/to/ignored/file.ts') // with path to ignored file`
 * So now you can change implementation of `some_fn` and `another_fn` without changing the code!
 */
export class Brickyard {
  private static singleton = new Brickyard();
  private constructor() {
    console.log("Brickyard_implementation");
  }

  /**
   * @description
   * Should be called before `init` method.
   * So you can optionally register interceptors before the main initialization.
   */
  public static pre_init(): Pick<Brickyard, "intercept"> {
    return this.singleton;
  }

  /**
   * @description
   * If you want to use your interceptors (if such ones exists) - should be called after `pre_init` method.
   */
  public static async init(
    path_to_possible_file_with_interceptored_bricks?: string,
  ): Promise<Pick<Brickyard, "enroll">> {
    if (!path_to_possible_file_with_interceptored_bricks) {
      return this.singleton;
    }

    try {
      const interceptored = await import(
        path_to_possible_file_with_interceptored_bricks
      );

      if (interceptored instanceof Brickyard) {
        return interceptored;
      } else {
        throw new Error(
          `Default import from ${path_to_possible_file_with_interceptored_bricks} is not instance of Brickyard... so it is ignored.`,
        );
      }
    } catch (err) {
      console.debug("=============================");
      console.warn(err);
      console.debug("=============================");
      return this.singleton;
    }
  }

  #stuff = new Map<string, Interceptor>();

  /**
   * @description
   * Register interceptor for the function with `id`.
   * (will be ignored if no such `id` and throw error if `id` is already the member of Brickyard)
   */
  public intercept<T extends Fn>(id: string, interceptor: Interceptor<T>) {
    if (this.#stuff.has(id)) {
      throw new Error(`This id (${id}) is already the member of Brickyard`);
    }
    this.#stuff.set(id, interceptor);

    return this;
  }

  /**
   * @description
   * Pass the object with functions to enroll them.
   * And use returned result as reexport of the original stuff for your project.
   */
  public enroll<T extends Record<string, Fn>>(candidates: T) {
    if (this.#stuff.size === 0) {
      console.warn("No interceptors found");
      console.info("Be sure to call .intercept() method before .enroll()");
    }

    const reexport = Object.fromEntries(
      Object.entries(candidates).map(([id, origin]) => {
        const enrolled = this._enroll(origin, id);

        return [id, enrolled];
      }),
    );

    return reexport as T;
  }

  private _enroll<T extends Fn>(cb: T, id: string) {
    const interceptor = this.#stuff.get(id);

    if (!interceptor) {
      return cb;
    }

    const final_fn = interceptor.fn || cb;
    const intercepted_args = interceptor.args;
    if (intercepted_args) {
      if (interceptor.args_strategy === "merge") {
        return (...args: Parameters<T>) => {
          const merged =
            (args.length > intercepted_args.length ? args : intercepted_args)
              .map((
                _,
                i,
              ) => {
                const intercepted_a = intercepted_args[i];
                const a = args[i];
                if (is_obj(a) && is_obj(intercepted_a)) {
                  for (const key in intercepted_a) {
                    a[key] = intercepted_a[key];
                  }

                  return a;
                }

                return intercepted_a ?? a;
              });

          return final_fn(...merged);
        };
      } else {
        return () => final_fn(...intercepted_args);
      }
    }

    return final_fn;
  }
}

type Interceptor<T extends Fn = Fn> = {
  fn: T;
  args?: never;
  args_strategy?: never;
} | {
  fn?: T;
  args: Parameters<T>;
  args_strategy: "merge" | "replace";
};
type Fn = (...args: any[]) => any;
