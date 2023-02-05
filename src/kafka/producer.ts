import {
  CompressionTypes,
  Kafka,
  Partitioners,
  Producer,
  ProducerConfig,
} from 'kafkajs';
import { LirestKafkaConfig } from './interfaces/kafka-config.interface';
import { LirestProducerRecord, LirestProducerRecordBatch } from './interfaces/producer-config';
import { LirestKafka } from './kafka';

export class LirestKafkaProducer {
  private producer: Producer;

  constructor({ kafka, producerConfig }: { kafka: Kafka; producerConfig: ProducerConfig }) {
    this.producer = kafka.producer(producerConfig);
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
  }

  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  public async send(data: LirestProducerRecord): Promise<void> {
    await this.producer.send({ ...data, compression: CompressionTypes.GZIP });
  }

  public async sendBatch(data: LirestProducerRecordBatch): Promise<void> {
    await this.producer.sendBatch({ ...data, compression: CompressionTypes.GZIP });
  }
}

export function createKafkaProducer({
  kafkaConfig,
  producerConfig = {},
}: {
  kafkaConfig: LirestKafkaConfig;
  producerConfig?: ProducerConfig;
}): LirestKafkaProducer {
  return new LirestKafkaProducer({
    kafka: new LirestKafka(kafkaConfig).getKafka(),
    producerConfig: {
      createPartitioner: Partitioners.DefaultPartitioner,
      ...producerConfig,
    },
  });
}
