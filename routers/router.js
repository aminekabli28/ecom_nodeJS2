const productRouter = require("./product");
const userRouter = require("./user");
const subCatRouter = require("./subCategory");
const categoryRouter = require("./category");
const authRouter = require("./auth");
const reviewRouter = require("./review");
const wishListRouter = require("./wishList");
const adresseRouter = require("./adresses");
const couponRouter = require("./coupon");
const cartRouter = require("./cart");
const orderRouter = require("./order");

routersRun = (App) => {
  App.use(productRouter);
  App.use(userRouter);
  App.use(subCatRouter);
  App.use(categoryRouter);
  App.use(authRouter);
  App.use(reviewRouter);
  App.use(wishListRouter);
  App.use(adresseRouter);
  App.use(couponRouter);
  App.use(cartRouter);
  App.use(orderRouter);
};

module.exports = routersRun;
