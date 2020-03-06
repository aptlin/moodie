import { use } from "passport";
import User from "../models/user";
import { decrypt } from "../middleware/auth";
import { Strategy as JwtStrategy } from "passport-jwt";
import appConfig from "../config";
const jwtExtractor = req => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "").trim();
  } else if (req.body.token) {
    token = req.body.token.trim();
  } else if (req.query.token) {
    token = req.query.token.trim();
  }
  if (token) {
    token = decrypt(token);
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: appConfig.auth.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.data._id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    return !user ? done(null, false) : done(null, user);
  });
});

use(jwtLogin);
