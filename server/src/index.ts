import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { config as envConfig } from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import appConfig from "./config";

async function init() {
  envConfig();
  await mongoose.connect(appConfig.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const app = express();

  app.set("port", appConfig.rest.port);
  if (appConfig.rest.mode === "development") {
    app.use(morgan("dev"));
  }

  app.use(
    bodyParser.json({
      limit: appConfig.rest.parsingLimit
    })
  );
  app.use(
    bodyParser.urlencoded({
      limit: appConfig.rest.parsingLimit,
      extended: true
    })
  );

  app.use(cors());
  app.use(passport.initialize());
  app.use(compression());
  app.use(helmet());
  app.use(require("./app/routes"));
  app.listen(app.get("port"));
  return app;
}

export default init().catch(e => {
  console.error(e);
  process.exit(0);
});
