import type {PrismaClient} from './types';
import type {Seeder} from './seeder';

export const seed = async <P extends PrismaClient>(prisma: P, seeders: Seeder<P>[]): Promise<void> => {
  await seeders.reduce(async(prev, seeder) => {
    await prev;
    await seeder.run();
  }, Promise.resolve());
  await prisma.$disconnect();
};
