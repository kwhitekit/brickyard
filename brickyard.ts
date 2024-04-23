import { is_obj } from "./is-obj.util.ts";

/**
 * @description
 * ### How to use:
 * #### Minimal example:
 * ```ts
 * // bricks.ts
 * import { some_fn } from "./some_fn.ts";
 * import { another_fn } from "./another_fn.ts";
 *
 * export const bircks = Brickyard
 *    .init(Brickyard.pre_init().complete())
 *    .enroll({ some_fn, another_fn });
 *
 * // main.ts
 * import { bricks } from "./bricks.ts";
 *
 * bricks.some_fn();
 * ```
 *
 * > but actualy example above works exactly as a simple reexport.
 *
 * #### Usefull example:
 *
 * ```ts
 * // bricks.ts
 * import { some_fn } from "./some_fn.ts";
 * import { another_fn } from "./another_fn.ts";
 *
 * const interceptor = Brickyard
 *     .intercept('some_fn', { fn: () => 'intercepted some_fn' })
 *     .pre_init()
 *     .complete();
 *
 * export const bircks = Brickyard
 *    .init(interceptor)
 *    .enroll({ some_fn, another_fn });
 *
 * // main.ts
 * import { bricks } from "./bricks.ts";
 *
 * bricks.some_fn();
 * ```
 *
 * #### Advanced example:
 * > the same as above except the interceptor is placed in the separate file and ignored by git.
 * > but you can change the implementation of `some_fn` and `another_fn` without changing the code.
 *
 * ```ts
 * // .interceptor.ts
 * import { some_fn } from "./some_fn.ts";
 * import { another_fn } from "./another_fn.ts";
 *
 * export const interceptor = Brickyard
 *     .intercept('some_fn', { fn: () => 'intercepted some_fn' })
 *     .pre_init()
 *     .complete();
 *
 * // bricks.ts
 * import { interceptor } from "./.interceptor.ts";
 *
 * export const bircks = Brickyard
 *    .init(interceptor)
 *    .enroll({ some_fn, another_fn });
 *
 * // main.ts
 * import { bricks } from "./bricks.ts";
 *
 * bricks.some_fn();
 * ```
 *
 * #### P.S. if you hide your interceptor file with `.gitignore` you should create this file manually (even if you don't want to do interceptions)
 * > so it can be as possible simple:
 *
 * ```ts
 * // .interceptor.ts, ignored by git
 * export const interceptor = Brickyard.pre_init().complete();
 * ```
 */
export class Brickyard {
  private constructor() {
  }

  /**
   * @description
   * To start register your interceptors
   */
  public static pre_init(): {
    intercept: Brickyard["intercept"];
    complete: () => BricksInterceptor;
  } {
    const brickyard = new Brickyard();
    return {
      intercept: brickyard.intercept.bind(brickyard),
      complete: () => brickyard.#interceptor,
    };
  }

  #interceptor = new BricksInterceptor(this);

  /**
   * @description
   * To start register your functions for reexport
   */
  public static init(
    interceptor: BricksInterceptor,
  ): Pick<Brickyard, "enroll"> {
    return interceptor.brickyard as Pick<Brickyard, "enroll">;
  }

  #stuff = new Map<string, InterceptorType>();

  /**
   * @description
   * Register interceptor for the function with `id`.
   * (will be ignored if no such `id` and throw error if `id` is already the member of interceptor)
   */
  public intercept<T extends Fn>(
    id: string,
    interceptor: InterceptorType<T>,
  ): {
    intercept: Brickyard["intercept"];
    complete: () => BricksInterceptor;
  } {
    if (this.#stuff.has(id)) {
      throw new Error(`This id (${id}) is already the member of Brickyard`);
    }
    this.#stuff.set(id, interceptor);

    return {
      intercept: this.intercept.bind(this),
      complete: () => new BricksInterceptor(this),
    };
  }

  /**
   * @description
   * Pass the object with functions to enroll them.
   * And use returned result as reexport of the original stuff for your project.
   */
  public enroll<T extends Record<string, Fn>>(candidates: T): T {
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

type InterceptorType<T extends Fn = Fn> = {
  fn: T;
  args?: never;
  args_strategy?: never;
} | {
  fn?: T;
  args: Parameters<T>;
  args_strategy: "merge" | "replace";
};
type Fn = (...args: any[]) => any;

/**
 * @description
 * This is mostly util-helper class.
 * So it is a kind of a trick to make you call pre_init() method before init() method.
 * It's purpose is to enforce you place it into the Brickyard.init() method.
 * But because of to get it your should first call Brickyard.pre_init() method.
 */
class BricksInterceptor {
  constructor(public brickyard: Brickyard) {}
}
