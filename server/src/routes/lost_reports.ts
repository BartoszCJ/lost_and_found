import { Router } from "express";
import {
  createLostReport,
  getLostReports,
  updateLostReport,
} from "../controllers/lost_reports";
import { authenticateJWT } from "../auth/auth";

const router: Router = Router();

// Dodanie nowego zgłoszenia (tylko zalogowani użytkownicy)
router.post("/", authenticateJWT, createLostReport);

// Pobranie wszystkich zgłoszeń (dla pracowników/adminów)
router.get("/", authenticateJWT, getLostReports);

// Aktualizacja statusu zgłoszenia (dla pracowników/adminów)
router.patch("/:id", authenticateJWT, updateLostReport);

export default router;
