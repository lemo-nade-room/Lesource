export type Reader<T> = (json: unknown) => T;
export interface Readable<Self> {
  new (...arg: any): Self;
  readJSON: Reader<Self>;
}

export interface ReadableResource<T> {
  read(): Promise<T>;
}

export function readArrayAs<T>(
    readable: Readable<T>,
    json: unknown
): readonly T[] {
  if (!Array.isArray(json)) {
    throw new Error("json is not array");
  }
  return json.map((el) => readable.readJSON(el));
}