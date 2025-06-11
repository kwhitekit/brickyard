import { assert } from "@std/assert";
import { Brickyard } from "../brickyard.ts";

Deno.test("many instances", async () => {
  const bricks = Brickyard.init(Brickyard.pre_init().complete()).enroll({
    some_fn: () => "some_fn",
  });
  const bricks2 = Brickyard.init(
    Brickyard.pre_init().intercept("some_fn", {
      fn: () => "intercepted some_fn",
    }).complete(),
  ).enroll({
    some_fn: () => "some_fn2",
  });
  assert(bricks !== bricks2);
  assert(bricks.some_fn() === "some_fn");
  assert(bricks2.some_fn() === "intercepted some_fn");
});
