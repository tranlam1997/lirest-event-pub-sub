import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaConfig,
} from 'kafkajs';
import { defaultConsumerRunConfig } from './config/consumer';
import eachBatchHandler from './handlers/batch-handler';
import eachMessageHandler from './handlers/message-handler';
import { ConsumerRunEachBatchConfig, ConsumerRunEachMessageConfig } from './interfaces/consumer-config.interface';
import { ProducerRecordMessageHeaders } from './interfaces/producer-config';

class LirestKafkaConsumer {
  private consumer: Consumer;

  constructor({ kafka, consumerConfig }: { kafka: Kafka; consumerConfig: ConsumerConfig }) {
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

export default function createKafkaConsumer({
  kafkaConfig,
  consumerConfig = {},
}: {
  kafkaConfig: KafkaConfig & { groupId: string };
  consumerConfig?: Omit<ConsumerConfig, 'groupId'>;
}): LirestKafkaConsumer {
  const { groupId, ...config } = kafkaConfig;
  return new LirestKafkaConsumer({
    kafka: new Kafka(config),
    consumerConfig: { groupId, ...consumerConfig },
  });
}
