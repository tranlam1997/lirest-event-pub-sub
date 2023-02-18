import { KafkaConfig, logLevel } from 'kafkajs';
import { kafkaBrokersConfig } from './brokers';
import { kafkaAuthConfig } from './auth';
import { CustomGeneralKafkaConfig, CustomKafkaAuthConfig } from '../interfaces/kafka.interface';
import { WinstonLogCreator } from './logger';

export function defaultKafkaConfig({
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
    connectionTimeout: 5000,
    requestTimeout: 25000,
    retry: {
      initialRetryTime: 100,
      retries: 5,
    },
    logLevel: logLevel.DEBUG,
    logCreator: WinstonLogCreator,
    ...customGeneralKafkaConfig,
    ...kafkaAuthConfig({ ...sasl, customKafkaAuthConfig: customKafkaAuthConfig }),
  };
}
