import {After, Before, Content, HTTPResource} from "./HTTPResource";
import {validate} from "./fetchError";
import {Encodable, encodeArray} from "./codable/encode";
import {Decodable, decodeArrayAs, decodeArrayBy, Decoder} from "./codable/decode";

export const DEFAULT_BEFORE: Before = () => {};
export const DEFAULT_AFTER: After = () => {};

export  class HTTPResourceImpl<T extends Content>  implements HTTPResource<T> {
    constructor(
        readonly decoder: (object: unknown) => T,
        readonly baseURL: string,
        readonly paths: readonly string[],
        readonly headers: Readonly<Headers>,
        readonly before: Before,
        readonly after: After
    ) {}

    async get(): Promise<T> {
        await this.before();
        const response = await fetch(this.path, {
            method: "GET",
            headers: this.headers,
        });
        validate(response)
        const json: unknown = await response.json();
        await this.after(response);
        return this.decoder(json);
    }

    async post(content: T): Promise<void> {
        await this.before();
        const response = await fetch(this.path, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(this.encodeContent(content)),
        });
        await this.after(response);
        validate(response)
    }

    async put(content: T): Promise<void> {
        await this.before();
        const response = await fetch(this.path, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(this.encodeContent(content)),
        });
        await this.after(response);
        validate(response)
    }

    async delete(): Promise<void> {
        await this.before();
        const response = await fetch(this.path, {
            method: "DELETE",
            headers: this.headers,
        });
        await this.after(response);
        validate(response)
    }

    createOf<K extends Encodable>(
        Model: Decodable<K>,
        {
            paths = [],
            headers = new Headers(),
            before = DEFAULT_BEFORE,
            after = DEFAULT_AFTER,
        }: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResourceImpl<K> {
        return new HTTPResourceImpl(
            (json: unknown) => Model.decode(json),
            this.baseURL,
            this.paths.concat(paths),
            this.mergeHeaders(headers),
            this.mergeBefore(before),
            this.mergeAfter(after)
        );
    }

    createBy<K extends Encodable>(
        decoder: Decoder<K>,
        {
            paths = [],
            headers = new Headers(),
            before = DEFAULT_BEFORE,
            after = DEFAULT_AFTER,
        }: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResourceImpl<K> {
        return new HTTPResourceImpl(
            decoder,
            this.baseURL,
            this.paths.concat(paths),
            this.mergeHeaders(headers),
            this.mergeBefore(before),
            this.mergeAfter(after)
        );
    }

    createArrayOf<K extends Encodable>(
        Model: Decodable<K>,
        {
            paths = [],
            headers = new Headers(),
            before = DEFAULT_BEFORE,
            after = DEFAULT_AFTER,
        }: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResourceImpl<readonly K[]> {
        return new HTTPResourceImpl(
            (json: unknown) => decodeArrayAs(Model, json),
            this.baseURL,
            this.paths.concat(paths),
            this.mergeHeaders(headers),
            this.mergeBefore(before),
            this.mergeAfter(after)
        );
    }

    createArrayBy<K extends Encodable>(
        decoder: Decoder<K>,
        {
            paths = [],
            headers = new Headers(),
            before = DEFAULT_BEFORE,
            after = DEFAULT_AFTER,
        }: {
            paths: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResourceImpl<readonly K[]> {
        return new HTTPResourceImpl(
            (json: unknown) => decodeArrayBy(decoder, json),
            this.baseURL,
            this.paths.concat(paths),
            this.mergeHeaders(headers),
            this.mergeBefore(before),
            this.mergeAfter(after)
        );
    }

    private get path(): string {
        return `${this.baseURL}/${this.paths.join("/")}`;
    }

    private mergeHeaders(headers: Headers): Headers {
        const result = new Headers(this.headers);
        headers.forEach((value, key) => result.set(key, value));
        return result;
    }

    private mergeBefore(before: Before): Before {
        return () => {
            this.before();
            before();
        };
    }

    private mergeAfter(after: After): After {
        return (response) => {
            after(response);
            this.after(response);
        };
    }

    private encodeContent(content: T): unknown {
        if (Array.isArray(content)) {
            const encodableArray = content as readonly Encodable[];
            return encodeArray(encodableArray);
        } else {
            const encodable = content as Encodable;
            return encodable.encode();
        }
    }
}