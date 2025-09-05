// publisher.ts
import amqp from "amqplib";
export interface Payload{
    email:string,
    link:string;
    emailType:string;
}
export async function publishMessage(payload:Payload): Promise<void> {
  let connection;
  let channel;

  try {
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    const exchange = "user_exchange";
    const routingKey = "user.registered";

    await channel.assertExchange(exchange, "topic", { durable: true });

    const message = JSON.stringify(payload);

    channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(" [x] Sent:", message);

  } catch (err) {
    console.error("❌ Failed to publish message:", err);
  } finally {
    if (channel) await channel.close().catch(() => {});
    if (connection) await connection.close().catch(() => {});
  }
}


