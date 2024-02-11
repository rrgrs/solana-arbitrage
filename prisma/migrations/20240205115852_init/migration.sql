-- CreateTable
CREATE TABLE "SolanaExchangePrice" (
    "id" SERIAL NOT NULL,
    "exchangeName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolanaExchangePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolanaMaximumPriceDifference" (
    "id" SERIAL NOT NULL,
    "highestExchangePriceId" INTEGER NOT NULL,
    "currentHighestExchangePrice" DECIMAL(10,2) NOT NULL,
    "lowestExchangePriceId" INTEGER NOT NULL,
    "currentLowestExchangePrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolanaMaximumPriceDifference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSubscription" (
    "id" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "minimumPriceDifferencePercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolanaExchangePrice_exchangeName_key" ON "SolanaExchangePrice"("exchangeName");

-- CreateIndex
CREATE UNIQUE INDEX "SolanaMaximumPriceDifference_highestExchangePriceId_key" ON "SolanaMaximumPriceDifference"("highestExchangePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "SolanaMaximumPriceDifference_lowestExchangePriceId_key" ON "SolanaMaximumPriceDifference"("lowestExchangePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_emailAddress_key" ON "EmailSubscription"("emailAddress");

-- AddForeignKey
ALTER TABLE "SolanaMaximumPriceDifference" ADD CONSTRAINT "SolanaMaximumPriceDifference_highestExchangePriceId_fkey" FOREIGN KEY ("highestExchangePriceId") REFERENCES "SolanaExchangePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolanaMaximumPriceDifference" ADD CONSTRAINT "SolanaMaximumPriceDifference_lowestExchangePriceId_fkey" FOREIGN KEY ("lowestExchangePriceId") REFERENCES "SolanaExchangePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
