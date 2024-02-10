const express = require("express");
const categoryRouter = express.Router({ mergeParams: true });
const allowedTo = require("../auth/permissions");
const {
  addCategoryVal,
  idCategoryVal,
  upCategoryVal,
} = require("../validators/category");

const {
  categoryImageUploader,
  CategoryResizeImage,
} = require("../controller/upload/category");

const {
  getallCategory,
  addCategory,
  deleteCotegory,
  updateCategory,
  getCategorysbyId,
} = require("../controller/cotegoryController");
const { tokenVerify } = require("../auth/tokenVerify");

///////////////////////////////////////////////////////////////////////////
categoryRouter
  .route("/addcategory")
  .post(
    tokenVerify,
    allowedTo("user"),
    categoryImageUploader,
    CategoryResizeImage,
    addCategoryVal,
    addCategory
  );
////////////////////////////////////////////////////////////////////////////
categoryRouter.delete(
  "/deleteCotegory/:id",
  tokenVerify,
  allowedTo("admin"),
  idCategoryVal,
  deleteCotegory
);

///////////////////////////////////////////////////////////////////////////
categoryRouter.post(
  "/updateCategory/:id",
  tokenVerify,
  allowedTo("admin"),
  categoryImageUploader,
  CategoryResizeImage,
  upCategoryVal,
  updateCategory
);
/////////////////////////////////////////////////////////////////////////////

categoryRouter.get("/Categories", getallCategory);
/////////////////////////////////////////////////////////////////////////////
categoryRouter.get("/Category/:id", idCategoryVal, getCategorysbyId);

module.exports = categoryRouter;
