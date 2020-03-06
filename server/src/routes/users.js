import { Router } from "express";
import { authenticate } from "passport";
import "../middleware/passport";
import { roleAuthorization } from "../controllers/auth";
import {
  createItem,
  deleteItem,
  getItem,
  getItems,
  updateItem
} from "../controllers/users";
import {
  createItem as _createItem,
  deleteItem as _deleteItem,
  getItem as _getItem,
  updateItem as _updateItem
} from "../controllers/users.validate";
const router = Router();
const requireAuth = authenticate("jwt", {
  session: false
});

router.get("/", requireAuth, roleAuthorization(["admin"]), getItems);
router.post(
  "/",
  requireAuth,
  roleAuthorization(["admin"]),
  _createItem,
  createItem
);
router.get(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  _getItem,
  getItem
);
router.patch(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  _updateItem,
  updateItem
);
router.delete(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  _deleteItem,
  deleteItem
);

export default router;
