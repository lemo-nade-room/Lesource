# HTTP RESTful API Resource

## 概要

RESTful APIのエンドポイントに対してアクセスできる抽象化ライブラリです。

## インストール

```sh
npm i -D @lemonaderoom/lesource
```

## 使い方

### モデルの定義

JSONに相互変換可能なモデルを定義します。zodを使用すると楽になります。

#### Encodableに準拠

Encodableをimplementsし、encode()メソッドを実装します。encode()メソッドでは、JSONに変換可能なオブジェクトを返します。

#### Decodableに準拠

Decodableに準拠するには、static decode(json: unknown): Selfを実装する必要があります。

Decodableに準拠しなくても、`type Decoder<T> = (json: unknown) => T`に準拠する関数を用意することで使用することもできます。

```ts
import { Encodable, encodeArray } from '@lemonaderoom/lesource';
import { z } from "zod" // npm i -D zod

/** ZodによるUserの定義 */
export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    birthday: z.string().datetime(),
})

/** Encodable, Decodableに準拠したモデル */
export class User implements Encodable {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly birthday: Date,
    ) {}

    encode(): unknown {
        return {
            id: this.id,
            name: this.name,
            birthday: this.birthday.toISOString(),
        }
    }

    static decode(json: unknown): User {
        const schema = UserSchema.parse(json)
        return new User(
            schema.id,
            schema.name,
            new Date(schema.birthday),
        )
    }
}
```

### HTTPResourceFactoryの生成

HTTPResourceFactoryを生成します。HTTPResourceFactoryは、HTTPResourceを生成するファクトリです。

```ts
import { HTTPResourceFactory } from '@lemonaderoom/lesource';

const rootResource = new HTTPResourceFactory({
    baseURL: 'https://example.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    beforeRequest: (config) => {
        // リクエスト前に実行される処理
        return config
    },
})
```
