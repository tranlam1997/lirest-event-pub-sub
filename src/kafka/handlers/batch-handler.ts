import { Consumer, EachBatchHandler } from 'kafkajs';
import { ProducerRecordMessageHeaders } from '../interfaces/producer.interface';

export function eachBatchHandler(
  callback: (params: { data: any; metadata: ProducerRecordMessageHeaders }) => Promise<void> | void,
  consumer: Consumer,
): EachBatchHandler {
  return async function ({
    batch,
    resolveOffset,
    heartbeat,
    commitOffsetsIfNecessary,
    isRunning,
    isStale,
    uncommittedOffsets,
    pause,
  }) {
    consumer.logger().info('Received batch', {
      topic: batch.topic,
      partition: batch.partition,
      highWatermark: batch.highWatermark,
      offsetLag: batch.offsetLag,
      offsetLagLow: batch.offsetLagLow,
      messages: batch.messages.map((message) => ({
        offset: message.offset,
        value: message.value.toString('utf8'),
        metadata: message.headers,
      })),
    });

    try {
      await Promise.all(
        batch.messages.map(async (message) => {
          if (!isRunning() || isStale()) {
            return;
          }

          await callback({
            data: message.value.toString('utf8'),
            metadata: message.headers as ProducerRecordMessageHeaders,
          });
          resolveOffset(message.offset);
        }),
      );
    } catch (err) {
      consumer.logger().error('Error processing batch', {
        topic: batch.topic,
        partition: batch.partition,
        highWatermark: batch.highWatermark,
        offsetLag: batch.offsetLag,
        offsetLagLow: batch.offsetLagLow,
        messages: batch.messages.map((message) => ({
          offset: message.offset,
          value: message.value.toString('utf8'),
          metadata: message.headers,
        })),
        error: err,
      });

      if (err instanceof Error) {
        const resumeThisPartition = pause();
        // Other partitions that are paused will continue to be paused
        setTimeout(resumeThisPartition, 5000);
      }

      throw err;
    }

    await commitOffsetsIfNecessary();
    await heartbeat();
  };
}
