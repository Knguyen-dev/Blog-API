const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Define the directory where you want to store images
const imageDirectory = "public/avatars";

// Check if the directory exists, if not, create it
if (!fs.existsSync(imageDirectory)) {
  fs.mkdirSync(imageDirectory, { recursive: true });
}


// Create storage and logic for uploading user avatars/profile pictures
// to our disk.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDirectory)
  },

  // Save the file with a unique filename, we then store this filename
  // In the database, allowing us to access the file from our server later.
  filename: (req, file, cb) => {

    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    
  }
})

// Array of file types that we accept
const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"];

/**
 * Function that ensures only files with mimetype in our 'acceptedFileTypes' are 
 * uploaded and saved to our directory.
 * 
 * @param {Object} req - Request object
 * @param {Object} file - File object
 * @param {function} cb - Function used with multer to indicate the success status.
 */
const fileFilter = (req, file, cb) => {
  // If file type is included in our acceptedFileTypes, accept the file
  if (acceptedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Else file is not in accepted file types so reject the file with an error
    cb(Error("Only .png, .jpg, and .jpeg files are allowed!"));
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
 * Middleware that deletes a file from our directory.
 * 
 * @param {string} filePath - Path to the file we want to delete
 * @returns 
 */
const deleteFromDisk = (filePath) => {
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

module.exports = {
  uploadFile,
  deleteFromDisk,
  imageDirectory

};