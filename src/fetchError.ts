export class FetchError {
    constructor(readonly status: number, message: string) {}
}

/**
 * @param res
 * @throws FetchError
 */
export function validate(res: Response): void {
    if (!res.ok) {
        throw new FetchError(res.status, res.statusText);
    }
}