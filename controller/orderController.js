const stripe = require("stripe")(
  "sk_test_51OhvDvDQTF6YqlIL8PpSyHbkPPUbB3TAvUw9yYy5PwQDDWS2r68jLCQ6RafVK0oz6fPquS9UZ8icuR21DBaISr7W00vOptxaed"
);
const handleAsync = require("express-async-handler");
const ApiError = require("../api/ApiErrors");
const orderModel = require("../model/orderModel");
const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Cash ////////////////////////////////////////////////////////////////////

createCashOrder = handleAsync(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await cartModel.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ApiError(`There is no such cart`, 404));
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default paymentMethodType cash
  const order = await orderModel.create({
    user: req.user.id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await cartModel.findOneAndDelete({ user: req.user.id });
  }

  res.status(201).json({ status: "success", data: order });
});

orders = handleAsync(async (req, res, next) => {
  if (req.params.role == "user") {
    const orders = await orderModel
      .findOne({ user: req.user.id })
      .populate({ path: "cartItems.product", select: "title" })
      .populate({ path: "user", select: "name" });
    if (!orders) {
      return next(new ApiError("No orders", 404));
    }
    res.status(200).json({ statu: "succes", orders: orders });
  } else if (req.params.role == "admin" || req.params.role == "manager") {
    const orders = await orderModel
      .find()
      .populate({ path: "cartItems.product", select: "title" })
      .populate({ path: "user", select: "name" });
    if (!orders) {
      return next(new ApiError("No orders", 404));
    }
    res.status(200).json({ statu: "succes", orders: orders });
  }
});

order = handleAsync(async (req, res, next) => {
  if (req.user.role == "user") {
    const order = await orderModel
      .findOne({ user: req.user.id, _id: req.params.orderId })
      .populate({ path: "cartItems.product", select: "title" })
      .populate({ path: "user", select: "name" });
    if (!order) {
      return next(new ApiError("No order", 404));
    }
    res.status(200).json({ statu: "succes", order: order });
  } else if (req.user.role == "admin" || req.user.role == "manager") {
    const order = await orderModel
      .findOne({ _id: req.params.orderId })
      .populate({ path: "cartItems.product", select: "title" })
      .populate({ path: "user", select: "name" });
    if (!order) {
      return next(new ApiError("No order", 404));
    }

    res.status(200).json({ statu: "succes", order: order });
  }
});

orderPaid = handleAsync(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.orderId}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

orderDelivered = handleAsync(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.orderId}`,
        404
      )
    );
  }

  // update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////card //////////////////////////////////////////////////////////////////////

checkoutSession = handleAsync(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await cartModel.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ApiError(`There is no such cart `, 404));
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "mad",
          product_data: { name: req.user.name },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,

    customer_email: req.user.email,
    client_reference_id: req.user.id,

    //client_reference_id: cart._id,
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await orderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await cartModel.findByIdAndDelete(cartId);
  }
};
module.exports = {
  createCashOrder,
  orders,
  order,
  orderPaid,
  orderDelivered,
  checkoutSession,
};
