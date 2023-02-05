import { Consumer, EachMessageHandler } from 'kafkajs';
import { ProducerRecordMessageHeaders } from '../interfaces/producer.interface';

export function eachMessageHandler(
  callback: (params: { data: any; metadata: ProducerRecordMessageHeaders }) => Promise<void> | void,
  consumer: Consumer,
): EachMessageHandler {
  return async ({
    topic,
    partition,
    message,
    heartbeat,
    pause,
  }: {
    topic: string;
    partition: number;
    message: any;
    heartbeat(): Promise<void>;
    pause(): () => void;
  }) => {
    consumer.logger().info('[Kafka-Consumer] Received message', {
      topic,
      partition,
      offset: message.offset,
      value: message.value.toString('utf8'),
      metadata: message.headers,
    });
    try {
      await callback({
        data: message.value.toString('utf8'),
        metadata: message.headers,
      });
    } catch (err) {
      consumer.logger().error('[Kafka-Consumer] Error processing message', {
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString('utf8'),
        metadata: message.headers,
        error: err,
      });

      if (err instanceof Error) {
        const resumeThisPartition = pause();
        // Other partitions that are paused will continue to be paused
        setTimeout(resumeThisPartition, 5000);
      }

      throw err;
    }
  };
}
