import { Router } from 'express';
import { getUsers, addUser, loginUser, registerUser } from '../controllers/users';

const router: Router = Router();


router.post('/register', registerUser); // Rejestracja nowego użytkownika

router.post('/login', loginUser);
router.get('/', getUsers);
router.post('/', addUser);

export default router;
