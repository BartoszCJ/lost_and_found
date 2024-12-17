import { Router } from "express";
import { getItems, addItem } from "../controllers/items";
import { authenticateJWT } from "../auth/auth";

const router: Router = Router();

// Zabezpieczone trasy
router.get("/", authenticateJWT, getItems); // Tylko zalogowani użytkownicy
router.post("/", authenticateJWT, addItem);

export default router;
