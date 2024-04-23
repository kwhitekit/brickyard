#### If for some strange reasons you use `node` instead of `Deno` :D

> This is my solution...

- Installation:
  ```
  npx jsr i @nik-kita/brickyard
  ```
- in `tsconfig.json` also add:
  ```jsonc
  {
    "compilerOptions": {
      "module": "NodeNext",
      "target": "es2019"
    }
  }
  ```
