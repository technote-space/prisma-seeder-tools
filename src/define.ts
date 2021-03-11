/* eslint-disable @typescript-eslint/no-explicit-any */
import type {Model, DelegateTypes, DefineCallback, PrismaClient} from './types';

const defines: Record<string, DefineCallback<any>> = {};

export const define = <P extends PrismaClient, T extends Model>(type: DelegateTypes<P>, callback: DefineCallback<T>): void => {
  defines[type as string] = callback;
};

export const getDefines = (): Record<string, DefineCallback<any>> => defines;
