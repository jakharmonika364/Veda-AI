import { Router } from 'express';
import { upload } from '../middleware/upload';
import {
  createAssignment,
  listAssignments,
  getAssignment,
  deleteAssignment,
  getPaper,
  triggerPdf,
  downloadPdf,
} from '../controllers/assignmentController';

const router = Router();

router.get('/', listAssignments);
router.post('/', upload.single('file'), createAssignment);
router.get('/:id', getAssignment);
router.delete('/:id', deleteAssignment);
router.get('/:id/paper', getPaper);
router.post('/:id/pdf', triggerPdf);
router.get('/:id/pdf', downloadPdf);

export default router;
