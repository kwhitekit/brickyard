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
export declare class Brickyard {
    #private;
    private static singleton;
    private constructor();
    /**
     * @description
     * Should be called before `init` method.
     * So you can optionally register interceptors before the main initialization.
     */
    static pre_init(): Pick<Brickyard, "intercept">;
    /**
     * @description
     * ### Should be called after `pre_init` method. If you want to use your interceptors (if such ones exists).
     * ## The path to the file should be relative to the project (directory from where node/deno is run).
     */
    static init(interceptor_complete_flag?: BrickCompleter): Pick<Brickyard, "enroll">;
    /**
     * @description
     * Register interceptor for the function with `id`.
     * (will be ignored if no such `id` and throw error if `id` is already the member of Brickyard)
     */
    intercept<T extends Fn>(id: string, interceptor: Interceptor<T>): {
        and: Brickyard["intercept"];
        complete: () => BrickCompleter;
    };
    /**
     * @description
     * Pass the object with functions to enroll them.
     * And use returned result as reexport of the original stuff for your project.
     */
    enroll<T extends Record<string, Fn>>(candidates: T): T;
    private _enroll;
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
/**
 * @description
 * This is util-helper only class.
 * So it is a kind of a trick to make you call pre_init() method before init() method.
 * It has not any real actions etc.
 * It's purpose is to enforce you place it into the Brickyard.init() method.
 * But because of to get it your should first call Brickyard.pre_init() method.
 * Typescript may tip you to do it in the right order.
 */
declare class BrickCompleter {
    private __type__;
}
export {};
//# sourceMappingURL=brickyard.d.ts.map