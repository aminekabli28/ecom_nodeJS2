const express = require("express");
const userRouter = express.Router({ mergeParams: true });
const allowedTo = require("../auth/permissions");

const {
  UserImageUploader,
  UserResizeImage,
} = require("../controller/upload/user");

const {
  addUser,
  deleteUser,
  updateUser,
  getUsersbyId,
  getallUsers,
  changeUserPassword,
  updatemypassword,
} = require("../controller/userController");

const {
  addUserVal,
  getUserVal,
  deleteUserVal,
  updateUserVal,
  changeUserPasswordVal,
  updateLoggedUserVal,
} = require("../validators/userValidator");

//////////////////////////user //////////////////////////////////////////
userRouter.route("/getme").get(tokenVerify, getUsersbyId);
userRouter.route("/updatemypassword").get(tokenVerify, updatemypassword);

/////////////////////////admin //////////////////////////////////////
userRouter
  .route("/addUser")
  .post(
    tokenVerify,
    allowedTo("admin"),
    UserImageUploader,
    UserResizeImage,
    addUserVal,
    addUser
  );
userRouter
  .route("/deleteUser/:id")
  .delete(tokenVerify, allowedTo("admin"), deleteUserVal, deleteUser);
userRouter
  .route("/updateUser/:id")
  .post(
    tokenVerify,
    allowedTo("admin"),
    UserImageUploader,
    UserResizeImage,
    updateUserVal,
    updateUser
  );
userRouter
  .route("/getallUsers")
  .get(tokenVerify, allowedTo("admin"), getallUsers);
userRouter
  .route("/getUsersbyId/:id")
  .get(tokenVerify, allowedTo("admin"), getUserVal, getUsersbyId);
userRouter
  .route("/changePassword/:id")
  .post(changeUserPasswordVal, changeUserPassword);

module.exports = userRouter;
