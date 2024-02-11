const multer = require("multer");
const ApiError = require("../../api/ApiErrors");
// const sharp = require("sharp");
const handleAsync = require("async-error-handler");

const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

productImageUploader = uploadProductImage.fields([
  // { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

const productResizeImage = handleAsync(async (req, res, next) => {
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img) => {
        const imageName =
          Date.now() + "-" + (Math.round(Math.random() * 1e9) + `.jpeg`);

        //   await sharp(img.buffer)
        //     .resize(400, 400)
        //     .toFormat("jpeg")
        //     .jpeg({ quality: 90 })
        //     .toFile(`uploads/products/${imageName}`);
        //   req.body.images.push(imageName);
      })
    );
    req.body.imageCover = req.body.images[0];
  }
  next();
});

module.exports = {
  productImageUploader,
  productResizeImage,
};
