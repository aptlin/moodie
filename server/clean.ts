import { config as envConfig } from "dotenv";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import appConfig from "./src/config";

const modelsPath = `./src/models`;
const models = readdirSync(modelsPath).filter(file => {
  return !file.startsWith("index");
});

envConfig();

// Loop models path and loads every file as a model except index file

const deleteModelFromDB = model => {
  return new Promise((resolve, reject) => {
    model = require(`./src/models/${model}`).default;
    console.log(model);
    model.deleteMany({}, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const clean = async () => {
  try {
    await mongoose.connect(appConfig.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const promiseArray = models.map(
      async model => await deleteModelFromDB(model)
    );
    await Promise.all(promiseArray);
    console.log("Cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

clean();
