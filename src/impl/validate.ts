import { FetchError } from "./fetchError";

export function validate(res: Response): void {
  if (!res.ok) {
    throw new FetchError(res.status, res.statusText);
  }
}
