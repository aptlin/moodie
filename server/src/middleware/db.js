import { yieldSuccess, yieldError, itemNotFound } from "./utils";
import appConfig from "../config";

const buildSort = (sort, order) => {
  const sortBy = { [sort]: order };
  return sortBy;
};

const cleanPaginationID = result => {
  result.docs.map(element => delete element.id);
  return result;
};

const listInitOptions = async req => {
  return new Promise(resolve => {
    const order = req.query.order || -1;
    const sort = req.query.sort || "createdAt";
    const sortBy = buildSort(sort, order);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit
    };
    resolve(options);
  });
};

export async function checkQueryString(query) {
  return new Promise((resolve, reject) => {
    try {
      if (
        typeof query.filter !== "undefined" &&
        typeof query.fields !== "undefined"
      ) {
        const data = {
          $or: []
        };
        const array = [];
        const arrayFields = query.fields.split(",");
        arrayFields.map(item => {
          array.push({
            [item]: {
              $regex: new RegExp(query.filter, "i")
            }
          });
        });
        data.$or = array;
        resolve(data);
      } else {
        resolve({});
      }
    } catch (err) {
      console.log(err.message);
      reject(yieldError(422, appConfig.errors.COULD_NOT_FILTER));
    }
  });
}

export async function getItems(req, model, query) {
  const options = await listInitOptions(req);
  return new Promise((resolve, reject) => {
    model.paginate(query, options, (err, items) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      resolve(cleanPaginationID(items));
    });
  });
}

export async function getItem(id, model) {
  return new Promise((resolve, reject) => {
    model.findById(id, (err, item) => {
      itemNotFound(err, item, reject, appConfig.errors.NOT_FOUND);
      resolve(item);
    });
  });
}

export async function createItem(req, model) {
  return new Promise((resolve, reject) => {
    model.create(req, (err, item) => {
      if (err) {
        reject(yieldError(422, err.message));
      }
      resolve(item);
    });
  });
}

export async function updateItem(id, model, req) {
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(
      id,
      req,
      {
        new: true,
        runValidators: true
      },
      (err, item) => {
        itemNotFound(err, item, reject, appConfig.errors.NOT_FOUND);
        resolve(item);
      }
    );
  });
}

export async function deleteItem(id, model) {
  return new Promise((resolve, reject) => {
    model.findByIdAndRemove(id, (err, item) => {
      itemNotFound(err, item, reject, appConfig.errors.NOT_FOUND);
      resolve(yieldSuccess(appConfig.success.DELETED));
    });
  });
}
