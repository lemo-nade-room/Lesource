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
     * @param Model 生成リソースの型
     * @param options
     */
    createOf<T extends Encodable>(
        Model: Decodable<T>,
        options: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
        }
    ): HTTPResource<T> {
        return this.root.createOf(Model, options);
    }

    /**
     * NetworkResourceを生成する
     * @param decoder 生成リソースの型への変換関数
     * @param options
     */
    createBy<T extends Encodable>(
        decoder: Decoder<T>,
        options: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
        }
    ): HTTPResource<T> {
        return this.root.createBy(decoder, options);
    }

    /**
     * NetworkResourceを生成する
     * @param Model 生成リソースの型
     * @param options
     */
    createArrayOf<T extends Encodable>(
        Model: Decodable<T>,
        options: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
        }
    ): HTTPResource<readonly T[]> {
        return this.root.createArrayOf(Model, options);
    }

    /**
     * NetworkResourceを生成する
     * @param decoder 生成リソースの型への変換関数
     * @param options
     */
    createArrayBy<T extends Encodable>(
        decoder: Decoder<T>,
        options: {
            paths: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After,
        }
    ): HTTPResource<readonly T[]> {
        return this.root.createArrayBy(decoder, options);
    }
}
