import dotenv from "dotenv";

dotenv.config();

export const webserverPort = process.env.WEBSERVER_PORT || 3000;

export const messageQueueUrl = process.env.MESSAGE_QUEUE_URL || "amqp://localhost:5672";
export const priceCheckerQueueName = process.env.PRICE_CHECKER_QUEUE_NAME || "priceChecker";
export const emailQueueName = process.env.EMAIL_QUEUE_NAME || "email";

export const smtpUsername = process.env.SMTP_USERNAME;
export const smtpPassword = process.env.SMTP_PASSWORD;
export const smtpHost = process.env.SMTP_HOST;
export const smtpPort = parseInt(process.env.SMTP_PORT);
export const smtpFromEmail = process.env.SMTP_FROM_EMAIL;
