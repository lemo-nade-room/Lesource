import { Before, defaultGenerateOption } from "../generate/generateOption";

export class ResourceBefore {
  constructor(readonly func: Before = defaultGenerateOption.before) {}

  call(): void {
    this.func();
  }

  andThen(append?: Before): ResourceBefore {
    if (append == null) {
      return this;
    }
    return new ResourceBefore(() => {
      this.call();
      append();
    });
  }
}
