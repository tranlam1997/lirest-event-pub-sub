import { ConsumerRunConfig } from 'kafkajs';

export type ConsumerRunEachBatchConfig = Partial<Omit<ConsumerRunConfig, 'eachMessage'>>;

export type ConsumerRunEachMessageConfig = Partial<
  Omit<ConsumerRunConfig, 'eachBatch' | 'eachBatchAutoResolve'>
>;

export type CustomRunConfig = ConsumerRunEachBatchConfig | ConsumerRunEachMessageConfig;
