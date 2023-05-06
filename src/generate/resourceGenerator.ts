import { GenerateOption } from "./generateOption";
import { CreatableResource } from "../method/creatable";
import { Readable, ReadableResource } from "../method/readable";
import { UpdatableResource } from "../method/updatable";
import { DeletableResource } from "../method/deletable";
import { ResourceGeneratable } from "./resourceGeneratable";

export type C_Resource<C> = CreatableResource<C> & ResourceGeneratable;
export type R_Resource<R> = ReadableResource<R> & ResourceGeneratable;
export type CR_Resource<C, R = C> = C_Resource<C> & R_Resource<R>;
export type U_Resource<U> = UpdatableResource<U> & ResourceGeneratable;
export type CU_Resource<C, U> = C_Resource<C> & U_Resource<U>;
export type RU_Resource<R, U> = R_Resource<R> & U_Resource<U>;
export type CRU_Resource<C, R, U> = C_Resource<C> & RU_Resource<R, U>;
export type D_Resource = DeletableResource & ResourceGeneratable;
export type CD_Resource<C> = C_Resource<C> & D_Resource;
export type RD_Resource<R> = R_Resource<R> & D_Resource;
export type CRD_Resource<C, R> = CR_Resource<C, R> & D_Resource;
export type UD_Resource<U> = U_Resource<U> & D_Resource;
export type CUD_Resource<C, U> = CU_Resource<C, U> & D_Resource;
export type RUD_Resource<R, U> = RU_Resource<R, U> & D_Resource;
export type CRUD_Resource<C, R, U> = CRU_Resource<C, R, U> & D_Resource;

export type PathType = string | readonly string[] | undefined;

export interface ResourceGenerator {
  <C>(type: "c", path?: PathType, option?: GenerateOption): C_Resource<C>;

  <R>(
    type: "r",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): R_Resource<R>;

  <C, R = C>(
    type: "cr",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CR_Resource<C, R>;

  <U>(type: "u", path?: PathType, option?: GenerateOption): U_Resource<U>;

  <C, U = C>(type: "cu", path?: PathType, option?: GenerateOption): CU_Resource<
    C,
    U
  >;

  <R, U = R>(
    type: "ru",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): RU_Resource<R, U>;

  <C, R = C, U = C>(
    type: "cru",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CRU_Resource<C, R, U>;

  (type: "d", path?: PathType, option?: GenerateOption): D_Resource;

  <C>(type: "cd", path?: PathType, option?: GenerateOption): CD_Resource<C>;

  <R>(
    type: "rd",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): RD_Resource<R>;

  <C, R = C>(
    type: "crd",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CRD_Resource<C, R>;

  <U>(type: "ud", path?: PathType, option?: GenerateOption): UD_Resource<U>;

  <C, U = C>(type: "cud", path?: PathType, option?: GenerateOption): CUD_Resource<
    C,
    U
  >;

  <R, U = R>(
    type: "rud",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): RUD_Resource<R, U>;

  <C, R = C, U = C>(
    type: "crud",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CRUD_Resource<C, R, U>;
}

export interface ResourceArrayGenerator {
  <C>(type: "c", path?: PathType, option?: GenerateOption): C_Resource<C>;

  <R>(
    type: "r",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): R_Resource<readonly R[]>;

  <C, R = C>(
    type: "cr",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CR_Resource<C, readonly R[]>;

  <U>(type: "u", path?: PathType, option?: GenerateOption): U_Resource<U>;

  <C, U = C>(type: "cu", path?: PathType, option?: GenerateOption): CU_Resource<
    C,
    U
  >;

  <R, U = R>(
    type: "ru",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): RU_Resource<readonly R[], U>;

  <C, R = C, U = C>(
    type: "cru",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CRU_Resource<C, readonly R[], U>;

  (type: "d", path?: PathType, option?: GenerateOption): D_Resource;

  <C>(type: "cd", path?: PathType, option?: GenerateOption): CD_Resource<C>;

  <R>(
    type: "rd",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): RD_Resource<readonly R[]>;

  <C, R = C>(
    type: "crd",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CRD_Resource<C, readonly R[]>;

  <U>(type: "ud", path?: PathType, option?: GenerateOption): UD_Resource<U>;

  <C, U = C>(type: "cud", path?: PathType, option?: GenerateOption): CUD_Resource<
    C,
    U
  >;

  <R, U = R>(
    type: "rud",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): RUD_Resource<readonly R[], U>;

  <C, R = C, U = R>(
    type: "crud",
    Model: Readable<R>,
    path?: PathType,
    option?: GenerateOption
  ): CRUD_Resource<C, readonly R[], U>;
}
