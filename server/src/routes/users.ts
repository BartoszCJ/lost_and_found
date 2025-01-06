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

router.put("/:id/role", updateUserRole);

router.put("/:id/block", blockUser);

router.post("/:id/reset-password", resetUserPassword);

router.post("/employees", addEmployee);
export default router;
