const categoryModel = require("../model/categoryModel");
const ApiError = require("../middlewares/errorMiddleware");
const slugify = require("slugify");

getallCategory = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = req.query.limit || 3;
  const skip = (page - 1) * limit;

  const Category = await categoryModel.find({}); //.skip(skip).limit(limit);
  if (!Category) {
    return next(new ApiError("no products", 404));
  }
  res.status(200).json({ result: Category.length, Category });
};

addCategory = async (req, res) => {
  const newCategory = new categoryModel({
    name: req.body.name,
    image: req.body.image,

    slug: slugify(req.body.name),
  });
  await newCategory
    .save()
    .then(() => {
      console.log("cotegory added");
      res.status(200).json({ newCategory });
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
};
deleteCotegory = async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOneAndDelete(
    { _id: id },
    { new: true }
  );

  if (!category) {
    return next(new ApiError("category id not available", 404));
  }
  res.status(200).json({ msg: `category deleted` });
};
updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const Category = await categoryModel.findOneAndUpdate(
    { _id: id },
    { name: name },
    { new: true }
  );

  if (!Category) {
    res.status(404).json({ msg: "no Category for this id" });
  } else {
    res.status(200).json({ result: Category.length, Category });
  }
};

getCategorysbyId = async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new ApiError("product id not available", 404));
  }
  res.status(200).json({ result: category.length, category });
};

module.exports = {
  getallCategory,
  addCategory,
  deleteCotegory,
  updateCategory,
  getCategorysbyId,
};
