import { EmailSubscription } from '@prisma/client'
import { prisma } from '../utils/db';


export async function findAllLessThanMinimumPercentThreshold(minimumPercent: number): Promise<EmailSubscription[]> {
    return prisma.emailSubscription.findMany({
        where: {
            minimumPriceDifferencePercent: {
                lte: minimumPercent,
            },
        }
    });
}

export async function insert(emailAddress: string, minimumPriceDifferencePercent: number): Promise<EmailSubscription> {
    return prisma.emailSubscription.create({ data: { emailAddress, minimumPriceDifferencePercent } });
}

export async function remove(emailAddress: string): Promise<EmailSubscription> {
    return prisma.emailSubscription.delete({ where: { emailAddress } })
}
