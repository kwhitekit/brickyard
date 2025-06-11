"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_obj = is_obj;
function is_obj(obj) {
  return obj != null && obj.constructor.name === "Object";
}
