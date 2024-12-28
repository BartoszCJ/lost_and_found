import { Router } from "express";
import {
  assignItemToLostReport,
  createLostReport,
  getLostReports,
  getUserLostReports,
  updateLostReport,
} from "../controllers/lost_reports";
import { authenticateJWT } from "../auth/auth";
import { authorizeRole } from "../auth/authorizeRole";

const router: Router = Router();

router.post("/", authenticateJWT, authorizeRole(["user"]), createLostReport);

router.put(
  "/:id/assign",
  authenticateJWT,
  authorizeRole(["employee"]),
  assignItemToLostReport
);

router.get("/user", authenticateJWT, getUserLostReports);
router.get("/", authenticateJWT, getLostReports);
router.put(
  "/:id",
  authenticateJWT,
  authorizeRole(["employee"]),
  updateLostReport
);
router.patch("/:id", authenticateJWT, updateLostReport);

export default router;
