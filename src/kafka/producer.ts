import {
  CompressionTypes,
  Kafka as Kafkajs,
  Partitioners,
  Producer,
  ProducerConfig,
} from 'kafkajs';
import { producerEventsHandler } from './handlers/producer-events';
import * as IKafka from './interfaces/kafka.interface';
import * as IKafkaProducer from './interfaces/producer.interface';
import { Kafka } from './kafka';

export class KafkaProducer {
  private producer: Producer;

  constructor({ kafka, producerConfig }: { kafka: Kafkajs; producerConfig: ProducerConfig }) {
    this.producer = kafka.producer(producerConfig);
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
  }

  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  public async send(data: IKafkaProducer.KafkaProducerRecord): Promise<void> {
    await this.producer.send({ ...data, compression: CompressionTypes.GZIP });
  }

  public async sendBatch(data: IKafkaProducer.KafkaProducerRecordBatch): Promise<void> {
    await this.producer.sendBatch({ ...data, compression: CompressionTypes.GZIP });
  }

  public async on(
    event: IKafkaProducer.KafkaProducerEvents,
    callback: (data?: any) => void,
  ): Promise<void> {
    producerEventsHandler({
      event,
      callback,
      producer: this.producer,
    });
  }
}

export function createKafkaProducer({
  kafkaConfig,
  producerConfig = {},
}: {
  kafkaConfig: IKafka.KafkaConfig;
  producerConfig?: ProducerConfig;
}): KafkaProducer {
  return new KafkaProducer({
    kafka: new Kafka(kafkaConfig).getKafka(),
    producerConfig: {
      createPartitioner: Partitioners.DefaultPartitioner,
      ...producerConfig,
    },
  });
}
