import { Message, ProducerBatch, ProducerRecord, TopicMessages } from "kafkajs";

export interface ProducerRecordMessageHeaders {
  messageId: string;
  source: string;
  topic: string;
  [k: string]: any;
}

export interface LirestProducerRecordMessage extends Omit<Message, 'headers'> {
  headers: ProducerRecordMessageHeaders;
}

export interface LirestProducerRecord extends Omit<ProducerRecord, 'messages'> {
  messages: LirestProducerRecordMessage[];
}

export interface ProducerBatchTopicMessages extends Omit<TopicMessages, 'messages'> {
  messages: LirestProducerRecordMessage[];
}

export interface LirestProducerRecordBatch extends Omit<ProducerBatch, 'topicMessages'> {
  topicMessages: ProducerBatchTopicMessages[];
}