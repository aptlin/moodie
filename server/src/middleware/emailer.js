import User from "../models/user";
import { itemAlreadyExists } from "../middleware/utils";

export async function emailExists(email) {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      (err, item) => {
        itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
        resolve(false);
      }
    );
  });
}
export async function emailExistsExcludingMyself(id, email) {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
        _id: {
          $ne: id
        }
      },
      (err, item) => {
        itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
        resolve(false);
      }
    );
  });
}
