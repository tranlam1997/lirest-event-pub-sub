import { SASLOptions } from "kafkajs";
import { CustomKafkaAuthConfig } from "../interfaces/kafka.interface";

export function kafkaAuthConfig({
  username,
  password,
  customKafkaAuthConfig = {},
}: {
  username: string;
  password: string;
  customKafkaAuthConfig?: CustomKafkaAuthConfig;
}) {
  return {
    authenticationTimeout: 1000,
    reauthenticationThreshold: 10000,
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username,
      password
    } as SASLOptions,
    ...customKafkaAuthConfig
  }
}
