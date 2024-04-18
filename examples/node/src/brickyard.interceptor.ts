import { Brickyard } from "@nik-kita/brickyard";

export const { complete } = Brickyard
  .pre_init()
  .intercept("hi", { args: ["(merged args)"], args_strategy: "replace" })
  .and("ok", { fn: () => false })
  .and("no_such_function", { args: [], args_strategy: "merge" });
