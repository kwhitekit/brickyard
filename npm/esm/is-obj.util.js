export function is_obj(obj) {
  return obj != null && obj.constructor.name === "Object";
}
