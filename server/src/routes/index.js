import { Router } from "express";
const router = Router();
import { readdirSync } from "fs";
const routesPath = `${__dirname}/`;
import { removeExtensionFromFile } from "../middleware/utils";

/*
 * Load routes statically and/or dynamically
 */

// Load Auth route
router.use("/", require("./auth").default);

// Loop routes path and loads every file as a route except this file and Auth route
readdirSync(routesPath).filter(file => {
  // Take filename and remove last part (extension)
  const routeFile = removeExtensionFromFile(file);
  // Prevents loading of this file and auth file
  return routeFile !== "index" && routeFile !== "auth"
    ? router.use(`/${routeFile}`, require(`./${routeFile}`))
    : "";
});

/*
 * Setup routes for index
 */
router.get("/", (req, res) => {
  res.render("index");
});

/*
 * Handle 404 error
 */
router.use("*", (req, res) => {
  res.status(404).json({
    errors: {
      msg: "URL_NOT_FOUND"
    }
  });
});

export default router;
