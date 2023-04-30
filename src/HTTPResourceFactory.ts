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


    private constructor(private readonly root: HTTPResourceImpl<Base>) {}

    /**
     * Factoryインスタンスを生成する
     * @param baseURL ベースURL
     * @param headers ヘッダー
     * @param before リクエスト前処理
     * @param after リクエスト後処理
     */
    static readonly init = (
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
    ) => new HTTPResourceFactory(new HTTPResourceImpl(decoder, baseURL, [], headers, before, after));

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

    /**
     * Factoryの設定を上書きする
     */
   update(options: {
       baseURL?: string,
       headers?: Headers,
       before?: Before,
       after?: After,
   }): HTTPResourceFactory {
        return HTTPResourceFactory.init({
            baseURL: options.baseURL ?? this.root.baseURL,
            headers: options.headers ?? this.root.headers,
            before: options.before ?? this.root.before,
            after: options.after ?? this.root.after,
        })
   }

    /**
     * Factoryの設定を追加する
     * @param options
     */
   merge(options: {
       headers?: Headers,
       before?: Before,
       after?: After,
   }): HTTPResourceFactory {
        const next = this.root.createBy(decoder, options)
        return new HTTPResourceFactory(next)
   }
}
