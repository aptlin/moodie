import { yieldError } from "../middleware/utils";
import crypto from "crypto";
import appConfig from "../config";
const algorithm = "aes-256-ecb";
const secret = appConfig.auth.secret;

export async function checkPassword(password, user) {
  return new Promise((resolve, reject) => {
    user.verifyPassword(password, ({ err, same }) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      if (!same) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

export function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, secret);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}
export function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, secret);
  try {
    let dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  } catch (err) {
    return err;
  }
}
