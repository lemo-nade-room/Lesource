import {Encodable} from "./codable/encode";
import {Decodable, Decoder} from "./codable/decode";
import {FetchError} from "./fetchError";

export type Before = () => void | Promise<void>;
export type After = (response: Response) => void | Promise<void>;

export type Content = Encodable | readonly Encodable[];

/** 特定のパスを1つのリソースとして通信処理を行う */
export interface HTTPResource<T extends Content> {
    /**
     * ResourceからGETで取得する
     * @throws FetchError
     */
    get(): Promise<T>;

    /**
     * ResourceにPOSTで送信する
     * @throws FetchError
     */
    post(content: T): Promise<void>;

    /**
     * ResourceにPUTで送信する
     * @throws FetchError
     */
    put(content: T): Promise<void>;

    /**
     * ResourceにDELETEで送信する
     * @throws FetchError
     */
    delete(): Promise<void>;

    /**
     * 現在のリソースをより詳細に拡張したリソースを生成する
     * @param Model 生成リソースの型
     * @param paths 現在のパスフレーズに追加するパスフレーズの配列
     * @param headers 現在のヘッダーに追加するヘッダー
     * @param before 現在のbeforeに追加するbefore
     * @param after 現在のafterに追加するafter
     */
    createOf<K extends Encodable>(
        Model: Decodable<K>,
        {
            paths,
            headers,
            before,
            after,
        }: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResource<K>;

    /**
     * 現在のリソースをより詳細に拡張したリソースを生成する
     * @param decoder 生成リソースの型への変換関数
     * @param paths 現在のパスフレーズに追加するパスフレーズの配列
     * @param headers 現在のヘッダーに追加するヘッダー
     * @param before 現在のbeforeに追加するbefore
     * @param after 現在のafterに追加するafter
     */
    createBy<K extends Encodable>(
        decoder: Decoder<K>,
        {
            paths,
            headers,
            before,
            after,
        }: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResource<K>;

    /**
     * 現在のリソースをより詳細に拡張した配列リソースを生成する
     * @param Model 生成リソースの型
     * @param paths 現在のパスフレーズに追加するパスフレーズの配列
     * @param headers 現在のヘッダーに追加するヘッダー
     * @param before 現在のbeforeに追加するbefore
     * @param after 現在のafterに追加するafter
     */
    createArrayOf<K extends Encodable>(
        Model: Decodable<K>,
        {
            paths,
            headers,
            before,
            after,
        }: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResource<readonly K[]>;

    /**
     * 現在のリソースをより詳細に拡張した配列リソースを生成する
     * @param decoder 生成リソースの型への変換関数
     * @param paths 現在のパスフレーズに追加するパスフレーズの配列
     * @param headers 現在のヘッダーに追加するヘッダー
     * @param before 現在のbeforeに追加するbefore
     * @param after 現在のafterに追加するafter
     */
    createArrayBy<K extends Encodable>(
        decoder: Decoder<K>,
        {
            paths,
            headers,
            before,
            after,
        }: {
            paths?: readonly string[],
            headers?: Headers,
            before?: Before,
            after?: After
        }
    ): HTTPResource<readonly K[]>;
}
