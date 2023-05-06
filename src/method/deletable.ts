export interface DeletableResource {
  delete(): Promise<void>;
}
