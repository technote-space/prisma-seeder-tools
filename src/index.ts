import type {PrismaClient, FactoryDefinition} from './types';
import type {Seeder} from './seeder';
import {Runner} from './runner';

export {createDefinition} from './define';
export * from './types';
export type {Seeder};
export {Runner};
export const seed = async <P extends PrismaClient>(prisma: P, definitions: FactoryDefinition[], seeders: Seeder<P>[]): Promise<void> => {
  return new Runner(prisma, definitions, seeders).run();
};
