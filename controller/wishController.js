const handleAsync = require("express-async-handler");
const userModel = require("../model/userModel");
addProToWishList = handleAsync(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );
  if (!user) return Promise(new Error("failed to add"));

  res.status(200).json({ statu: "succes", wishlist: user.wishlist });

});
dellProRfomWishList = handleAsync(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  );
  if (!user) return Promise(new Error("failed to delete"));

  res.status(200).json({ statu: "succes-delete", wishlist: user.wishlist });

});

//***********************my wishlist************************************************************** */

myWishList = handleAsync(async (req, res, next) => {
  const user = await userModel
    .findById({ _id: req.user.id })
    .populate({ path: "wishlist", select: "title -_id" });
  if (!user) return Promise(new Error("no user "));

  res.status(200).json({
    statu: "succes",
    N: user.wishlist.length,
    wishlist: user.wishlist,
  });

});

module.exports = { addProToWishList, dellProRfomWishList, myWishList };
