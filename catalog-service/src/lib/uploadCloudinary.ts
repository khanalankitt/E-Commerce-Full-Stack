import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import type { UploadApiResponse } from "cloudinary";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = "products",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(result);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
};
