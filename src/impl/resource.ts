import { Creatable, CreatableResource } from "../method/creatable";
import { Updatable, UpdatableResource } from "../method/updatable";
import { GenerateOption } from "../generate/generateOption";
import { Paths } from "./paths";
import { ResourceHeaders } from "./resourceHeaders";
import {
  Readable,
  ReadableResource,
  readArrayAs,
  Reader,
} from "../method/readable";
import { ResourceGeneratable } from "../generate/resourceGeneratable";
import { DeletableResource } from "../method/deletable";
import {
  CRUD_Resource,
  CUD_Resource,
  PathType,
  ResourceArrayGenerator,
  ResourceGenerator,
} from "../generate/resourceGenerator";
import { ResourceType } from "../generate/resourceType";
import { ResourceBefore } from "./resourceBefore";
import { ResourceAfter } from "./resourceAfter";
import { validate } from "./validate";

export class Resource<C, R, U>
  implements
    CreatableResource<C>,
    ReadableResource<R>,
    UpdatableResource<U>,
    DeletableResource,
    ResourceGeneratable
{
  constructor(
    readonly decoder: Reader<R>,
    readonly baseURL: string,
    readonly paths: Paths,
    readonly headers: ResourceHeaders,
    readonly before: ResourceBefore,
    readonly after: ResourceAfter
  ) {}

  async create(content: Creatable<C>): Promise<void> {
    const body = JSON.stringify(content.createJSON);
    await this.before.call();
    const response = await fetch(this.url, this.requestInit("POST", body));
    this.after.call(response);
    validate(response);
  }

  async read(): Promise<R> {
    await this.before.call();
    const response = await fetch(this.url, this.requestInit("GET"));
    this.after.call(response);
    validate(response);
    const json: unknown = await response.json();
    return this.decoder(json);
  }

  async update(content: Updatable<U>): Promise<void> {
    const body = JSON.stringify(content.updateJSON);
    await this.before.call();
    const response = await fetch(this.url, this.requestInit("PUT", body));
    this.after.call(response);
    validate(response);
  }

  async delete(): Promise<void> {
    await this.before.call();
    const response = await fetch(this.url, this.requestInit("DELETE"));
    this.after.call(response);
    validate(response);
  }

  private requestInit(method: string, body?: string): RequestInit {
    return {
      method,
      headers: this.headers.headers,
      body,
    };
  }

  private get url(): string {
    return this.paths.url(this.baseURL);
  }

  readonly generate: ResourceGenerator = <
    C extends Creatable<C>,
    R,
    U extends Updatable<U>
  >(
    type: ResourceType,
    ModelOrPath: Readable<R> | PathType,
    pathOrOption?: PathType | GenerateOption,
    option?: GenerateOption
  ): any => {
    if (type.includes("r")) {
      return this.generateCRUD_Resource(
        (json: unknown) => (ModelOrPath as Readable<R>).readJSON(json),
        pathOrOption as PathType,
        option
      );
    } else {
      return this.generateCUD_Resource(
        ModelOrPath as PathType,
        pathOrOption as GenerateOption
      );
    }
  };

  readonly generateArray: ResourceArrayGenerator = <C, R = C, U = C>(
    type: ResourceType,
    ModelOrPath: Readable<R> | PathType,
    pathOrOption?: PathType | GenerateOption,
    option?: GenerateOption
  ): any => {
    if (type.includes("r")) {
      // @ts-ignore
      return this.generateCRUD_Resource(
        (json: unknown) => readArrayAs(ModelOrPath as Readable<R>, json),
        pathOrOption as PathType,
        option
      );
    } else {
      return this.generateCUD_Resource(
        ModelOrPath as PathType,
        pathOrOption as GenerateOption
      );
    }
  };

  private generateCRUD_Resource<R, C = R, U = C>(
    reader: Reader<R>,
    path: PathType,
    option?: GenerateOption
  ): CRUD_Resource<C, R, U> {
    return new Resource<C, R, U>(
      reader,
      this.baseURL,
      this.paths.append(Paths.init(path)),
      this.headers.merge(ResourceHeaders.init(option?.headers)),
      this.before.andThen(option?.before),
      this.after.andThen(option?.after)
    ) as any;
  }

  private generateCUD_Resource<C, U = C>(
    path: PathType,
    option?: GenerateOption
  ): CUD_Resource<C, U> {
    return new Resource<C, R, U>(
      this.decoder,
      this.baseURL,
      this.paths.append(Paths.init(path)),
      this.headers.merge(ResourceHeaders.init(option?.headers)),
      this.before.andThen(option?.before),
      this.after.andThen(option?.after)
    ) as any;
  }

  get option() {
    return {
      headers: this.headers.headers,
      before: this.before,
      after: this.after,
    };
  }
}
