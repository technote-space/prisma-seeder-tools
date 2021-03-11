import type {PrismaClient, FactoryDefinition} from './types';
import type {Seeder} from './seeder';

export {createDefinition} from './define';
export type {Seeder};

export const seed = async <P extends PrismaClient>(prisma: P, definitions: FactoryDefinition<P>[], seeders: Seeder<P>[]): Promise<void> => {
  await seeders.reduce(async(prev, seeder) => {
    await prev;
    await seeder.execute(definitions);
  }, Promise.resolve());
  await prisma.$disconnect();
};
