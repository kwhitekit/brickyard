## _[Follow this link to skip these many words at once to code](./brick-outer.simple.ts)_

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

