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

The util name `BrickOuter` is stands from imagination of your application like
`house` that is built from `bricks` - your `functions`. > So thinking about
`testable` means that you provide possibility to `spy/mock` of functionality
that you want to test at once. > **So you get your brick out ot
replace/reconfigure for test.** >


## Example:

* @description
* ### How to use (possible example):
* 1. First:
  ```ts
  BrickOuter_simple.pre_init().intercept("some_fn", { fn: () => 'fake result!' });
  ```
* 2. Second:
  ```ts
  import { some_fn } from "./some_fn.ts";
  import { another_fn } from "./another_fn.ts";

  const brick = await BrickOuter_simple.init();

  export const {
   some_fn,
   another_fn,
  } = brick.enroll({ some_fn, antoher_fn });
  ```
* 3. Use `some_fn` and `another_fn` as usual but import from this file.
    ## P.S.
    #### (possible additional usage)
    * add file from punkt 1 to .gitignore
    * so in punkt so something like `const bricks = await BrickOuter_simple.init('./path/to/ignored/file.ts') // with path to ignored file`
    * So now you can change implementation of `some_fn` and `another_fn` without changing the code!
