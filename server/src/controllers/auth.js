import { addHours } from "date-fns";
import { matchedData } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import { v4 } from "uuid";
import User from "../models/user";
import UserAccess from "../models/userAccess";
import { checkPassword, decrypt, encrypt } from "../middleware/auth";
import {
  yieldError,
  yieldSuccess,
  getBrowserInfo,
  getCountry,
  getIP,
  handleError,
  checkID,
  itemNotFound
} from "../middleware/utils";
import { emailExists } from "../middleware/emailer";
import appConfig from "../config";
import PasswordReset from "../models/passwordReset";
const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 5;

/*********************
 * Private functions *
 *********************/

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = user => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + appConfig.auth.accessTokenExpiration;

  // returns signed and encrypted token
  return encrypt(
    sign(
      {
        data: {
          _id: user
        },
        exp: expiration
      },
      appConfig.auth.secret
    )
  );
};

const setUserInfo = req => {
  let user = {
    _id: req._id,
    name: req.name,
    email: req.email,
    role: req.role,
    verified: req.verified
  };
  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== "production") {
    user = {
      ...user,
      verification: req.verification
    };
  }
  return user;
};

const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    });
    userAccess.save(err => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      const userInfo = setUserInfo(user);
      // Returns data with access token
      resolve({
        token: generateToken(user._id),
        user: userInfo
      });
    });
  });
};

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async user => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK);
    user.save((err, result) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      if (result) {
        resolve(yieldError(409, "BLOCKED_USER"));
      }
    });
  });
};

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async user => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      if (result) {
        resolve(true);
      }
    });
  });
};

const blockIsExpired = user =>
  user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date();

const checkLoginAttemptsAndBlockExpires = async user => {
  return new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0;
      user.save((err, result) => {
        if (err) {
          reject(yieldError(422, err.message));
        }
        if (result) {
          resolve(true);
        }
      });
    } else {
      // User is not blocked, check password (normal behaviour)
      resolve(true);
    }
  });
};

const userIsBlocked = async user => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(yieldError(409, "BLOCKED_USER"));
    }
    resolve(true);
  });
};

const findUser = async email => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      "password loginAttempts blockExpires name email role verified verification",
      (err, item) => {
        itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    );
  });
};

const findUserById = async userId => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
      resolve(item);
    });
  });
};

const passwordsDoNotMatch = async user => {
  user.loginAttempts += 1;
  await saveLoginAttemptsToDB(user);
  return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(yieldError(409, "WRONG_PASSWORD"));
    } else {
      resolve(blockUser(user));
    }
    reject(yieldError(422, "ERROR"));
  });
};

const registerUser = async req => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: req.name,
      email: req.email,
      password: req.password,
      verification: v4()
    });
    user.save((err, item) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      resolve(item);
    });
  });
};

const returnRegisterToken = (item, userInfo) => {
  if (process.env.NODE_ENV !== "production") {
    userInfo.verification = item.verification;
  }
  const data = {
    token: generateToken(item._id),
    user: userInfo
  };
  return data;
};

const verificationExists = async id => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        verification: id,
        verified: false
      },
      (err, user) => {
        itemNotFound(err, user, reject, "NOT_FOUND_OR_ALREADY_VERIFIED");
        resolve(user);
      }
    );
  });
};
const verifyUser = async user => {
  return new Promise((resolve, reject) => {
    user.verified = true;
    user.save((err, item) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      resolve({
        email: item.email,
        verified: item.verified
      });
    });
  });
};

const markResetPasswordAsUsed = async (req, forgot) => {
  return new Promise((resolve, reject) => {
    forgot.used = true;
    forgot.ipChanged = getIP(req);
    forgot.browserChanged = getBrowserInfo(req);
    forgot.countryChanged = getCountry(req);
    forgot.save((err, item) => {
      itemNotFound(err, item, reject, "NOT_FOUND");
      resolve(yieldSuccess("PASSWORD_CHANGED"));
    });
  });
};

const updatePassword = async (password, user) => {
  return new Promise((resolve, reject) => {
    user.password = password;
    user.save((err, item) => {
      itemNotFound(err, item, reject, "NOT_FOUND");
      resolve(item);
    });
  });
};

const findUserToResetPassword = async email => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      (err, user) => {
        itemNotFound(err, user, reject, "NOT_FOUND");
        resolve(user);
      }
    );
  });
};

const findForgottenPassword = async id => {
  return new Promise((resolve, reject) => {
    PasswordReset.findOne(
      {
        verification: id,
        used: false
      },
      (err, item) => {
        itemNotFound(err, item, reject, "NOT_FOUND_OR_ALREADY_USED");
        resolve(item);
      }
    );
  });
};

const checkPermissions = async (data, next) => {
  return new Promise((resolve, reject) => {
    User.findById(data.id, (err, result) => {
      itemNotFound(err, result, reject, "NOT_FOUND");
      if (data.roles.indexOf(result.role) > -1) {
        return resolve(next());
      }
      return reject(yieldError(401, "UNAUTHORIZED"));
    });
  });
};

const getUserIdFromToken = async token => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    verify(decrypt(token), appConfig.auth.secret, (err, decoded) => {
      if (err) {
        reject(yieldError(409, "BAD_TOKEN"));
      }
      resolve(decoded.data._id);
    });
  });
};

export async function login(req, res) {
  try {
    const data = matchedData(req);
    const user = await findUser(data.email);
    await userIsBlocked(user);
    await checkLoginAttemptsAndBlockExpires(user);
    const isPasswordMatch = await checkPassword(data.password, user);
    if (!isPasswordMatch) {
      handleError(res, await passwordsDoNotMatch(user));
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0;
      await saveLoginAttemptsToDB(user);
      res.status(200).json(await saveUserAccessAndReturnToken(req, user));
    }
  } catch (error) {
    handleError(res, error);
  }
}

export async function register(req, res) {
  try {
    // Gets locale from header 'Accept-Language'
    req = matchedData(req);
    const doesEmailExists = await emailExists(req.email);
    if (!doesEmailExists) {
      const item = await registerUser(req);
      const userInfo = setUserInfo(item);
      const response = returnRegisterToken(item, userInfo);
      // sendRegistrationEmailMessage(locale, item);
      res.status(201).json(response);
    }
  } catch (error) {
    handleError(res, error);
  }
}

export async function resetPassword(req, res) {
  try {
    const data = matchedData(req);
    const forgotPassword = await findForgottenPassword(data.id);
    const user = await findUserToResetPassword(forgotPassword.email);
    await updatePassword(data.password, user);
    const result = await markResetPasswordAsUsed(req, forgotPassword);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function verifyRequest(req, res) {
  try {
    req = matchedData(req);
    const user = await verificationExists(req.id);
    res.status(200).json(await verifyUser(user));
  } catch (error) {
    handleError(res, error);
  }
}

export async function getRefreshToken(req, res) {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace("Bearer ", "")
      .trim();
    let userId = await getUserIdFromToken(tokenEncrypted);
    userId = await checkID(userId);
    const user = await findUserById(userId);
    const token = await saveUserAccessAndReturnToken(req, user);
    // Removes user info from response
    delete token.user;
    res.status(200).json(token);
  } catch (error) {
    handleError(res, error);
  }
}

export function roleAuthorization(roles) {
  return async (req, res, next) => {
    try {
      const data = {
        id: req.user._id,
        roles
      };
      await checkPermissions(data, next);
    } catch (error) {
      handleError(res, error);
    }
  };
}
