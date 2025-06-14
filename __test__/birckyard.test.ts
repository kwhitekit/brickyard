import { assertEquals } from "@std/assert";
import { Brickyard } from "../src/brickyard.ts";

function origin_fn(url: string, config: RequestInit) {
  return fetch(url, config).catch((e) => "error!");
}

Deno.test("Brickyard", async (t) => {
  await t.step("enrolled app should worked without changes", async () => {
    const brickyard = Brickyard.init(Brickyard.pre_init().complete());
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const reexport = brickyard.enroll({ origin_fn });

    assertEquals(
      await reexport.origin_fn("http://localhost/will-fail", {}),
      "error!",
    );
  });
  await t.step("enrolled app should change implementation", async () => {
    const interceptor = Brickyard
      .pre_init()
      .intercept("origin_fn", {
        fn: () => "success!",
      })
      .intercept("something", {
        args: ["no-such function"],
        args_strategy: "replace",
      })
      .complete();
    const brickyard = Brickyard.init(interceptor);
    const res = await origin_fn("http://localhost/will-fail", {});

    assertEquals(res, "error!");

    const reexport = brickyard.enroll({ origin_fn });

    assertEquals(
      await reexport.origin_fn("http://localhost/will-fail", {}),
      "success!",
    );
  });
});
