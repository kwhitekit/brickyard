import { Brickyard } from "@nik-kita/brickyard";

const brickyard = Brickyard.pre_init();

export default brickyard.intercept("hi", {
  args: ["from interception!"],
  args_strategy: "replace",
});
