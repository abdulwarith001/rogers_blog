import cloudinary from "../config/cloudinaryConfig.js";
import { promises as fsPromises } from "fs"; // Use fs.promises for async file operations

const uploadImage = async (req, res, next) => {
  let uploadedImages;

  if (req.file) {
    const path = req.file.path;

    try {
      const result = await cloudinary.v2.uploader.upload(path, {
        folder: "blog",
      });

      const imageInfo = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      uploadedImages = imageInfo;
      await fsPromises.unlink(path);
    } catch (error) {
      await fsPromises.unlink(path);
      console.error("Cloudinary Upload Error:", error);
      res.status(500).json({
        message:
          "Something went wrong while uploading images, please try again",
        error: error,
      });
      return;
    }

    req.body.image = uploadedImages;
  }

  next();
};

export default uploadImage;
