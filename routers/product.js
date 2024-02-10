const express = require("express");
const productRouter = express.Router({ mergeParams: true });
const { tokenVerify } = require("../auth/tokenVerify");
const allowedTo = require("../auth/permissions");
const {
  productImageUploader,
  productResizeImage,
} = require("../controller/upload/poduct");

const {
  addProduct,
  deleteProduct,
  updateproduct,
  getproducsbyId,
  getallproducts,
} = require("../controller/productController");

const {
  addProductVal,
  idProductVal,
  updateProductVal,
} = require("../validators/productValidator");

////////////////////////////////////////////////////////////////////////////////
productRouter
  .route("/products")
  .get(tokenVerify, allowedTo("user"), getallproducts);
////////////////////////////////////////////////////////////////////////////////
productRouter
  .route("/addproduct")
  .post(
    tokenVerify,
    allowedTo("user"),
    productImageUploader,
    productResizeImage,
    addProductVal,
    addProduct
  );

////////////////////////////////////////////////////////////////////////////////////
productRouter.route("/product/:idPro").get(idProductVal, getproducsbyId);

////////////////////////////////////////////////////////////////////////////////////
productRouter
  .route("/updateproduct/:id")
  .post(
    tokenVerify,
    allowedTo("manager"),
    productImageUploader,
    productResizeImage,
    updateProductVal,
    updateproduct
  );
/////////////////////////////////////////////////////////////////////////////////////
productRouter
  .route("/deleteProduct/:id")
  .delete(tokenVerify, allowedTo("manager"), idProductVal, deleteProduct);

module.exports = productRouter;
