import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "BlogSphere" // optional: specify folder in Cloudinary
    });
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

/**
 * Extracts the public ID from the url linking to the cloudinary file
 * 
 * NOTE: This is helpful so that we only need to store the url to the cloudinary file, in order to not only
 * show the file, but also be able to delete it as well.
 * 
 * /upload\/: This part of the regex matches the literal string "upload/" in the URL. Cloudinary URLs typically contain this string before the public_id.
 * (?:v\d+\/)?: This is a non-capturing group (?: ... ) that matches an optional version number in the URL. The v\d+\/ part matches a 
 *              literal "v" followed by one or more digits (\d+), followed by a slash. The '?' makes this whole group optional, allowing
 *              URLs with or without a version number.
 * ([^\.]+): This is a capturing group (...) that matches and captures the public_id. The [^\.]+ part matches one or more characters that 
 *           are not a period ([^\.] is a negated character class that matches any character except a period). This allows it to match 
 *           the public_id, which typically does not contain periods.
 * @param url - A url linking to the cloudinary file
 * 
 */
const extractPublicIdFromUrl = (url: string) => {
  const regex = /upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};


/**
 * Deletes an image from cloudinary given it's image url
 * 
 * @param imageUrl - Cloudinary image url
 */
const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);

    if (!publicId) {
      throw Error("Invalid cloudinary image url! Couldn't parse public_id value.")
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);

  }
};

export {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl
}