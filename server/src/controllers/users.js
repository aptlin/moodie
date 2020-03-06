import { matchedData } from "express-validator";
import { v4 as unique_id } from "uuid";
import model from "../app/models/user";
import {
  checkQueryString,
  deleteItem,
  getItem,
  getItems,
  updateItem
} from "../middleware/db";
import {
  emailExists,
  emailExistsExcludingMyself,
  sendRegistrationEmailMessage
} from "../middleware/emailer";
import { checkID, handleError, yieldError } from "../middleware/utils";

const create = async req => {
  return new Promise((resolve, reject) => {
    const user = new model({
      name: req.name,
      email: req.email,
      password: req.password,
      role: req.role,
      phone: req.phone,
      city: req.city,
      country: req.country,
      verification: unique_id()
    });
    user.save((err, item) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      // Removes properties with rest operator
      const removeProperties = ({
        // eslint-disable-next-line no-unused-vars
        password,
        // eslint-disable-next-line no-unused-vars
        blockExpires,
        // eslint-disable-next-line no-unused-vars
        loginAttempts,
        ...rest
      }) => rest;
      resolve(removeProperties(item.toObject()));
    });
  });
};

export async function getItems(req, res) {
  try {
    const query = await checkQueryString(req.query);
    res.status(200).json(await getItems(req, model, query));
  } catch (error) {
    handleError(res, error);
  }
}
export async function getItem(req, res) {
  try {
    req = matchedData(req);
    const id = await checkID(req.id);
    res.status(200).json(await getItem(id, model));
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export async function updateItem(req, res) {
  try {
    req = matchedData(req);
    const id = await checkID(req.id);
    const doesEmailExists = await emailExistsExcludingMyself(id, req.email);
    if (!doesEmailExists) {
      res.status(200).json(await updateItem(id, model, req));
    }
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export async function createItem(req, res) {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    req = matchedData(req);
    const doesEmailExists = await emailExists(req.email);
    if (!doesEmailExists) {
      const item = await create(req);
      sendRegistrationEmailMessage(locale, item);
      res.status(201).json(item);
    }
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export async function deleteItem(req, res) {
  try {
    req = matchedData(req);
    const id = await checkID(req.id);
    res.status(200).json(await deleteItem(id, model));
  } catch (error) {
    handleError(res, error);
  }
}
