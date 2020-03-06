import { Router } from "express";
import { authenticate } from "passport";
import { all } from "trim-request";
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

router.get("/", requireAuth, roleAuthorization(["admin"]), all, getItems);
router.post(
  "/",
  requireAuth,
  roleAuthorization(["admin"]),
  all,
  _createItem,
  createItem
);
router.get(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  all,
  _getItem,
  getItem
);
router.patch(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  all,
  _updateItem,
  updateItem
);
router.delete(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  all,
  _deleteItem,
  deleteItem
);

export default router;
