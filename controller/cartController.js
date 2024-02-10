const handleAsync = require("express-async-handler");
const ApiError = require("../api/ApiErrors");
const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");
const couponModel = require("../model/couponModel");

totalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

addToCart = handleAsync(async (req, res) => {
  const productId = req.body.productId;
  const color = req.body.color;

  const product = await productModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.body.productId,
          price: product.price,
          color,
        },
      ],
    });
  } else {
    const exItem = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );
    if (exItem > -1) {
      cart.cartItems[exItem].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color: color,
        price: product.price,
      });
    }
  }

  //***********************calc total proce */

  cart.totalCartPrice = totalPrice(cart);

  //******************************************** */

  await cart.save();
  res.status(200).json({ statu: "succes" });
});

getMyCart = handleAsync(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }
  res.status(200).json({ data: cart });
});

removeFromCart = handleAsync(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.cartItemsId },
      },
    },
    { new: true }
  );

  if (!cart) {
    return new ApiError("no cart for this user", 404);
  }
  cart.totalCartPrice = totalPrice(cart);
  res.status(200).json({ newData: cart });

  //***********************calc total proce */
});
removeCart = handleAsync(async (req, res, next) => {
  const cart = await cartModel.findOneAndDelete(
    { user: req.user._id },
    { new: true }
  );

  if (!cart) {
    return new ApiError("no cart for this user", 404);
  }
  res.status(204).json({ status: "cart deleted" });

  //***********************calc total proce */
});

updateCartItemQuantity = handleAsync(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  cart.totalCartPrice = totalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

applyCoupon = handleAsync(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await cartModel.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
module.exports = {
  addToCart,
  getMyCart,
  removeFromCart,
  removeCart,
  updateCartItemQuantity,
  applyCoupon,
};
