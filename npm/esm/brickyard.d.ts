/**
 * @description
 * ### How to use:
 * #### Minimal example:
 * ```ts
 * // bricks.ts
 * import { some_fn } from "./some_fn.ts";
 * import { another_fn } from "./another_fn.ts";
 *
 * export const bricks = Brickyard
 *    .init(Brickyard.pre_init().complete())
 *    .enroll({ some_fn, another_fn });
 *
 * // main.ts
 * import { bricks } from "./bricks.ts";
 *
 * bricks.some_fn();
 * ```
 *
 * > but actually example above works exactly as a simple reexport.
 *
 * #### Useful example:
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
 * export const bricks = Brickyard
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
 *     .pre_init()
 *     .intercept('some_fn', { fn: () => 'intercepted some_fn' })
 *     .complete();
 *
 * // bricks.ts
 * import { interceptor } from "./.interceptor.ts";
 *
 * export const bricks = Brickyard
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
export declare class Brickyard {
  #private;
  private constructor();
  /**
   * @description
   * To start register your interceptors
   */
  static pre_init(): {
    intercept: Brickyard["intercept"];
    complete: () => BricksInterceptor;
  };
  /**
   * @description
   * To start register your functions for reexport
   */
  static init(interceptor: BricksInterceptor): Pick<Brickyard, "enroll">;
  /**
   * @description
   * Register interceptor for the function with `id`.
   * (will be ignored if no such `id` and throw error if `id` is already the member of interceptor)
   */
  intercept<T extends Fn>(id: string, interceptor: InterceptorType<T>): {
    intercept: Brickyard["intercept"];
    complete: () => BricksInterceptor;
  };
  /**
   * @description
   * Pass the object with functions to enroll them.
   * And use returned result as reexport of the original stuff for your project.
   */
  enroll<T extends Record<string, Fn>>(candidates: T): T;
  private _enroll;
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
declare class BricksInterceptor {
  brickyard: Brickyard;
  constructor(brickyard: Brickyard);
}
export {};
//# sourceMappingURL=brickyard.d.ts.map
