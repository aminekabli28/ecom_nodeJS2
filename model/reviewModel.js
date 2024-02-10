const mongoose = require("mongoose");
const productModel = require("./productModel");
const { consumers } = require("nodemailer/lib/xoauth2");

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "min rating value is 1"],
      max: [5, "max rating value is 5"],
      required: [true, "rating are required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "user must be belong to ratings"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "product must be belong to ratings"],
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAvgQtt = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgratings: { $avg: "$ratings" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgratings,
      ratingsQuantity: result[0].ratingQuantity,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function (next) {
  console.log("saving");
  this.constructor.calcAvgQtt(this.product);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name-_id " });
  next();
});

module.exports = mongoose.model("review", reviewSchema);
