import { Router } from "express";
import {
  loginUser,
  registerUser,
  getAllUsers,
  updateUserRole,
  addEmployee,
  deleteUser,
} from "../controllers/users";
import { loginSchema, registerSchema } from "../validators/userValidator";
import { validateRequest } from "../middleware/validateRequest";
import { authenticateJWT } from "../auth/auth";
import { authorizeRole } from "../auth/authorizeRole";

const router: Router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);

router.get("/", getAllUsers);

router.put("/:id/role", updateUserRole);


router.post(
  "/employees",
  authenticateJWT,
  authorizeRole(["admin"]),
  addEmployee
);

router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), deleteUser);
export default router;
