import { Producer, ProducerEvents } from 'kafkajs';
import { KafkaProducerEvents } from '../interfaces';

export const producerEvents: ProducerEvents = {
  CONNECT: 'producer.connect',
  DISCONNECT: 'producer.disconnect',
  REQUEST: 'producer.network.request',
  REQUEST_TIMEOUT: 'producer.network.request_timeout',
  REQUEST_QUEUE_SIZE: 'producer.network.request_queue_size',
};

export function producerEventsHandler({
  event,
  producer,
  callback,
}: {
  event: KafkaProducerEvents;
  producer: Producer;
  callback: (data?: any) => void;
}): void {
  switch (event) {
    case producerEvents.CONNECT:
      producer.on(producerEvents.CONNECT, () => {
        callback();
      });
      break;
    case producerEvents.DISCONNECT:
      producer.on(producerEvents.DISCONNECT, () => {
        callback();
      });
      break;
    case producerEvents.REQUEST:
      producer.on(producerEvents.REQUEST, ({ payload, timestamp }) => {
        callback({ payload, timestamp });
      });
      break;
    case producerEvents.REQUEST_TIMEOUT:
      producer.on(
        producerEvents.REQUEST_TIMEOUT,
        ({ payload: { broker, correlationId, createdAt, sentAt, pendingDuration } }) => {
          callback({
            broker,
            correlationId,
            createdAt,
            sentAt,
            pendingDuration,
          });
        },
      );
      break;
  }
}
