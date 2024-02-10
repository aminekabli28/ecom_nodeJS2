const multer = require("multer");
const ApiError = require("../../api/ApiErrors");
const sharp = require("sharp");
const handleAsync = require("async-error-handler");

const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const uploadUserImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

UserImageUploader = uploadUserImage.single("profileImg");

const UserResizeImage = handleAsync(async (req, res, next) => {
  if (req.body.profileImg) {
    const filename =
      Date.now() + "-" + (Math.round(Math.random() * 1e9) + `-user.jpeg`);
    req.body.profileImg = filename;
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
  }
  next();
});

module.exports = {
  UserImageUploader,
  UserResizeImage,
};
