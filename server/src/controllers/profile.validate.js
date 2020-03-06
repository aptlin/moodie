const { validate: validationResult } = require("../middleware/utils");
const validator = require("validator");
const { check } = require("express-validator");

// interface AppUser {
//   verified: boolean;
//   verification?: string;
//   urlTwitter?: string;
//   loginAttempts: number;
//   blockExpires?: Date;
//   following: string[];
//   favorites: string[];
// }
export const updateProfile = [
  check("name")
    .optional()
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  check("urlTwitter")
    .optional()
    .custom(v => (v === "" ? true : validator.isURL(v)))
    .withMessage("NOT_A_VALID_URL"),
  check("following")
    .optional()
    .custom(
      v =>
        Array.isArray(v) &&
        v.every(fav => typeof fav === "string" || fav instanceof String)
    )
    .withMessage("INVALID_TAGS"),
  check("favorites")
    .optional()
    .custom(
      v =>
        Array.isArray(v) &&
        v.every(fav => typeof fav === "string" || fav instanceof String)
    )
    .withMessage("INVALID_TAGS"),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates change password request
 */
export const changePassword = [
  check("oldPassword")
    .optional()
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .isLength({
      min: 5
    })
    .withMessage("PASSWORD_TOO_SHORT_MIN_5"),
  check("newPassword")
    .optional()
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .isLength({
      min: 5
    })
    .withMessage("PASSWORD_TOO_SHORT_MIN_5"),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];
