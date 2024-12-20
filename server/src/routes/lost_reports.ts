import { Router } from "express";
import {
  createLostReport,
  getLostReports,
  getUserLostReports,
  updateLostReport,
} from "../controllers/lost_reports";
import { authenticateJWT } from "../auth/auth";
import { authorizeRole } from "../auth/authorizeRole";

const router: Router = Router();

router.post("/", authenticateJWT, createLostReport,  authorizeRole(["user"]),);


router.get("/user", authenticateJWT, getUserLostReports);
router.get("/", authenticateJWT, getLostReports);

router.patch("/:id", authenticateJWT, updateLostReport);

export default router;
