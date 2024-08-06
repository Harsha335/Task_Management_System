import { Router } from 'express';
import { createUser, getAllUsers, getUserById } from '../controllers/userController';
import { verifyUser } from '../middleware/verifyUser';

const router = Router();

router.get('/', verifyUser, getAllUsers);
router.post('/', verifyUser, createUser);
router.get('/:id', verifyUser, getUserById);

export default router;