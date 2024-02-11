const multer = require("multer");
const ApiError = require("../../api/ApiErrors");
// const sharp = require("sharp");
const handleAsync = require("async-error-handler");

// const categoryStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const imageEx = file.mimetype.split("/");
//     const uniqueSuffix =
//       Date.now() + "-" + (Math.round(Math.random() * 1e9) + `.${imageEx[1]}`);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// const categoryStorage = multer.memoryStorage();
// const ProductStorage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const uploadCategoryImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

categoryImageUploader = uploadCategoryImage.single("image");

const CategoryResizeImage = handleAsync(async (req, res, next) => {
  const filename =
    Date.now() + "-" + (Math.round(Math.random() * 1e9) + `.jpeg`);
  req.body.image = filename;
  // await sharp(req.file.buffer)
  //   .resize(400, 400)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`uploads/categories/${filename}`);
  next();
});

module.exports = {
  categoryImageUploader,
  CategoryResizeImage,
};
