import { ObjectID } from "mongodb";
import faker from "faker";

const users = [];
const admin = {
  _id: new ObjectID("5aa1c2c35ef7a4e97b5e995a"),
  name: "Administrator",
  email: "admin@admin.com",
  password: "change-me",
  role: "admin",
  verified: true,
  verification: "3d6e072c-0eaf-4239-bb5e-495e6486148f",
  urlTwitter: faker.internet.url(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent()
};
users.push(admin);

export default users;
