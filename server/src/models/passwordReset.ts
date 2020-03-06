import { Schema, model } from "mongoose";
import Validator from "validator";
import appConfig from "../config";

const { isEmail } = Validator;

const ForgotPasswordSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: isEmail,
        message: appConfig.errors.INVALID_EMAIL
      },
      lowercase: true,
      required: true
    },
    verification: {
      type: String
    },
    used: {
      type: Boolean,
      default: false
    },
    ipRequest: {
      type: String
    },
    browserRequest: {
      type: String
    },
    countryRequest: {
      type: String
    },
    ipChanged: {
      type: String
    },
    browserChanged: {
      type: String
    },
    countryChanged: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model("ForgotPassword", ForgotPasswordSchema);
