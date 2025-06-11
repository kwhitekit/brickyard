import { assert } from "@std/assert";
import { Brickyard } from "../src/brickyard.ts";
import { complete } from "./interceptor.ts";

Deno.test("real interceptor-file", async () => {
  const brickyard = await Brickyard.init(complete());

  assert(brickyard instanceof Brickyard);
});

Deno.test("fake interceptor-file", async () => {
  const brickyard = await Brickyard.init(Brickyard.pre_init().complete());

  assert(brickyard instanceof Brickyard);
});
