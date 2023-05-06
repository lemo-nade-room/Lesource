export interface Updatable<U> {
  get updateJSON(): U;
}

export interface UpdatableResource<U> {
  update(content: Updatable<U>): Promise<void>;
}

export function updateArray<TO, FROM extends Updatable<TO>>(
  array: readonly FROM[]
): readonly TO[] {
  return array.map((el) => el.updateJSON);
}
