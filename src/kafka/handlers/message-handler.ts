import { EachMessageHandler } from 'kafkajs';
import { isJsonString } from '../../utils/helper';
import { ProducerRecordMessageHeaders } from '../interfaces/producer.interface';

export function eachMessageHandler(
  callback: (params: { data: any; metadata: ProducerRecordMessageHeaders }) => Promise<void> | void,
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
    try {
      await callback({
        data: isJsonString(message.value.toString('utf8'))
          ? JSON.parse(message.value.toString('utf8'))
          : message.value.toString('utf8'),
        metadata: message.headers,
      });
    } catch (err) {
      if (err instanceof Error) {
        const resumeThisPartition = pause();
        // Other partitions that are paused will continue to be paused
        setTimeout(resumeThisPartition, 5000);
      }

      throw err;
    }
  };
}
