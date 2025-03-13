// backend/config/multer.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "form_uploads";
    let resource_type = "raw";

    if (file.mimetype.startsWith("image")) {
      resource_type = "image";
    } else if (file.mimetype.startsWith("video")) {
      resource_type = "video";
    }

    return {
      folder,
      resource_type,
    };
  },
});

const upload = multer({ storage });

export default upload;
