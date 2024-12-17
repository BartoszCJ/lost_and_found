import { Router } from 'express';
import { createOwnershipClaim, getOwnershipClaims, updateOwnershipClaim } from '../controllers/ownershipClaims';
import { authenticateJWT } from '../auth/auth';

const router: Router = Router();

// Dodanie nowego zgłoszenia własności (dla użytkowników)
router.post('/', authenticateJWT, createOwnershipClaim);

// Pobranie wszystkich zgłoszeń (dla pracowników/adminów)
router.get('/', authenticateJWT, getOwnershipClaims);

// Aktualizacja statusu zgłoszenia (tylko dla pracowników/adminów)
router.patch('/:id', authenticateJWT, updateOwnershipClaim);

export default router;
