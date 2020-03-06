import { config } from "dotenv";
import { Seeder } from "mongo-seeding";
import { resolve } from "path";
config();

const seedConfig = {
  database: process.env.MONGO_URI,
  inputPath: resolve(__dirname, "./data"),
  dropDatabase: false,
  useUnifiedTopology: true
};
const seeder = new Seeder(seedConfig);
const collections = seeder.readCollectionsFromPath(resolve("./data"));

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
