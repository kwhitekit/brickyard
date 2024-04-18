import { Brickyard } from "@nik-kita/brickyard";

const brickyard = Brickyard.pre_init();

export const { complete } = brickyard.intercept("hi", {
  args: ["from interception!"],
  args_strategy: "replace",
});
