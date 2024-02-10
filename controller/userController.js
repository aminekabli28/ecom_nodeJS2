const handleAsync = require("express-async-handler");
const { default: slugify } = require("slugify");
const ApiError = require("../api/ApiErrors");
const userModel = require("../model/userModel");
const Features = require("./features");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//******************************************************* */
addUser = handleAsync(async (req, res) => {
  req.body.slug = slugify(req.body.name);

  req.body.password = await bcrypt.hash(req.body.password, 12);
  const newUser = await userModel.create(req.body);

  res.status(200).json({ msg: `User added`, data: newUser });
});

//----------------------------------------------------------------------
deleteUser = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await userModel.findOneAndDelete({ _id: id }, { new: true });

  if (!user) {
    return next(new ApiError("user id not available", 404));
  }
  res.status(200).json({ msg: `${id} deleted` });
});

/**------------------------------------------------------------------- */
getallUsers = handleAsync(async (req, res, next) => {
  const countDoc = await userModel.countDocuments();
  let apiFeature = new Features(userModel.find(), req.query)

    .Filter()
    .sort()
    .field()
    .search()
    .pagination(countDoc);

  const users = await apiFeature.mongooseQuery;

  //errors
  if (!users) {
    return next(new ApiError("no users", 404));
  }
  res.status(200).json({
    result: users.length,
    result: apiFeature.paginationResult,
    users,
  });
});
//---------------------------------------------------------------
getUsersbyId = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (!user) {
    return next(new ApiError("user id not available", 404));
  }

  res.status(200).json({ result: user.length, user });
});

//--------------------------------------------------------------

updateUser = handleAsync(async (req, res) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!user) {
    res.status(404).json({ msg: "no user for this id" });
  } else {
    res.status(200).json({ result: user.length, user });
  }
});

changeUserPassword = handleAsync(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

updatemypassword = handleAsync(async (req, res, next) => {
  console.log(req.params.id);
  const user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = jwt.sign({ userId: user._id }, "amine", {
    expiresIn: "100d",
  });

  res.status(200).json({ massage: "password updated", token });
});

module.exports = {
  addUser,
  deleteUser,
  updateUser,
  getUsersbyId,
  getallUsers,
  changeUserPassword,
  updatemypassword,
};
