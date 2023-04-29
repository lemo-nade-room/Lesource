import { describe, test, expect } from "vitest";
import { decodeArrayAs, decodeArrayBy } from "./decode";

class DecodableModel {
  constructor(readonly id: number, readonly date: Date) {}

  static decode(json: unknown) {
    if (!(typeof json === "object" && json != null)) {
      throw new Error();
    }
    if (!("id" in json && typeof json.id === "number")) {
      throw new Error();
    }
    if (!("date" in json && typeof json.date === "string")) {
      throw new Error();
    }
    return new DecodableModel(json.id, new Date(json.date));
  }
}

const decoder = (json: unknown) => DecodableModel.decode(json);

describe("Decode Tests", () => {
  test("Array Decode As Decodable Test", () => {
    const json = [
      { id: 1, date: "2020-01-01" },
      { id: 2, date: "2020-01-02" },
      { id: 3, date: "2020-01-03" },
    ];
    const expected = [
      new DecodableModel(1, new Date("2020-01-01")),
      new DecodableModel(2, new Date("2020-01-02")),
      new DecodableModel(3, new Date("2020-01-03")),
    ];
    const actual = decodeArrayAs(DecodableModel, json);
    expect(actual).toEqual(expected);
  });
  test("Array Decode By Decodable Test", () => {
    const json = [
      { id: 1, date: "2020-01-01" },
      { id: 2, date: "2020-01-02" },
      { id: 3, date: "2020-01-03" },
    ];
    const expected = [
      new DecodableModel(1, new Date("2020-01-01")),
      new DecodableModel(2, new Date("2020-01-02")),
      new DecodableModel(3, new Date("2020-01-03")),
    ];
    const actual = decodeArrayBy(decoder, json);
    expect(actual).toEqual(expected);
  });
});
