import { Request, Response, NextFunction } from 'express';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { getQuestionQueue } from '../queues/questionQueue';
import { getRedis } from '../config/redis';
import { generatePDF } from '../services/pdfService';
import { createError } from '../middleware/errorHandler';
import { emitToAssignment } from '../websocket/wsServer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import type { WsJobQueuedData } from '@vedaai/shared';

const CACHE_KEY = 'assignments:list';
const CACHE_TTL = 300; // 5 minutes

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { dueDate, questionTypes: questionTypesRaw, additionalInfo, title, pastedText, schoolName } = req.body;
    const file = req.file;

    // FormData sends everything as strings — parse the JSON array
    const questionTypes =
      typeof questionTypesRaw === 'string' ? JSON.parse(questionTypesRaw) : questionTypesRaw;

    const fileUrl = file ? `/uploads/files/${file.filename}` : null;
    const assignmentTitle =
      title ?? (file ? path.basename(file.originalname, path.extname(file.originalname)) : `Assignment ${Date.now()}`);

    const assignment = await Assignment.create({
      title: assignmentTitle,
      fileUrl,
      pastedText: pastedText && pastedText.trim() ? pastedText.trim() : null,
      schoolName: schoolName && schoolName.trim() ? schoolName.trim() : null,
      dueDate: new Date(dueDate),
      questionTypes,
      additionalInfo: additionalInfo ?? '',
    });

    const queue = getQuestionQueue();
    const job = await queue.add('generate', { assignmentId: assignment._id.toString() });

    await Assignment.findByIdAndUpdate(assignment._id, { jobId: job.id });

    // Invalidate cache
    await getRedis().del(CACHE_KEY);

    const waiting = await queue.getWaiting();
    const position = waiting.length;

    emitToAssignment<WsJobQueuedData>(assignment._id.toString(), 'job:queued', {
      assignmentId: assignment._id.toString(),
      jobId: job.id!,
      position,
    });

    res.status(201).json({
      assignmentId: assignment._id.toString(),
      jobId: job.id,
      status: 'pending',
    });
  } catch (err) {
    next(err);
  }
}

export async function listAssignments(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const redis = getRedis();
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(assignments));

    res.json(assignments);
  } catch (err) {
    next(err);
  }
}

export async function getAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      next(createError('Assignment not found', 404));
      return;
    }
    res.json(assignment);
  } catch (err) {
    next(err);
  }
}

export async function deleteAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      next(createError('Assignment not found', 404));
      return;
    }

    await QuestionPaper.deleteOne({ assignmentId: id });
    await getRedis().del(CACHE_KEY);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getPaper(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paper = await QuestionPaper.findOne({ assignmentId: req.params.id }).lean();
    if (!paper) {
      next(createError('Question paper not found', 404));
      return;
    }
    res.json(paper);
  } catch (err) {
    next(err);
  }
}

export async function triggerPdf(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paper = await QuestionPaper.findOne({ assignmentId: req.params.id });
    if (!paper) {
      next(createError('Question paper not found', 404));
      return;
    }

    const assignmentId = req.params['id'] as string;
    await generatePDF(paper, assignmentId);
    res.json({ pdfPath: `/uploads/pdfs/${assignmentId}.pdf`, message: 'PDF generated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function downloadPdf(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const pdfPath = path.join(env.UPLOADS_DIR, 'pdfs', `${req.params.id}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      next(createError('PDF not yet generated. Call POST /pdf first.', 404));
      return;
    }
    res.download(pdfPath, `question-paper-${req.params.id}.pdf`);
  } catch (err) {
    next(err);
  }
}
