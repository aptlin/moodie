import mongoose from "mongoose";
import validator from "validator";
import appConfig from "../config";
import { AppUserAccessSchema } from "../../types";

const UserAccessSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: appConfig.errors.INVALID_EMAIL
      },
      lowercase: true,
      required: true
    },
    ip: {
      type: String,
      required: true
    },
    browser: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const userAccessSchema = mongoose.model<AppUserAccessSchema>(
  "UserAccess",
  UserAccessSchema
);
export default userAccessSchema;
