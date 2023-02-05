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
  callback
}: {
  event: KafkaProducerEvents;
  producer: Producer;
  callback: (data?: any) => void;
}): void {
  switch (event) {
    case producerEvents.CONNECT:
      producer.on(producerEvents.CONNECT, () => {
        producer.logger().info('Connected to Kafka Server');
        callback()
      });
      break;
    case producerEvents.DISCONNECT:
      producer.on(producerEvents.DISCONNECT, () => {
        producer.logger().info('Disconnected from Kafka Server');
        callback();
      });
      break;
    case producerEvents.REQUEST:
      producer.on(producerEvents.REQUEST, ({ payload, timestamp }) => {
        producer.logger().info('Request', { payload, timestamp });
      });
      callback();
      break;
    case producerEvents.REQUEST_TIMEOUT:
      producer.on(
        producerEvents.REQUEST_TIMEOUT,
        ({ payload: { broker, correlationId, createdAt, sentAt, pendingDuration } }) => {
          producer
            .logger()
            .info('Request timeout', { broker, correlationId, createdAt, sentAt, pendingDuration });
          callback();
        },
      );
      break;
  }
}
