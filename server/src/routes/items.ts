import { Router } from "express";
import { getItems, addItem } from "../controllers/items";
import { authenticateJWT } from "../auth/auth";
import { authorizeRole } from "../auth/authorizeRole";

const router: Router = Router();

// Zabezpieczone trasy
router.get("/", authenticateJWT, authorizeRole(["employee", "user"]), getItems);
router.post("/", authenticateJWT, authorizeRole(["employee"]), addItem);

export default router;
