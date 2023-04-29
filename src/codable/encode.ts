export interface Encodable {
  /** encode to JSON Object */
  encode(): unknown;
}

export function encodeArray<T extends Encodable>(
  array: readonly T[]
): unknown[] {
  return array.map((el) => el.encode());
}
