import { ConsumerConfig, ConsumerRunConfig } from 'kafkajs';
import { CustomRunConfig } from '../interfaces/consumer-config.interface';

export function defaultKafkaConsumerConfig(
  customConfig: Partial<ConsumerConfig> = {},
): Omit<ConsumerConfig, 'groupId'> {
  return {
    allowAutoTopicCreation: true,
    maxBytesPerPartition: 1048576,
    maxBytes: 1048576,
    maxInFlightRequests: 5,
    maxWaitTimeInMs: 5000,
    minBytes: 1,
    sessionTimeout: 30000,
    rebalanceTimeout: 60000,
    heartbeatInterval: 3000,
    retry: {
      retries: 8,
    },
    metadataMaxAge: 300000,
    ...customConfig,
  };
}

export function defaultConsumerRunConfig(customRunConfig: CustomRunConfig): ConsumerRunConfig {
  return {
    autoCommit: true,
    autoCommitInterval: 3000,
    autoCommitThreshold: 100,
    partitionsConsumedConcurrently: 3,
    ...customRunConfig,
  };
}
