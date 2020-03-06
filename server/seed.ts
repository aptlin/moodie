import { config as envConfig } from "dotenv";
import { Seeder } from "mongo-seeding";
import { resolve } from "path";
envConfig();

const seedConfig = {
  database: process.env.DB_URI,
  inputPath: resolve(__dirname, "./data"),
  dropDatabase: false,
  useUnifiedTopology: true
};
const seeder = new Seeder(seedConfig);
const collections = seeder.readCollectionsFromPath(resolve("./data"), {
  extensions: ["js", "json", "ts"]
});
console.log(collections);
const main = async () => {
  try {
    await seeder.import(collections);
    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

main();
