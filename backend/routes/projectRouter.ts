import { Router } from 'express';
import { createProject, acceptInvitation, declineInvitation, getProjectsByUserId, getProjectMembers, getPhaseList, getAllTasks, createTask, joinTask, updateTask, swapTask } from '../controllers/projectController';
import { verifyUser } from '../middleware/verifyUser';

const router = Router();

router.get('/', verifyUser, getProjectsByUserId);
router.get('/projectMembers', verifyUser, getProjectMembers);  //?projectId=
router.get('/phaseList', verifyUser, getPhaseList);
router.get('/allTasks', verifyUser, getAllTasks);  //?projectId=
// router.get('/taskMembers', verifyUser, getTaskMembers); //?taskId=
router.post('/create/task', verifyUser, createTask);    //?projectId=${projectId}&phaseId=${phaseId}
router.post('/join/task', verifyUser, joinTask);    //?taskId
router.post('/update/task', verifyUser, updateTask);    //?taskId
router.post('/swap/task', verifyUser, swapTask);

router.post('/create', verifyUser, createProject);
router.get('/accept', acceptInvitation);
router.get('/decline', declineInvitation);
export default router;