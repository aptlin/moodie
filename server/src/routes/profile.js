import { Router } from "express";
import { authenticate } from "passport";
import { all } from "trim-request";
import "../middleware/passport";
import { roleAuthorization } from "../controllers/auth";
import {
  changePassword,
  getProfile,
  updateProfile
} from "../controllers/profile";
import {
  changePassword as validatePasswordChange,
  updateProfile as validateProfileUpdate
} from "../controllers/profile.validate";
const router = Router();
const requireAuth = authenticate("jwt", {
  session: false
});

router.get(
  "/",
  requireAuth,
  roleAuthorization(["user", "admin"]),
  all,
  getProfile
);

router.patch(
  "/",
  requireAuth,
  roleAuthorization(["user", "admin"]),
  all,
  validateProfileUpdate,
  updateProfile
);

router.post(
  "/changePassword",
  requireAuth,
  roleAuthorization(["user", "admin"]),
  all,
  validatePasswordChange,
  changePassword
);

export default router;
