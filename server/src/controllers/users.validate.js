import { validate } from "../middleware/utils";
import { isURL } from "validator";
import { check } from "express-validator";

export const createItem = [
  check("name")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  check("email")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .isEmail()
    .withMessage("EMAIL_IS_NOT_VALID"),
  check("password")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .isLength({
      min: 5
    })
    .withMessage("PASSWORD_TOO_SHORT_MIN_5"),
  check("role")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY")
    .isIn(["user", "admin"])
    .withMessage("USER_NOT_IN_KNOWN_ROLE"),
  check("urlTwitter")
    .optional()
    .custom(v => (v === "" ? true : isURL(v)))
    .withMessage("NOT_A_VALID_URL"),
  (req, res, next) => {
    validate(req, res, next);
  }
];

export const updateItem = [
  check("name")
    .optional()
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  check("email")
    .optional()
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  check("role")
    .optional()
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  check("urlTwitter")
    .optional()
    .custom(v => (v === "" ? true : isURL(v)))
    .withMessage("NOT_A_VALID_URL"),
  check("id")
    .optional()
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validate(req, res, next);
  }
];

export const getItem = [
  check("id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validate(req, res, next);
  }
];

export const deleteItem = [
  check("id")
    .exists()
    .withMessage("MISSING")
    .not()
    .isEmpty()
    .withMessage("IS_EMPTY"),
  (req, res, next) => {
    validate(req, res, next);
  }
];
