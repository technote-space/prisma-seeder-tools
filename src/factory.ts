/* eslint-disable @typescript-eslint/no-explicit-any */
import type {Model, DelegateTypes, PrismaClient} from './types';
import Faker from 'faker';
import {getDefines} from './define';

Faker.locale = 'ja';

export class Factory<P extends PrismaClient, T extends Model, U extends Model | undefined> {
  constructor(private prisma: P, private type: DelegateTypes<P>) {
  }

  public async truncate(): Promise<Factory<P, T, U>> {
    const deleteMany = this.prisma[this.type].deleteMany as (any) => Promise<any>;
    await deleteMany({where: {}});
    return this;
  }

  public async create(override?: Partial<U>, ...params: any[]): Promise<T> {
    const create = this.prisma[this.type].create as (any) => Promise<any>;
    return create({
      data: {
        ...getDefines()[this.type as string](Faker, params),
        ...override,
      } as U,
    });
  }

  public async createMany(number: number, override?: Partial<U>, ...params: any[]): Promise<FactoryItems<T>> {
    return new FactoryItems<T>(await [...Array(number)].reduce(async prev => {
      const acc = await prev;
      return acc.concat(await this.create(override, ...params));
    }, Promise.resolve([] as T[])));
  }

  public async list(): Promise<FactoryItems<T>> {
    const findMany = this.prisma[this.type].findMany as () => Promise<Array<any>>;
    return new FactoryItems<T>(await findMany());
  }
}

export class FactoryItems<T extends Model> {
  constructor(public readonly items: Array<T>) {
  }

  public random(): T {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }
}

export const factory = <P extends PrismaClient, T extends Model, U extends Model | undefined = undefined>(prisma: P, type: DelegateTypes<P>): Factory<P, T, U> => {
  return new Factory<P, T, U>(prisma, type);
};