/* eslint-disable @typescript-eslint/no-explicit-any */
import type {Model, DelegateTypes, PrismaClient, FactoryDefinition, DefineCallback} from './types';
import Faker from 'faker';

Faker.locale = 'ja';

export class Factory<P extends PrismaClient, T extends Model, U extends Model | undefined> {
  private readonly factories: Record<string, DefineCallback<any>>;

  constructor(private prisma: P, factories: FactoryDefinition<P>[], private type: DelegateTypes<P>) {
    this.factories = Object.assign({}, ...factories.map(item => ({[item[0] as string]: item[1]})));
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
        ...this.factories[this.type as string](Faker, params),
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

  public get count(): number {
    return this.items.length;
  }

  public random(): T {
    return this.items[Math.floor(Math.random() * this.count)];
  }
}

export const factory = <P extends PrismaClient, T extends Model, U extends Model | undefined = undefined>(prisma: P, factories: FactoryDefinition<P>[], type: DelegateTypes<P>): Factory<P, T, U> => {
  return new Factory<P, T, U>(prisma, factories, type);
};
