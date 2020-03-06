import { Router } from "express";
const router = Router();
import AuthRoute from "./auth";
import ProfileRoute from "./profile";
import UsersRoute from "./users";

router.use("/", AuthRoute);
router.use("/profile", ProfileRoute);
router.use("/users", UsersRoute);

router.use("*", (req, res) => {
  res.status(404).json({
    errors: {
      msg: "URL_NOT_FOUND"
    }
  });
});

export default router;
