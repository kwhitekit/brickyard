import { is_obj } from "./is-obj.util.ts";

export class BrickOuter_simple {
  private constructor() {
    console.log("BrickOuter_simple_implementation");
  }

  public static init() {
    return new BrickOuter_simple();
  }

  #stuff = new Map<string, Interceptor>();

  public intercept<T extends Fn>(id: string, interceptor: Interceptor<T>) {
    if (this.#stuff.has(id)) {
      throw new Error(`This id (${id}) is already the member of BrickOuter`);
    }
    this.#stuff.set(id, interceptor);
  }

  public enroll<T extends (...args: any[]) => any>(cb: T, id: string) {
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
