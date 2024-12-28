import { Router } from "express";
import {
  loginUser,
  registerUser,
  getAllUsers,
  updateUserRole,
  blockUser,
  resetUserPassword,
  addEmployee,
} from "../controllers/users";
import { loginSchema, registerSchema } from "../validators/userValidator";
import { validateRequest } from "../middleware/validateRequest";

const router: Router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", loginUser);

router.get("/", getAllUsers);

// PUT /api/admin/users/:id/role
router.put("/:id/role", updateUserRole);

// PUT /api/admin/users/:id/block
router.put("/:id/block", blockUser);

// POST /api/admin/users/:id/reset-password
router.post("/:id/reset-password", resetUserPassword);

// POST /api/admin/employees
router.post("/employees", addEmployee);
export default router;
