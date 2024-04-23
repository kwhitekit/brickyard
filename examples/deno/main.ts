import { bricks } from "./brickyard.enroll.ts";

console.log(bricks.hi("Man")); // should print "Hi from interception!"
console.log(bricks.hi_origin("Man")); // should print "Hi Man!"
console.log(bricks.ok()); // should print "false"
