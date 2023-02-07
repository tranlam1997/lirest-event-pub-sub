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
import { GeneralKafkaMessages } from './messages/general';

export class KafkaConsumer {
  private consumer: Consumer;
  private configInfo: {
    server: string;
    clientId: string;
    groupId: string;
  };

  constructor({ kafka, consumerConfig }: { kafka: Kafka; consumerConfig: ConsumerConfig }) {
    this.consumer = kafka.getKafka().consumer(consumerConfig);
    this.configInfo = {
      server: kafka.getKafkaConfig().serverUrl,
      clientId: kafka.getKafkaConfig().clientId,
      groupId: consumerConfig.groupId,
    }
  }

  public async connect(): Promise<void> {
    this.consumer.logger().info(GeneralKafkaMessages.CONNECTING, this.configInfo)
    await this.consumer.connect();
    this.consumer.logger().info(GeneralKafkaMessages.CONNECT_SUCCESSFULLY)
  }

  public async disconnect(): Promise<void> {
    this.consumer.logger().info(GeneralKafkaMessages.DISCONNECTING)
    await this.consumer.disconnect();
    this.consumer.logger().info(GeneralKafkaMessages.DISCONNECT_SUCCESSFULLY)
  }

  public async stop(): Promise<void> {
    this.consumer.logger().info(GeneralKafkaMessages.STOPPING_CONSUMER)
    await this.consumer.stop();
    this.consumer.logger().info(GeneralKafkaMessages.CONSUMER_STOPPED)
  }

  public async pause(topics: Array<{ topic: string; partitions?: number[] }>): Promise<void> {
    this.consumer.pause(topics);
    this.consumer.logger().info(GeneralKafkaMessages.CONSUMER_PAUSED)
  }

  public async resume(topics: Array<{ topic: string; partitions?: number[] }>): Promise<void> {
    this.consumer.resume(topics);
    this.consumer.logger().info(GeneralKafkaMessages.CONSUMER_RESUMED)
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
    kafka: new Kafka(config),
    consumerConfig: { groupId, ...consumerConfig },
  });
}
