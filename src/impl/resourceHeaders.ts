export class ResourceHeaders {
  constructor(readonly headers: Headers) {}

  static init(headersInit?: HeadersInit): ResourceHeaders {
    if (headersInit == null) {
      return new ResourceHeaders(new Headers());
    }
    return new ResourceHeaders(new Headers(headersInit));
  }

  merge(merged?: ResourceHeaders): ResourceHeaders {
    if (merged == null) {
      return this;
    }
    const headers = new Headers(this.headers);
    for (const [key, value] of new Headers(merged.headers)) {
      headers.set(key, value);
    }
    return new ResourceHeaders(headers);
  }
}
