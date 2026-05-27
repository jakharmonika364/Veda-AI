import { Queue } from 'bullmq';
import { getRedisConnection } from '../config/redis';

export const QUESTION_QUEUE_NAME = 'question-generation';

let questionQueue: Queue | null = null;

export function getQuestionQueue(): Queue {
  if (!questionQueue) {
    questionQueue = new Queue(QUESTION_QUEUE_NAME, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    });
  }
  return questionQueue;
}
