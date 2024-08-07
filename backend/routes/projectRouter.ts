import { Router } from 'express';
import { createProject, acceptInvitation, declineInvitation, getProjectsByUserId } from '../controllers/projectController';
import { verifyUser } from '../middleware/verifyUser';

const router = Router();

router.get('/', verifyUser, getProjectsByUserId);
router.post('/create', verifyUser, createProject);
router.get('/accept', acceptInvitation);
router.get('/decline', declineInvitation);
export default router;