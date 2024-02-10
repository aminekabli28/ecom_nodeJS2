const handleAsync = require("express-async-handler");

const userModel = require("../model/userModel");

addAdresse = handleAsync(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { adresses: req.body } },
    { new: true }
  );
  if (!user) return Promise(new Error("failed to add"));

  res.status(200).json({ statu: "succes", adresses: user.adresses });
});
delAdresse = handleAsync(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { adresses: { _id: req.params.adresseId } } },
    { new: true }
  );
  if (!user) return Promise(new Error("failed to delete"));

  res.status(200).json({ statu: "succes-delete", adresses: user.adresses });
});

//***********************my wishlist************************************************************** */

myAdresses = handleAsync(async (req, res, next) => {
  const user = await userModel
    .findById({ _id: req.user._id })
    .populate({ path: "adresses", select: "-_id" });
  if (!user) return Promise(new Error("no user "));

  res.status(200).json({
    statu: "succes",
    N: user.adresses.length,
    adresses: user.adresses,
  });
});

module.exports = { addAdresse, delAdresse, myAdresses };
