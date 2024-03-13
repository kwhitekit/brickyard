import { assertEquals } from "deno/assert";
import { BrickOuter_simple } from "./brick-outer.simple.ts";

function origin_fn(url: string, config: RequestInit) {
  return fetch(url, config).catch((e) => "error!");
}

Deno.test("BrickOuter_simple", async (t) => {
  await t.step("enrolled app should worked without changes", async () => {
    const brick = BrickOuter_simple.init();
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const intercepted = brick.enroll(origin_fn, "origin_fn");

    assertEquals(await intercepted("http://localhost/will-fail", {}), "error!");
  });
  await t.step("enrolled app should change implementation", async () => {
    const brick = BrickOuter_simple.init();
    brick.intercept("origin_fn", { fn: () => "success!" });
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const intercepted = brick.enroll(origin_fn, "origin_fn");

    assertEquals(
      await intercepted("http://localhost/will-fail", {}),
      "success!",
    );
  });
});
