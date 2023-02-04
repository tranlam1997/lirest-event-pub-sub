import { BrokersFunction } from 'kafkajs';

export interface CustomKafkaAuthConfig {
  authenticationTimeout?: number;
  reauthenticationThreshold?: number;
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain';
    username: string;
    password: string;
  };
}

export interface CustomGeneralKafkaConfig {
  brokers?: BrokersFunction | string[];
  connectionTimeout?: number;
  authenticationTimeout?: number;
  enforceRequestTimeout?: boolean;
  requestTimeout?: number;
  retry?: {
    initialRetryTime?: number;
    retries?: number;
  };
}

export interface LirestKafkaConfig {
  serverUrl: string;
  clientId: string;
  sasl: {
    username: string;
    password: string;
  };
  customGeneralKafkaConfig?: CustomGeneralKafkaConfig;
  customKafkaAuthConfig?: CustomKafkaAuthConfig;
}
