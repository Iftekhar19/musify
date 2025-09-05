import express from 'express'
import dotenv from 'dotenv'
import amqp  from "amqplib";
import type { ConsumeMessage,Connection, Channel } from "amqplib";
import { sendMail } from './utils.js';
dotenv.config()
const app=express()
const PORT=process.env.PORT


async function consumeMessages(): Promise<void> {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  
  const exchange = "user_exchange";
  const queue = "notification_queue";
  const routingKey = "user.registered";

  await channel.assertExchange(exchange, "topic", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  console.log(" [*] Waiting for messages...");

  channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString()) as {
          email: string;
          emailType:string;
          link:string; 
          
        };
        await sendMail({email:data.email,link:data.link,emailType:data.emailType})

        console.log(" [x] Received:", data);

        // Example: send email, sms, push notification
        console.log(`Sending welcome email to ${data.email}`);

        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to process message:", err);
        channel.nack(msg, false, false); // reject and discard
      }
    }
  });
}

consumeMessages().catch((err) => {
  console.error("RabbitMQ consumer error:", err);
  process.exit(1);
}); 


app.listen(PORT,()=>
{
    console.log(`Notification service is running on port: ${PORT}`)
})