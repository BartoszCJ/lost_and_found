import { Router } from 'express';
import { getUsers, addUser } from '../controllers/users';

const router: Router = Router();

// Pobranie wszystkich użytkowników
router.get('/', getUsers);

// Dodanie nowego użytkownika
router.post('/', addUser);

export default router;
