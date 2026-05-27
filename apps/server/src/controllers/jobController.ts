import { Request, Response, NextFunction } from 'express';
import { Job } from 'bullmq';
import { getQuestionQueue } from '../queues/questionQueue';
import { createError } from '../middleware/errorHandler';

export async function getJobStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const queue = getQuestionQueue();
    const job = await Job.fromId(queue, req.params['jobId'] as string);

    if (!job) {
      next(createError('Job not found', 404));
      return;
    }

    const state = await job.getState();
    const progress = job.progress as number;

    res.json({
      jobId: job.id,
      assignmentId: job.data.assignmentId,
      status: state,
      percent: typeof progress === 'number' ? progress : 0,
      failedReason: job.failedReason,
    });
  } catch (err) {
    next(err);
  }
}
