const express = require("express");
const subCatRouter = express.Router({ mergeParams: true });

const {
  addSubCategory,
  deleteSubCotegory,
  getallSubCategory,
  getSubCategorysbyId,
  updateSubCategory,
} = require("../controller/subCategoriesController");

const {
  addSubCategoryVal,
  idSubCategoryVal,
  upSubCategoryVal,
} = require("../validators/subCategory");

subCatRouter.route("/addSubCategory").post(addSubCategoryVal, addSubCategory);
subCatRouter
  .route("/deleteSubCotegory/:id")
  .delete(idSubCategoryVal, deleteSubCotegory);
subCatRouter
  .route("/updateSubCategory/:id")
  .post(upSubCategoryVal, updateSubCategory);
subCatRouter.route("/SubCategories").get(getallSubCategory);
subCatRouter
  .route("/SubCategory/:id")
  .get(idSubCategoryVal, getSubCategorysbyId);
//----------------------Users routers -------------------------------

subCatRouter.route("/categories/:categoryId/subs").get(getallSubCategory);

module.exports = subCatRouter;
