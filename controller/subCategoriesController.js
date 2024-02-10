const slugify = require("slugify");
const SubCategoryModel = require("../model/SubCategoryModel");
const ApiError = require("../api/ApiErrors");
const handleAsync = require("express-async-handler");

addSubCategory = handleAsync(async (req, res) => {
  const newSubCategory = new SubCategoryModel({
    name: req.body.name,
    slug: slugify(req.body.name),
    category: req.body.category,
  });

  await newSubCategory
    .save()
    .then(() => {
      console.log("SubCotegory added");
      res.status(200).json({ newSubCategory });
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
});

deleteSubCotegory = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  const SubCategory = await SubCategoryModel.findOneAndDelete(
    { _id: id },
    { new: true }
  );

  if (!SubCategory) {
    return next(new ApiError("category id not available", 404));
  }
  res.status(200).json({ msg: `SubCategory deleted` });
});

getallSubCategory = handleAsync(async (req, res, next) => {
  let filterIObj = {};
  if (req.params.categoryId) {
    filterIObj = { category: req.params.categoryId };
  }
  const SubCategory = await SubCategoryModel.find(filterIObj);

  if (!SubCategory) {
    return next(new ApiError("no products", 404));
  }
  res.status(200).json({ result: SubCategory.length, SubCategory });
});

getSubCategorysbyId = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const SubCategory = await SubCategoryModel.findById(id);

  if (!SubCategory) {
    return next(new ApiError("product id not available", 404));
  }
  res.status(200).json({ result: SubCategory.length, SubCategory });
});

updateSubCategory = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const SubCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name: name },
    { new: true }
  );

  if (!SubCategory) {
    res.status(404).json({ msg: "no SubCategory for this id" });
  } else {
    res.status(200).json({ result: SubCategory.length, SubCategory });
  }
});

module.exports = {
  addSubCategory,
  deleteSubCotegory,
  getallSubCategory,
  getSubCategorysbyId,
  updateSubCategory,
};
