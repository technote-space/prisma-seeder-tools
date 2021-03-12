/* eslint-disable @typescript-eslint/no-explicit-any */
import type {Model, DelegateTypes, DefineCallback, PrismaClient, FactoryDefinition} from './types';

export const createDefinition = <P extends PrismaClient, T extends Model>(type: DelegateTypes<P>, callback: DefineCallback<T>): FactoryDefinition => [
  type as string,
  callback,
];
