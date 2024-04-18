## _[at once to example](#example)_

# About

#### aka problem

- strong project should be tested
- to be tested the project should be testable!
- so the existence of tests is not guarantee something
- testable mean determenistic, abstogation etc. pure function is ideal
- pure function in simple words mean that:
  - same args => same result
  - as possible independence of outer scope
  - immutable of arguments
  - even better without arguments
  - ...and so on...

---

#### inspired by

- mocking and spying during tests
  - for example `jest.spy() / jest.mock`
  - problem that if source code is complecated enough or is depended on huge
    amount of some stuff - it still become hard/impossible for testing even with
    such instruments
- simple `.env` manipulations
  - not too much functionality
  - in practical it is related to e2e tests
  - very global and primitive solutions
  - for example mock database or etc.

#### Conclusion

Code should be written with thoughts about how it will be tested. Remember that
even solutions with firstly writing ones is very popular.

### ...

The util name `Brickyard` is stands from imagination of your application like
`house` that is built from `bricks` - your `functions`. > So thinking about
`testable` means that you provide possibility to `spy/mock` of functionality
that you want to test at once. > **So you get your brickyard out ot
replace/reconfigure for test.** >


## Example:
> How to use (possible example):

1. First:
  ```ts
  const const {
    complete, 
  } = Brickyard
    .pre_init()
    .intercept("some_fn", { fn: () => 'fake result!' })
    .and('some_another_fn', { args: [1, 2], args_strategy: 'replace' });
  ```
2. Second:
  ```ts
  import { some_fn } from "./some_fn.ts";
  import { another_fn } from "./another_fn.ts";
  import { complete } from './your-backyard.interceptor.ts'; // optional

  /**
   * @description
   * The same as
   * ```ts
   *   const brickyard = Brickyard.init();
   * ```
   * Only more explicit control that you:
   * 1. Make .pre_init() call
   * 2. Include it to your project importing somewhere and somewhen
   * 3. AND DO IT BEFORE .init() call
   */
  const brickyard = Brickyard.init(complete());

  const origin = { some_fn, antoher_fn };

  // bricks is the exactly the same type as origin!
  // so it is like simple re-export
  export const bricks = brickyard.enroll(origin);
  ```
3. Use `bricks.some_fn` and `bricks.another_fn` as original ones but optionaly mock/modify them if you need.
    

## P.S.
> (possible additional usage)

* add file from punkt 1 to `.gitignore`
* so in punkt so something like 
  ```ts
  const bricks = await Brickyard.init('./path/to/ignored/file.ts') // with path to ignored file (may be from `.env` aka process.env.PATH_TO_BRICKS)
  ```
* So now you can change implementation of `some_fn` and `another_fn` without changing the code!
