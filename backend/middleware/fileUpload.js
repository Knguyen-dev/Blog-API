const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create storage and logic for uploading user avatars/profile pictures
// to our disk.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images")
  },

  // Save the file with a unique filename, we then store this filename
  // In the database, allowing us to access the file from our server later.
  filename: (req, file, cb) => {

    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    
  }
})

/*
- File filter: Function that lets us control which files should be uploaded and which
  files should be skipped.
*/

const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
  // If file type is included in our acceptedFileTypes, accept the file
  if (acceptedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Else file is not in accepted file types so reject the file with an error
    cb(Error("Only .png, .jpg, and .jpeg files are allowed!"));
  }
}


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

/*
+ Deletes file from disk. We'll use this to delete avatar images from disk.

- If there's an error, we reject it, meaning we return a promise that will 
  eventually evaluate into an error. Let's remember what happens when we 
  reject a promise:

  1. State transition: Promise transitions from pending to 'rejected' state.
  2. Error handling: The nearest .catch() block is used to handle the rejection
    and execute our associated error handling code in that catch block. Or the
    .then() block could be used if you're running two args. 
  3. Propagation: If there's no explicit error handling, then the error object
    will keep propagating down the promise chain until it reaches a block that 
    handles the error. That happens in this case, as we don't have immediate 
    error handling in our deleteFromDisk function, so it propagates to our 
    route handling function where it's caught by asyncHander.

- Else we're successful, so return a promise that evaluates during nothing. 
  If an error happens during our deletion process, our 'await' will evaluate 
  to an error, which in turn should be caught by our asyncHandler.

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

};