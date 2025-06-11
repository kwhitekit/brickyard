// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  test: false,
  testPattern: "__test__/**/*",
  package: {
    // package.json properties
    name: "@nik-kita/brickyard",
    version: Deno.args[0],
    description: "Dead-simple solution for mocking.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/kwhitekit/brickyard",
    },
    bugs: {
      url: "https://github.com/kwhitekit/brickyard/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
