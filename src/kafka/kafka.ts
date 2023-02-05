import { Kafka as Kafkajs} from 'kafkajs';
import { defaultKafkaConfig } from './config/default';
import * as IKafka from './interfaces/kafka.interface';

export class Kafka {
  private kafka: Kafkajs;

  constructor(config: IKafka.KafkaConfig) {
    this.kafka = new Kafkajs(defaultKafkaConfig({ ...config }));
  }

  public getKafka(): Kafkajs {
    return this.kafka;
  }
}