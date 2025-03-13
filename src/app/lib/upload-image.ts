import cloudinary from "./cloudinary";

export const UploadFile = async (file: File, folder: string) => {
  if (!file) {
    throw new Error("File is null or undefined.");
  }

  console.log("File details:", file);

  try {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        }
      ).end(bytes);
    });

    console.log("Image uploaded successfully.");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
