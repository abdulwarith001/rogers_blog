import { MulterImageError } from "./customErrors.js";

// Error handling middleware for Multer
const multerErrorHandling = (err, req, res, next) => {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      throw new MulterImageError("File size exceeded");
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      throw new MulterImageError("Maximum number of images exceeded");
    } else {
      throw new MulterImageError(err.message);
    }
  } else if (err) {
    throw new MulterImageError(err.msg);
  }

  next();
};

export default multerErrorHandling;
