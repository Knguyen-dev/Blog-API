import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { createError } from "./errorUtils";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary";



// Define the directory where you want to store images; relative to the project root
const imageDirectory = path.join(process.cwd(), "public/avatars");


// Check if the directory exists, if not, create it
if (!fs.existsSync(imageDirectory)) {
  fs.mkdirSync(imageDirectory, { recursive: true });
}


// Create storage and logic for uploading user avatars/profile pictures to our disk.
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, imageDirectory)
  },

  // Save the file with a unique filename, we then store this filename
  // In the database, allowing us to access the file from our server later.
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

// Array of file types that we accept
const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"];

/**
 * Function that ensures only files with mimetype in our 'acceptedFileTypes' are 
 * uploaded and saved to our directory.
 * 
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

  // If file type is included in our acceptedFileTypes, accept the file
  if (acceptedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {

    // Else file is not in accepted file types so reject the file with an error
    const err = createError(400, "Only .png, .jpg, and .jpeg files are allowed!")
    cb(err);
  }
}


/**
 * Creates a multer instance wiht our configurations. We'll use this multer instance and access its
 * '.single' api to download user files to our directory.
 * 
 */
const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 1, // one file per request

    /*
    - fileSize in bytes. So 1048576 bytes is 1 MB. So
    Here we do 5 MB as the maximum file size.
    */
    fileSize: 1024 * 1024 * 5, 
  }
});


/**
 * Middleware for saving a file to disk. File field should have name 'file'.
 * If there's a file, we save the file and move on, but if there is no file found, user 
 * didn't send a file, then we throw an error.
 * 
 */
const saveFile = (req: Request, res: Response, next: NextFunction) => {
  
  // Evoke multer middleware immediately, our third parameter is the file filter callback
  uploadFile.single("file")(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    // req.file should be at least accessible, so check if it exists
    if (!req.file) {
      const fileError = createError(400, "Image file was missing. Please send an image file!");
      return next(fileError);
    }

    const uploadResult = await uploadToCloudinary(req.file.path);
    req.cloudinaryFileUrl = uploadResult.secure_url;


    // Delete that uploaded avatar from our local disk
    await deleteFromDisk(req.file.path);

    // Successful file upload; go to the next middleware after saveFile
    next();
  })
}

/**
 * Middleware that deletes a file from our directory.
 * 
 */
const deleteFromDisk = (filePath: string): Promise<void | Error> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}

export {
  saveFile,
  deleteFromDisk,
  imageDirectory
};