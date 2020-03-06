import mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";
import requestIp from "request-ip";
import { ResponseError } from "../../types";
import { validationResult } from "express-validator";
import appConfig from "../config";

/**
 * Gets IP from user
 * @param {*} req - request object
 */
export function getIP(req: Request) {
  return requestIp.getClientIp(req);
}

export function getBrowserInfo(req: Request) {
  return req.headers["user-agent"];
}
export function getCountry(req: Request) {
  return req.headers["cf-ipcountry"] ? req.headers["cf-ipcountry"] : "XX";
}

export function handleError(res: Response, err: ResponseError) {
  // Prints error in console
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  // Sends error to user
  res.status(err.code || 500).json({
    errors: {
      msg: err.message
    }
  });
}

export function yieldError(code: number, message: any) {
  return {
    code,
    message
  };
}

export function validate(req: Request, res: Response, next: NextFunction) {
  try {
    validationResult(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    return next();
  } catch (err) {
    return handleError(res, {
      name: "ValidationError",
      ...yieldError(422, err.array())
    });
  }
}

export function yieldSuccess(message: string) {
  return {
    msg: message
  };
}

export async function checkID(id: string) {
  return new Promise((resolve, reject) => {
    const goodID = mongoose.Types.ObjectId.isValid(id);
    return goodID
      ? resolve(id)
      : reject(yieldError(422, appConfig.errors.MALFORMED_ID));
  });
}

export function itemNotFound(
  err: ResponseError,
  item: any,
  reject: (reason?: any) => void,
  message: string
) {
  if (err) {
    reject(yieldError(422, err.message));
  }
  if (!item) {
    reject(yieldError(404, message));
  }
}

export function itemAlreadyExists(
  err: ResponseError,
  item: any,
  reject: (reason?: any) => void,
  message: string
) {
  if (err) {
    reject(yieldError(422, err.message));
  }
  if (item) {
    reject(yieldError(422, message));
  }
}
