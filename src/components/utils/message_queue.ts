import client, { Connection, Channel } from 'amqplib';
import { messageQueueUrl } from '../../env';


let connection: Connection = null;
let channel: Channel = null;
export async function getChannel(): Promise<Channel> {
    if (channel) {
        return channel;
    }
    connection = await client.connect(messageQueueUrl);
    channel = await connection.createChannel();
    return channel;
}