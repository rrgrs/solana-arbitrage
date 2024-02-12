## Solana Arbitrage

The intent of this application is to detect arbitrage opportunities for the crypto coin called Solana. An arbitrage is when there's a price discrepency between two crypto marketplaces. The difference in price allows a user to buy coins on one exchange then sell on the other for a profit. Solana was chosen because it is fast and transfers are cheap, so in theory one can quickly react to the arbitrage opportunity before it disappears.

This application has three background tasks and one webserver. The background tasks pull in updated prices, calculate the price maximum price difference, and sends emails respectively. There is a web frontend that allows users to view the current prices, the current maximim price difference, and a form for users to input their email address to receive alerts when an arbitrage opportunity is detected.

### Requirements
1. node js (developed using version 18.4.0)
2. npm (developed using version 8.12.1)
3. docker (developed using version 4.2.71)

### Installation
1. run docker containers via `docker compose up`
2. install dependencies via `npm install`
3. migrate the database via `npx prisma migrate dev`
4. copy .env.example to .env via `cp .env.example .env`, the default values will work for the database and message queue services, if you want to send emails you will need to enter the smtp settings

### Running Dev Services
1. complete the installation steps above
2. run dev command via `npm run dev`
3. access webserver in your browser at http://localhost:3000/

### Testing
1. run unit tests `npm test`
2. run integration tests via `npm run test:integration` (make sure docker containers are running and .env file has been setup properly)
3. run both unit and integration tests at the same time via `npm run test:all`

### Building
Note: building isn't required to run tests, it is generally used to run the app in a production environment
1. install dependencies via `npm install`
2. run the build command via `npm build`
