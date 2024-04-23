## _[Read about](#about)_

## Examples:

#### minimal:

```ts
// bricks.ts
import { some_fn } from "./some_fn.ts";
import { another_fn } from "./another_fn.ts";

export const bircks = Brickyard
  .init(Brickyard.pre_init().complete())
  .enroll({ some_fn, another_fn });

// main.ts
import { bricks } from "./bricks.ts";

bricks.some_fn();
```

> but actualy example above works exactly as a simple reexport.

#### more usefull example:

```ts
// bricks.ts
import { some_fn } from "./some_fn.ts";
import { another_fn } from "./another_fn.ts";

const interceptor = Brickyard
  .intercept("some_fn", { fn: () => "intercepted some_fn" })
  .pre_init()
  .complete();

export const bircks = Brickyard
  .init(interceptor)
  .enroll({ some_fn, another_fn });

// main.ts
import { bricks } from "./bricks.ts";

bricks.some_fn();
```

#### Advanced example:

> the same as above except the interceptor is placed in the separate file and
> ignored by git. but you can change the implementation of `some_fn` and
> `another_fn` without changing the code.

```ts
// .interceptor.ts
import { some_fn } from "./some_fn.ts";
import { another_fn } from "./another_fn.ts";

export const interceptor = Brickyard
  .intercept("some_fn", { fn: () => "intercepted some_fn" })
  .pre_init()
  .complete();

// bricks.ts
import { interceptor } from "./.interceptor.ts";

export const bircks = Brickyard
  .init(interceptor)
  .enroll({ some_fn, another_fn });

// main.ts
import { bricks } from "./bricks.ts";

bricks.some_fn();
```

#### P.S. if you hide your interceptor file with `.gitignore` you should create this file manually (even if you don't want to do interceptions)

> so it can be as possible simple:

```ts
// .interceptor.ts, ignored by git
export const interceptor = Brickyard.pre_init().complete();
```

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
