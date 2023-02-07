import { EachBatchHandler } from 'kafkajs';
import { isJsonString } from '../../utils/helper';
import { ProducerRecordMessageHeaders } from '../interfaces/producer.interface';

export function eachBatchHandler(
  callback: (params: { data: any; metadata: ProducerRecordMessageHeaders }) => Promise<void> | void,
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
    try {
      await Promise.all(
        batch.messages.map(async (message) => {
          if (!isRunning() || isStale()) {
            return;
          }

          await callback({
            data: isJsonString(message.value.toString('utf8'))
              ? JSON.parse(message.value.toString('utf8'))
              : message.value.toString('utf8'),
            metadata: message.headers as ProducerRecordMessageHeaders,
          });
          resolveOffset(message.offset);
        }),
      );
    } catch (err) {
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
