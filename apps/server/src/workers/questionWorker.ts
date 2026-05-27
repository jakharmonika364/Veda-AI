import { Worker, Job } from 'bullmq';
import path from 'path';
import { getRedisConnection } from '../config/redis';
import { QUESTION_QUEUE_NAME } from '../queues/questionQueue';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { generateQuestionPaper, buildPrompt } from '../services/llmService';
import { emitToAssignment } from '../websocket/wsServer';
import type { WsJobStartedData, WsJobProgressData, WsJobCompletedData, WsJobFailedData } from '@vedaai/shared';

export interface QuestionJobData {
  assignmentId: string;
}

async function fetchImageAsBase64(fileUrl: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = path.extname(new URL(fileUrl).pathname).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    return { base64: buffer.toString('base64'), mimeType };
  } catch {
    return null;
  }
}

export function startWorker(): Worker {
  const worker = new Worker<QuestionJobData>(
    QUESTION_QUEUE_NAME,
    async (job: Job<QuestionJobData>) => {
      const { assignmentId } = job.data;

      await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });

      emitToAssignment<WsJobStartedData>(assignmentId, 'job:started', {
        assignmentId,
        jobId: job.id!,
      });

      await job.updateProgress(10);
      emitToAssignment<WsJobProgressData>(assignmentId, 'job:progress', {
        assignmentId,
        jobId: job.id!,
        percent: 10,
        message: 'Analyzing assignment details...',
      });

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error(`Assignment ${assignmentId} not found`);

      // Read source material — pasted text takes priority over uploaded file
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;
      let textContent: string | undefined;

      if (assignment.pastedText) {
        textContent = assignment.pastedText;
        console.log(`Using pasted text for assignment ${assignmentId} (${textContent.length} chars)`);
      } else if (assignment.fileUrl) {
        const ext = path.extname(new URL(assignment.fileUrl).pathname).toLowerCase();
        if (ext === '.txt') {
          try {
            const res = await fetch(assignment.fileUrl);
            if (res.ok) {
              textContent = await res.text();
              console.log(`Text file loaded for assignment ${assignmentId} (${textContent.length} chars)`);
            } else {
              console.warn(`Failed to fetch text file for assignment ${assignmentId}`);
            }
          } catch {
            console.warn(`Failed to fetch text file for assignment ${assignmentId}`);
          }
        } else {
          const img = await fetchImageAsBase64(assignment.fileUrl);
          if (img) {
            imageBase64 = img.base64;
            imageMimeType = img.mimeType;
            console.log(`Image loaded for assignment ${assignmentId}: ${assignment.fileUrl}`);
          }
        }
      }

      await job.updateProgress(30);
      emitToAssignment<WsJobProgressData>(assignmentId, 'job:progress', {
        assignmentId,
        jobId: job.id!,
        percent: 30,
        message: textContent ? 'Reading uploaded text...' : imageBase64 ? 'Reading uploaded image...' : 'Building question prompt...',
      });

      await job.updateProgress(50);
      emitToAssignment<WsJobProgressData>(assignmentId, 'job:progress', {
        assignmentId,
        jobId: job.id!,
        percent: 50,
        message: 'Generating questions with AI...',
      });

      const schoolName = assignment.schoolName ?? undefined;
      const llmOutput = await generateQuestionPaper(assignment, imageBase64, imageMimeType, textContent, schoolName);

      await job.updateProgress(80);
      emitToAssignment<WsJobProgressData>(assignmentId, 'job:progress', {
        assignmentId,
        jobId: job.id!,
        percent: 80,
        message: 'Saving question paper...',
      });

      const prompt = buildPrompt(assignment, !!imageBase64, textContent, schoolName);
      const paper = await QuestionPaper.create({
        assignmentId: assignment._id,
        ...llmOutput,
        rawPrompt: prompt,
      });

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: 'completed',
        jobId: job.id,
      });

      await job.updateProgress(100);
      emitToAssignment<WsJobCompletedData>(assignmentId, 'job:completed', {
        assignmentId,
        jobId: job.id!,
        paperId: String(paper._id),
      });
    },
    {
      connection: getRedisConnection(),
      concurrency: 3,
    },
  );

  worker.on('failed', async (job, err) => {
    if (!job) return;
    const { assignmentId } = job.data;
    console.error(`Job ${job.id} failed:`, err.message);

    if (job.attemptsMade >= (job.opts.attempts ?? 3)) {
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
      emitToAssignment<WsJobFailedData>(assignmentId, 'job:failed', {
        assignmentId,
        jobId: job.id!,
        error: err.message,
      });
    }
  });

  console.log('Question generation worker started');
  return worker;
}
