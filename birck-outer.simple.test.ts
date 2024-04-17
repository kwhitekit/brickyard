import { assertEquals } from "deno/assert";
import { BrickOuter_simple } from "./brick-outer.simple.ts";

function origin_fn(url: string, config: RequestInit) {
  return fetch(url, config).catch((e) => "error!");
}

Deno.test("BrickOuter_simple", async (t) => {
  await t.step("enrolled app should worked without changes", async () => {
    const brick = await BrickOuter_simple.init();
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const reexport = brick.enroll({ origin_fn });

    assertEquals(
      await reexport.origin_fn("http://localhost/will-fail", {}),
      "error!",
    );
  });
  await t.step("enrolled app should change implementation", async () => {
    BrickOuter_simple.pre_init().intercept("origin_fn", {
      fn: () => "success!",
    });
    const brick = await BrickOuter_simple.init();
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const reexport = brick.enroll({ origin_fn });

    assertEquals(
      await reexport.origin_fn("http://localhost/will-fail", {}),
      "success!",
    );
  });
});
