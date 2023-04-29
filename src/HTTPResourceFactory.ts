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

    /**
     * @param baseURL URLドメイン
     * @param headers 共通ヘッダー
     * @param before 通信時の共通の前処理
     * @param after 通信時の共通の後処理
     */
    constructor(
        baseURL: string,
        headers: Headers = new Headers(),
        before: Before = DEFAULT_BEFORE,
        after: After = DEFAULT_AFTER,
    ) {
        this.root = new HTTPResourceImpl(decoder, baseURL, [], new Headers(), before, after);
    }

    /**
     * NetworkResourceを生成する
     * @param paths '/api/resource' であれば ['api', 'resource'] のようなbaseURLにつながるパスフレーズの配列
     * @param Model T型
     * @param headers 通信時のヘッダ
     * @param before 通信時の共通の前処理
     * @param after 通信時の共通の後処理
     */
    createOf<T extends Encodable>(
        Model: Decodable<T>,
        paths: readonly string[],
        headers: Headers = new Headers(),
        before: Before = DEFAULT_BEFORE,
        after: After = DEFAULT_AFTER
    ): HTTPResource<T> {
        return this.root.createOf(Model, paths, headers, before, after);
    }

    /**
     * NetworkResourceを生成する
     * @param paths '/api/resource' であれば ['api', 'resource'] のようなbaseURLにつながるパスフレーズの配列
     * @param decoder T型への変換関数
     * @param headers 通信時のヘッダ
     * @param before 通信時の共通の前処理
     * @param after 通信時の共通の後処理
     */
    createBy<T extends Encodable>(
        decoder: Decoder<T>,
        paths: readonly string[],
        headers: Headers = new Headers(),
        before: Before = DEFAULT_BEFORE,
        after: After = DEFAULT_AFTER
    ): HTTPResource<T> {
        return this.root.createBy(decoder, paths, headers, before, after);
    }

    /**
     * NetworkResourceを生成する
     * @param paths '/api/resource' であれば ['api', 'resource'] のようなbaseURLにつながるパスフレーズの配列
     * @param Model T型
     * @param headers 通信時のヘッダ
     * @param before 通信時の共通の前処理
     * @param after 通信時の共通の後処理
     */
    createArrayOf<T extends Encodable>(
        Model: Decodable<T>,
        paths: readonly string[],
        headers: Headers = new Headers(),
        before: Before = DEFAULT_BEFORE,
        after: After = DEFAULT_AFTER
    ): HTTPResource<readonly T[]> {
        return this.root.createArrayOf(Model, paths, headers, before, after);
    }

    /**
     * NetworkResourceを生成する
     * @param paths '/api/resource' であれば ['api', 'resource'] のようなbaseURLにつながるパスフレーズの配列
     * @param decoder T型への変換関数
     * @param headers 通信時のヘッダ
     * @param before 通信時の共通の前処理
     * @param after 通信時の共通の後処理
     */
    createArrayBy<T extends Encodable>(
        decoder: Decoder<T>,
        paths: readonly string[],
        headers: Headers = new Headers(),
        before: Before = DEFAULT_BEFORE,
        after: After = DEFAULT_AFTER
    ): HTTPResource<readonly T[]> {
        return this.root.createArrayBy(decoder, paths, headers, before, after);
    }
}
