/* eslint-disable @typescript-eslint/no-explicit-any */
import type Faker from 'faker';

export type Model = Record<string, any>;
export type PrismaClient = {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  [key: string]: any;
};
export type DelegateTypes<T extends PrismaClient> = {
  [key in keyof T]: T[key] extends {
    findMany;
    create;
    deleteMany;
  } ? key : never
}[keyof T];
export type DefineCallback<T extends Model> = (faker: Faker.FakerStatic, ...params: any[]) => Partial<T>;
export type FactoryDefinition<P extends PrismaClient> = [DelegateTypes<P>, DefineCallback<any>];
