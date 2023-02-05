import { Kafka } from 'kafkajs';
import { defaultLirestKafkaConfig } from './config/default';
import { LirestKafkaConfig } from './interfaces/kafka-config.interface';

export class LirestKafka {
  private kafka: Kafka;

  constructor(config: LirestKafkaConfig) {
    this.kafka = new Kafka(defaultLirestKafkaConfig({ ...config }));
  }

  public getKafka(): Kafka {
    return this.kafka;
  }
}