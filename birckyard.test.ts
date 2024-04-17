import { assertEquals } from "deno/assert";
import { Brickyard } from "./brickyard.ts";

function origin_fn(url: string, config: RequestInit) {
  return fetch(url, config).catch((e) => "error!");
}

Deno.test("Brickyard", async (t) => {
  await t.step("enrolled app should worked without changes", async () => {
    const brickyard = await Brickyard.init();
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const reexport = brickyard.enroll({ origin_fn });

    assertEquals(
      await reexport.origin_fn("http://localhost/will-fail", {}),
      "error!",
    );
  });
  await t.step("enrolled app should change implementation", async () => {
    Brickyard.pre_init().intercept("origin_fn", {
      fn: () => "success!",
    });
    const brickyard = await Brickyard.init();
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const reexport = brickyard.enroll({ origin_fn });

    assertEquals(
      await reexport.origin_fn("http://localhost/will-fail", {}),
      "success!",
    );
  });
});
