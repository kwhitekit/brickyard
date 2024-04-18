import { assert } from "deno/assert";
import { Brickyard } from "../brickyard.ts";

Deno.test("real interceptor-file", async () => {
  const brickyard = await Brickyard.init("./__test__/interceptor.ts");

  assert(brickyard instanceof Brickyard);
});

Deno.test("fake interceptor-file", async () => {
  const brickyard = await Brickyard.init("./__test__/fake-interceptor.ts");

  assert(brickyard instanceof Brickyard);
});
