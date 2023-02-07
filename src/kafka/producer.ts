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
import { GeneralKafkaMessages } from './messages/general';

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
    this.producer.logger().info(GeneralKafkaMessages.CONNECTING, this.configInfo);
    await this.producer.connect();
    this.producer.logger().info(GeneralKafkaMessages.CONNECT_SUCCESSFULLY);
  }

  public async disconnect(): Promise<void> {
    this.producer.logger().info(GeneralKafkaMessages.DISCONNECTING);
    await this.producer.disconnect();
    this.producer.logger().info(GeneralKafkaMessages.DISCONNECT_SUCCESSFULLY);
  }

  public async send(data: IKafkaProducer.KafkaProducerRecord): Promise<void> {
    this.producer.logger().info(GeneralKafkaMessages.SENDING_MESSAGE, {
      topic: data.topic,
      messages: data.messages,
    });
    await this.producer.send({ ...data, compression: CompressionTypes.GZIP });
    this.producer.logger().info(GeneralKafkaMessages.MESSAGE_SENT);
  }

  public async sendBatch(data: IKafkaProducer.KafkaProducerRecordBatch): Promise<void> {
    this.producer.logger().info(GeneralKafkaMessages.SENDING_BATCH, {
      batch: JSON.stringify(data.topicMessages),
    });
    await this.producer.sendBatch({ ...data, compression: CompressionTypes.GZIP });
    this.producer.logger().info(GeneralKafkaMessages.BATCH_SENT);
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
    kafka: new Kafka(kafkaConfig),
    producerConfig: {
      createPartitioner: Partitioners.DefaultPartitioner,
      ...producerConfig,
    },
  });
}
