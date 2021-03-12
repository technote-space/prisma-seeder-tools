/* eslint-disable @typescript-eslint/no-explicit-any */
import type {DelegateTypes, PrismaClient} from './types';
import {factory, Factory} from './factory';
import {DefineCallback} from './types';

export abstract class Seeder<P extends PrismaClient> {
  private readonly factories: Record<string, Factory<P, any, any>>;
  private definitions: Record<string, DefineCallback<any>> | undefined;

  protected constructor(private prisma: P) {
    this.factories = {};
  }

  protected factory(type: DelegateTypes<P>): Factory<P, any, any> {
    if (!((type as string) in this.factories)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.factories[type as string] = factory(this.prisma, this.definitions!, type);
    }

    return this.factories[type as string];
  }

  protected abstract run(): Promise<void>;

  public async execute(definitions: Record<string, DefineCallback<any>>): Promise<void> {
    this.definitions = definitions;
    return this.run();
  }
}
