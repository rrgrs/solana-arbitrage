import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import { prisma } from './db';

jest.mock('./db', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
    prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
    mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<{
    [K in keyof PrismaClient]: Omit<PrismaClient[K], "groupBy">;
}>;