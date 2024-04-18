import { Brickyard } from "@nik-kita/brickyard";
import { hi } from "./hi.function.ts";
import { complete } from "./brickyard.intercept.ts";

const brickyard = Brickyard.init(complete());

export const bricks = brickyard.enroll({
  hi,
});
