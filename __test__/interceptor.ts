import { Brickyard } from "../src/brickyard.ts";

export const {
  complete,
} = Brickyard.pre_init().intercept("", { fn: () => {} });
