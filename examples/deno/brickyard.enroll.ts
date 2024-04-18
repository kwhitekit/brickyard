import { Brickyard } from "@nik-kita/brickyard";
import { hi as hi_origin } from "./hi.function.ts";

const brickyard = await Brickyard.init(
  import.meta.resolve("./brickyard.intercept.ts"),
);

export const { hi } = brickyard.enroll({
  hi: hi_origin,
});
