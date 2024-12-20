import { Router } from "express";
import {
  createOwnershipClaim,
  getOwnershipClaims,
  updateOwnershipClaim,
  getUserOwnershipClaims,
} from "../controllers/ownershipClaims";
import { authenticateJWT } from "../auth/auth";
import { authorizeRole } from "../auth/authorizeRole";

const router: Router = Router();

// Dodanie nowego zgłoszenia własności (dla użytkowników)
router.post(
  "/",
  authenticateJWT,
  authorizeRole(["user"]),
  createOwnershipClaim
);

// Pobranie wszystkich zgłoszeń własności (dla pracowników/adminów)
router.get(
  "/",
  authenticateJWT,
  authorizeRole(["employee", "admin"]),
  getOwnershipClaims
);

// Aktualizacja statusu zgłoszenia (dla pracowników/adminów)
router.patch(
  "/:id",
  authenticateJWT,
  authorizeRole(["employee", "admin"]),
  updateOwnershipClaim
);
router.get("/user", authenticateJWT, getUserOwnershipClaims);

export default router;
