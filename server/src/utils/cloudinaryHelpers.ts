import { Readable } from "stream";
import cloudinary from "../config/connectCloudinary";

//  Upload file
export const uploadToCloudinary = (buffer: Buffer, folder = "default") => {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

//  Xóa file theo `public_id`
export const deleteFromCloudinary = (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

//  Cập nhật file 
export const updateCloudinaryFile = async (
  oldPublicId: string,
  newBuffer: Buffer,
  folder = "default"
) => {
  const uploadResult = await uploadToCloudinary(newBuffer, folder);
  await deleteFromCloudinary(oldPublicId); 
  return uploadResult;
};
