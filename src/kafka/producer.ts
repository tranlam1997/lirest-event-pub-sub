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
  private configInfo: {
    server: string;
    clientId: string;
  };

  constructor({ kafka, producerConfig }: { kafka: Kafka; producerConfig: ProducerConfig }) {
    this.producer = kafka.getKafka().producer(producerConfig);
    this.configInfo = {
      server: kafka.getKafkaConfig().serverUrl,
      clientId: kafka.getKafkaConfig().clientId,
    };
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

  public getConfigInfo(): {
    server: string;
    clientId: string;
  } {
    return this.configInfo;
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
    kafka: new Kafka(kafkaConfig),
    producerConfig: {
      createPartitioner: Partitioners.DefaultPartitioner,
      ...producerConfig,
    },
  });
}
