import { Message, ProducerBatch, ProducerRecord, TopicMessages, ProducerEvents } from 'kafkajs';

export type TopDomainName = 'lirest';
export type ServiceName = Lowercase<`${string}`>; // TODO: add regex
export type TopicName = Lowercase<`${string}`>; // TODO: add regex
export type MessageType = 'json' | 'number' | 'object' | 'string' | 'boolean' | 'array';
export type TopicPattern = `${TopDomainName}.${ServiceName}.${TopicName}.${MessageType}.topic`;

export interface ProducerRecordMessageHeaders {
  messageId: string;
  topic: TopicPattern;
  origin: string;
  destination: string;
  [k: string]: any;
}

export interface KafkaProducerRecordMessage extends Omit<Message, 'headers'> {
  headers: ProducerRecordMessageHeaders;
}

export interface KafkaProducerRecord extends Omit<ProducerRecord, 'messages' | 'topic'> {
  topic: TopicPattern;
  messages: KafkaProducerRecordMessage[];
}

export interface ProducerBatchTopicMessages extends Omit<TopicMessages, 'messages'> {
  messages: KafkaProducerRecordMessage[];
}

export interface KafkaProducerRecordBatch extends Omit<ProducerBatch, 'topicMessages'> {
  topicMessages: ProducerBatchTopicMessages[];
}

export type KafkaProducerEvents = ProducerEvents[keyof ProducerEvents]
