import { Router } from 'express';
import { getJobStatus } from '../controllers/jobController';

const router = Router();

router.get('/:jobId/status', getJobStatus);

export default router;
