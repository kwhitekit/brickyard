import { Brickyard } from "@nik-kita/brickyard";
import { complete } from "./brickyard.interceptor.js";
import { hi } from "./hi.function.js";

export const bricks = Brickyard
  .init(complete())
  .enroll({
    hi,
    ok: () => true,
    hi_origin: hi,
  });
