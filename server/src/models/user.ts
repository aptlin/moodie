import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
import appConfig from "../config";
import { PasswordCallback, AppUserSchema } from "../../types";
import paginate from "mongoose-paginate-v2";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: appConfig.errors.INVALID_EMAIL
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    verification: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    urlTwitter: {
      type: String,
      validate: {
        validator(v: string) {
          return v === "" ? true : validator.isURL(v);
        },
        message: appConfig.errors.INVALID_URL
      },
      lowercase: true
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    },
    favorites: {
      type: [String],
      default: []
    },
    following: {
      type: [String],
      default: []
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  return bcrypt.genSalt(appConfig.auth.saltFactor, (err, salt) => {
    if (err) {
      return next(err);
    }
    return bcrypt.hash((this as any).password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      (this as any).password = hash;
      return next();
    });
  });
});

UserSchema.methods.verifyPassword = function(
  passwordAttempt: string,
  cb: PasswordCallback
) {
  bcrypt.compare(passwordAttempt, this.password, (err, same) =>
    cb({ err, same })
  );
};

UserSchema.plugin(paginate);

const userModel = mongoose.model<AppUserSchema>("User", UserSchema);
export default userModel;
