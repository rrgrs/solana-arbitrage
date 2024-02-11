import { getChannel } from "../../components/utils/message_queue";
import { ConsumeMessage } from "amqplib";
import { sendEmail } from "../../components/email_subscription";
import { EmailMessage } from "../../components/email_subscription/types";
import { emailQueueName } from "../../env";


export async function run() {
    console.info('emailer running');
    const channel = await getChannel();
    await channel.assertQueue(emailQueueName);
    await channel.consume(emailQueueName, async (msg: ConsumeMessage | null) => {
        if (msg) {
            console.info('email received');
            const emailMessage: EmailMessage = JSON.parse(msg.content.toString());
            await sendEmail(emailMessage);
            console.info(`email sent to ${emailMessage.toEmail}`);
            channel.ack(msg);
        }
    });
}

if (require.main === module) {
    run();
}
