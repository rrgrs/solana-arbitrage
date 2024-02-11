import { run } from './index';


const messageQueuePath = "../../components/utils/message_queue";
const emailPath = "../../components/email_subscription";

jest.mock('../../components/utils/message_queue', () => {
    return {
        getChannel: jest.fn(),
    };
});

jest.mock('../../components/email_subscription', () => {
    return {
        sendEmail: jest.fn(),
    };
});

describe('RabbitMQ Consumer', () => {
    it('should consume messages from the queue and send emails', async () => {
        const mockChannel = {
            assertQueue: jest.fn().mockResolvedValue(undefined),
            consume: jest.fn(),
            ack: jest.fn(),
        };

        const mockMessage = {
            content: Buffer.from(JSON.stringify({ /* your mock email message */ })),
        };

        (require(messageQueuePath) as any).getChannel.mockResolvedValue(mockChannel);

        await run();

        // Call the consume callback with the mock message
        const consumeCallback = (mockChannel.consume as jest.Mock).mock.calls[0][1];
        await consumeCallback(mockMessage); // Wait for the consume callback to complete

        // Assert that the email was sent
        expect((require(emailPath) as any).sendEmail).toHaveBeenCalledTimes(1);

        // Assert that the channel.ack method was called after sendEmail
        expect(mockChannel.ack).toHaveBeenCalledTimes(1);
    });
});
