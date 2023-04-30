import {DEFAULT_AFTER, DEFAULT_BEFORE, HTTPResourceImpl} from "./HTTPResourceImpl";
import {After, Before, HTTPResource} from "./HTTPResource";
import {Decodable, Decoder} from "./codable/decode";
import {Encodable} from "./codable/encode";

class Base implements Encodable {
    encode(): unknown {
        return this;
    }
}

const decoder: Decoder<Base> = (json: unknown) => new Base();

export class HTTPResourceFactory {

    private readonly root: HTTPResource<Base>

    constructor(
        {
            baseURL,
            headers = new Headers(),
            before = DEFAULT_BEFORE,
            after = DEFAULT_AFTER,
        }: {
            baseURL: string,
            headers?: Headers,
            before?: Before,
            after?: After,
        }
    ) {
        this.root = new HTTPResourceImpl(decoder, baseURL, [], headers, before, after);
    }

    /**
     * NetworkResourceを生成する
     * @param options
     */
    createOf<T extends Encodable>(options: {
            Model: Decodable<T>,
            paths: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
    }): HTTPResource<T> {
        return this.root.createOf(options);
    }

    /**
     * NetworkResourceを生成する
     * @param options
     */
    createBy<T extends Encodable>(options: {
            decoder: Decoder<T>,
            paths: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
    }): HTTPResource<T> {
        return this.root.createBy(options);
    }

    /**
     * NetworkResourceを生成する
     * @param options
     */
    createArrayOf<T extends Encodable>(options: {
            Model: Decodable<T>,
            paths: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
    }): HTTPResource<readonly T[]> {
        return this.root.createArrayOf(options);
    }

    /**
     * NetworkResourceを生成する
     * @param options
     */
    createArrayBy<T extends Encodable>(options: {
            decoder: Decoder<T>,
            paths: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
    }): HTTPResource<readonly T[]> {
        return this.root.createArrayBy(options);
    }
}
