import { KafkaConfig, logLevel } from 'kafkajs';
import { kafkaBrokersConfig } from './brokers';
import { kafkaAuthConfig } from './auth';
import { CustomGeneralKafkaConfig, CustomKafkaAuthConfig } from '../interfaces/kafka-config.interface';
import { WinstonLogCreator } from './logger';

export function defaultLirestKafkaConfig({
  serverUrl,
  clientId,
  sasl,
  customGeneralKafkaConfig = {},
  customKafkaAuthConfig = {},
}: {
  serverUrl: string;
  clientId: string;
  sasl: {
    username: string;
    password: string;
  };
  customGeneralKafkaConfig?: CustomGeneralKafkaConfig;
  customKafkaAuthConfig?: CustomKafkaAuthConfig;
}): KafkaConfig {
  return {
    brokers: kafkaBrokersConfig(serverUrl),
    clientId,
    connectionTimeout: 3000,
    enforceRequestTimeout: false,
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
    logLevel: logLevel.ERROR,
    logCreator: WinstonLogCreator,
    ...customGeneralKafkaConfig,
    ...kafkaAuthConfig({ ...sasl, customKafkaAuthConfig: customKafkaAuthConfig }),
  };
}
