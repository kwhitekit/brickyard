import { Brickyard } from "../brickyard.ts";

export const {
  complete,
} = Brickyard.pre_init().intercept("", { fn: () => {} });
