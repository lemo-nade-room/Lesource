import { PathType } from "../generate/resourceGenerator";

export class Paths {
  constructor(readonly paths: readonly string[]) {}

  static init(path: PathType): Paths {
    if (path == null) {
      return new Paths([]);
    }
    if (Array.isArray(path)) {
      return new Paths(path);
    }
    return new Paths([path as string]);
  }

  url(baseURL: string): string {
    return `${baseURL}/${this.paths.join("/")}`;
  }

  append(appended: Paths): Paths {
    return new Paths(this.paths.concat(appended.paths));
  }
}
