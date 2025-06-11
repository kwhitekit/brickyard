var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f) {
      throw new TypeError("Private accessor was defined without a getter");
    }
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    ) {
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it",
      );
    }
    return kind === "m"
      ? f
      : kind === "a"
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var _Brickyard_interceptor, _Brickyard_stuff;
import { is_obj } from "./is-obj.util.js";
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
export class Brickyard {
  constructor() {
    _Brickyard_interceptor.set(this, new BricksInterceptor(this));
    _Brickyard_stuff.set(this, new Map());
  }
  /**
   * @description
   * To start register your interceptors
   */
  static pre_init() {
    const brickyard = new Brickyard();
    return {
      intercept: brickyard.intercept.bind(brickyard),
      complete: () =>
        __classPrivateFieldGet(brickyard, _Brickyard_interceptor, "f"),
    };
  }
  /**
   * @description
   * To start register your functions for reexport
   */
  static init(interceptor) {
    return interceptor.brickyard;
  }
  /**
   * @description
   * Register interceptor for the function with `id`.
   * (will be ignored if no such `id` and throw error if `id` is already the member of interceptor)
   */
  intercept(id, interceptor) {
    if (__classPrivateFieldGet(this, _Brickyard_stuff, "f").has(id)) {
      throw new Error(`This id (${id}) is already the member of Brickyard`);
    }
    __classPrivateFieldGet(this, _Brickyard_stuff, "f").set(id, interceptor);
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
  enroll(candidates) {
    if (__classPrivateFieldGet(this, _Brickyard_stuff, "f").size === 0) {
      console.warn("No interceptors found");
      console.info("Be sure to call .intercept() method before .enroll()");
    }
    const reexport = Object.fromEntries(
      Object.entries(candidates).map(([id, origin]) => {
        const enrolled = this._enroll(origin, id);
        return [id, enrolled];
      }),
    );
    return reexport;
  }
  _enroll(cb, id) {
    const interceptor = __classPrivateFieldGet(this, _Brickyard_stuff, "f").get(
      id,
    );
    if (!interceptor) {
      return cb;
    }
    const final_fn = interceptor.fn || cb;
    const intercepted_args = interceptor.args;
    if (intercepted_args) {
      if (interceptor.args_strategy === "merge") {
        return (...args) => {
          const merged =
            (args.length > intercepted_args.length ? args : intercepted_args)
              .map((_, i) => {
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
_Brickyard_interceptor = new WeakMap(), _Brickyard_stuff = new WeakMap();
/**
 * @description
 * This is mostly util-helper class.
 * So it is a kind of a trick to make you call pre_init() method before init() method.
 * It's purpose is to enforce you place it into the Brickyard.init() method.
 * But because of to get it your should first call Brickyard.pre_init() method.
 */
class BricksInterceptor {
  constructor(brickyard) {
    Object.defineProperty(this, "brickyard", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: brickyard,
    });
  }
}
