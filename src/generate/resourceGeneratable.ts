import {ResourceArrayGenerator, ResourceGenerator} from "./resourceGenerator";

export interface ResourceGeneratable {
  generate: ResourceGenerator;
  generateArray: ResourceArrayGenerator;
}
