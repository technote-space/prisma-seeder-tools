/* eslint-disable @typescript-eslint/no-explicit-any */
import type {PrismaClient, Model, DelegateTypes, FactoryDefinition, DefineCallback} from './types';
import type {Seeder} from './seeder';

export class Runner<P extends PrismaClient> {
  private __hasRun = false;
  private readonly __definitions: Record<string, DefineCallback<any>>;

  public constructor(
    private prisma: P,
    definitions: FactoryDefinition[],
    private seeders: Seeder<P>[],
  ) {
    this.__definitions = Object.assign({}, ...definitions.map(item => ({[item[0] as string]: item[1]})));
  }

  public async run(): Promise<void> {
    if (this.__hasRun) {
      return;
    }

    this.__hasRun = true;
    await this.seeders.reduce(async(prev, seeder) => {
      await prev;
      await seeder.execute(this.__definitions);
    }, Promise.resolve());
    await this.prisma.$disconnect();
  }

  public getDefine<T extends Model>(type: DelegateTypes<P>): DefineCallback<T> {
    return this.__definitions[type as string];
  }
}
