export interface Creatable<T> {
  get createJSON(): T;
}

export interface CreatableResource<C> {
  create(content: Creatable<C>): Promise<void>;
}

export function createArray<TO, FROM extends Creatable<TO>>(
  array: readonly FROM[]
): readonly TO[] {
  return array.map((el) => el.createJSON);
}
