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

router.post(
  "/",
  authenticateJWT,
  authorizeRole(["user"]),
  createOwnershipClaim
);

router.get(
  "/",
  authenticateJWT,
  authorizeRole(["employee", "admin"]),
  getOwnershipClaims
);

router.post(
  "/:id",
  authenticateJWT,
  authorizeRole(["employee", "admin"]),
);

router.get("/user", authenticateJWT, getUserOwnershipClaims);

export default router;
