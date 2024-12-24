import { Router } from 'express';
import { getUsers, addUser, loginUser, registerUser } from '../controllers/users';
import { loginSchema, registerSchema } from '../validators/userValidator';
import { validateRequest } from '../middleware/validateRequest';

const router: Router = Router();


router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.post('/', addUser);

export default router;
