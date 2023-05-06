export interface GenerateOption {
  headers?: HeadersInit;
  before?: Before;
  after?: After;
}

export type Before = () => void | Promise<void>;
export type After = (response: Response) => void | Promise<void>;

export const defaultGenerateOption = {
  headers: new Headers(),
  before: () => {},
  after: () => {},
};
