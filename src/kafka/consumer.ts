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
      eachMessage: eachMessageHandler(callback),
      ...defaultConsumerRunConfig(customConfig),
    });
  }

  public async runEachBatch(
    callback: (params: { data: any; metadata: ProducerRecordMessageHeaders }) => Promise<void> | void,
    customConfig: ConsumerRunEachBatchConfig = {},
  ): Promise<void> {
    await this.consumer.run({
      eachBatch: eachBatchHandler(callback),
      ...defaultConsumerRunConfig(customConfig),
    });
  }

  public getConfigInfo(): {
    server: string;
    clientId: string;
    groupId: string;
  } {
    return this.configInfo;
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
