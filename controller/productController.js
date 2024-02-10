const handleAsync = require("express-async-handler");
const { default: slugify } = require("slugify");
const ApiError = require("../api/ApiErrors");
const productModel = require("../model/productModel");
const Features = require("./features");

//******************************************************* */
addProduct = handleAsync(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const newProduct = await productModel.create(req.body);

  res.status(200).json({ msg: `product added`, data: newProduct });
});

//----------------------------------------------------------------------
deleteProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findOneAndDelete(
    { _id: id },
    { new: true }
  );

  if (!product) {
    return next(new ApiError("product id not available", 404));
  }
  res.status(200).json({ msg: `${id} deleted` });
});

/**------------------------------------------------------------------- */
getallproducts = handleAsync(async (req, res, next) => {
  const countDoc = await productModel.countDocuments();
  let apiFeature = new Features(productModel.find(), req.query)

    .Filter()
    .sort()
    .field()
    .search()
    .pagination(countDoc);

  const products = await apiFeature.mongooseQuery.populate({
    path: "category",
    select: "name -_id",
  });

  //errors
  if (!products) {
    return next(new ApiError("no products", 404));
  }
  res.status(200).json({
    result: products.length,
    result: apiFeature.paginationResult,
    products,
  });
});
//---------------------------------------------------------------
getproducsbyId = handleAsync(async (req, res, next) => {
  const id = req.params.idPro;
  const product = await productModel.findById(id).populate("reviews").populate({
    path: "category",
    select: "name -_id",
  });

  if (!product) {
    return next(new ApiError("product id not available", 404));
  }

  res.status(200).json({ result: product.length, product });
});

//--------------------------------------------------------------

updateproduct = handleAsync(async (req, res) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);

  const product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    res.status(404).json({ msg: "no product for this id" });
  } else {
    res.status(200).json({ result: product.length, product });
  }
});

module.exports = {
  addProduct,
  deleteProduct,
  updateproduct,
  getproducsbyId,
  getallproducts,
};
