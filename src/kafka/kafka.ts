import { Kafka as Kafkajs} from 'kafkajs';
import { defaultKafkaConfig } from './config/default';
import * as IKafka from './interfaces/kafka.interface';

export class Kafka {
  private kafka: Kafkajs;
  private kafkaConfig: IKafka.KafkaConfig;

  constructor(config: IKafka.KafkaConfig) {
    this.kafka = new Kafkajs(defaultKafkaConfig({ ...config }));
    this.kafkaConfig = config;
  }

  public getKafka(): Kafkajs {
    return this.kafka;
  }

  public getKafkaConfig(): IKafka.KafkaConfig {
    return this.kafkaConfig;
  }
}