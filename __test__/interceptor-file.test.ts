import { assert } from "deno/assert";
import { Brickyard } from "../brickyard.ts";
import { complete } from './interceptor.ts';


Deno.test("real interceptor-file", async () => {
  const brickyard = await Brickyard.init(complete());

  assert(brickyard instanceof Brickyard);
});

Deno.test("fake interceptor-file", async () => {
  const brickyard = await Brickyard.init();

  assert(brickyard instanceof Brickyard);
});
