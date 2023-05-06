import { After, defaultGenerateOption } from "../generate/generateOption";

export class ResourceAfter {
  constructor(readonly func: After = defaultGenerateOption.after) {}

  call(response: Response): void {
    this.func(response);
  }

  andThen(append?: After): ResourceAfter {
    if (append == null) {
      return this;
    }
    return new ResourceAfter((response) => {
      this.call(response);
      append(response);
    });
  }
}
