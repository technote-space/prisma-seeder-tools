/* eslint-disable @typescript-eslint/no-explicit-any */
import type {DelegateTypes, PrismaClient} from './types';
import {factory, Factory} from './factory';

export abstract class Seeder<P extends PrismaClient> {
  protected factories: Record<string, Factory<P, any, any>>;

  protected constructor(private prisma: P) {
    this.factories = {};
  }

  protected factory(type: DelegateTypes<P>): Factory<P, any, any> {
    if (!((type as string) in this.factories)) {
      this.factories[type as string] = factory(this.prisma, type);
    }

    return this.factories[type as string];
  }

  abstract run(): Promise<void>;
}
