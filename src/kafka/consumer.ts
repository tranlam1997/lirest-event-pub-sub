import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka as Kafkajs,
} from 'kafkajs';
import { defaultConsumerRunConfig } from './config/consumer';
import { eachBatchHandler } from './handlers/batch-handler';
import { eachMessageHandler } from './handlers/message-handler';
import { ConsumerRunEachBatchConfig, ConsumerRunEachMessageConfig } from './interfaces/consumer.interface';
import * as IKafka from './interfaces/kafka.interface';
import { ProducerRecordMessageHeaders } from './interfaces/producer.interface';
import { Kafka } from './kafka';

export class KafkaConsumer {
  private consumer: Consumer;

  constructor({ kafka, consumerConfig }: { kafka: Kafkajs; consumerConfig: ConsumerConfig }) {
    this.consumer = kafka.consumer(consumerConfig);
  }

  public async connect(): Promise<void> {
    await this.consumer.connect();
  }

  public async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  public async stop(): Promise<void> {
    await this.consumer.stop();
  }

  public async pause(topics: Array<{ topic: string; partitions?: number[] }>): Promise<void> {
    this.consumer.pause(topics);
  }

  public async resume(topics: Array<{ topic: string; partitions?: number[] }>): Promise<void> {
    this.consumer.resume(topics);
  }

  public async subscribe(topics: ConsumerSubscribeTopics): Promise<void> {
    await this.consumer.subscribe(topics);
  }

  public async runEachMessage(
    callback: (params: { data: any; metadata: ProducerRecordMessageHeaders }) => Promise<void> | void,
    customConfig: ConsumerRunEachMessageConfig = {},
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: eachMessageHandler(callback, this.consumer),
      ...defaultConsumerRunConfig(customConfig),
    });
  }

  public async runEachBatch(
    callback: (params: { data: any; metadata: ProducerRecordMessageHeaders }) => Promise<void> | void,
    customConfig: ConsumerRunEachBatchConfig = {},
  ): Promise<void> {
    await this.consumer.run({
      eachBatch: eachBatchHandler(callback, this.consumer),
      ...defaultConsumerRunConfig(customConfig),
    });
  }
}

export function createKafkaConsumer({
  kafkaConfig,
  consumerConfig = {},
}: {
  kafkaConfig: IKafka.KafkaConfig & { groupId: string };
  consumerConfig?: Omit<ConsumerConfig, 'groupId'>;
}): KafkaConsumer {
  const { groupId, ...config } = kafkaConfig;
  return new KafkaConsumer({
    kafka: new Kafka(config).getKafka(),
    consumerConfig: { groupId, ...consumerConfig },
  });
}
