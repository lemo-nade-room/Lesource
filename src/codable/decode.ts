export type Decoder<T> = (json: unknown) => T;

export interface Decodable<Self> {
  new (...arg: any): Self;
  decode: Decoder<Self>;
}

export function decodeArrayAs<T>(
  decodable: Decodable<T>,
  json: unknown
): readonly T[] {
  if (!Array.isArray(json)) {
    throw new Error("json is not array");
  }
  return json.map((el) => decodable.decode(el));
}

export function decodeArrayBy<T>(
  decoder: Decoder<T>,
  json: unknown
): readonly T[] {
  if (!Array.isArray(json)) {
    throw new Error("json is not array");
  }
  return json.map((el) => decoder(el));
}
