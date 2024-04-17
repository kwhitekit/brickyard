export function is_obj<
  T extends object | Record<string, any> = Record<string, any>,
>(obj: unknown): obj is T {
  return obj != null && obj.constructor.name === "Object";
}
