import { Creatable } from "../method/creatable";
import { Updatable } from "../method/updatable";
import { Resource } from "./resource";
import { GenerateOption } from "../generate/generateOption";
import { ResourceHeaders } from "./resourceHeaders";
import { Paths } from "./paths";
import { ResourceBefore } from "./resourceBefore";
import { ResourceAfter } from "./resourceAfter";
import { ResourceGeneratable } from "../generate/resourceGeneratable";
import {ResourceArrayGenerator, ResourceGenerator} from "../generate/resourceGenerator";

class Base implements Creatable<Base>, Updatable<Base> {
  get createJSON(): Base {
    return this;
  }
  get updateJSON(): Base {
    return this;
  }

  static readJSON(json: unknown): Base {
    return new Base();
  }
}

export class ResourceFactory implements ResourceGeneratable {
  private constructor(private readonly root: Resource<Base, Base, Base>) {}

  static readonly init = (
    baseURL: string,
    options: GenerateOption
  ): ResourceFactory => {
    return new ResourceFactory(
      new Resource<Base, Base, Base>(
        (json: unknown) => Base.readJSON(json),
        baseURL,
        new Paths([]),
        ResourceHeaders.init(options?.headers),
        new ResourceBefore(options?.before),
        new ResourceAfter(options?.after)
      )
    );
  };

  readonly generate: ResourceGenerator = (...args: any[]): any => {
    // @ts-ignore
    return this.root.generate(...args);
  };

  readonly generateArray: ResourceArrayGenerator = (...args: any[]): any => {
    // @ts-ignore
    return this.root.generateArray(...args);
  };

  merge(option?: GenerateOption): ResourceFactory {
    return new ResourceFactory(
      new Resource<Base, Base, Base>(
        this.root.decoder,
        this.root.baseURL,
        this.root.paths,
        this.root.headers.merge(ResourceHeaders.init(option?.headers)),
        this.root.before.andThen(option?.before),
        this.root.after.andThen(option?.after)
      )
    );
  }

  get option() {
    return this.root.option;
  }
}
