const mongoose = require('mongoose');

/*
- Static method for finding a document. It handles checking whether the ID is valid,
  the selection of fields, and the sending of errors if the document wasn't found. 
  Finally it returns the document.

- NOTE: 
  1. Main benefit of this is now we can reduce a lot of repetition that 
  we'd normally face when doing things such as verifynig whether the id is valid, 
  querying the database via id, and then checking if the database found anything.

  2. If selectOptions is null, mongoose will include all fields.

  3. Status code 404 is reserved for bad document id and no document found. Whlist 
    we use status code 400 to indicate that we found invalid input in a document's 
    input data. These status codes sometimes return error objects in different forms,
    and we can predict what kind of error data we'll get on the front end if we follow
    these rules.
*/
const findDocumentByID = async function(docID, selectOptions = null) {
  // Check if the document ID provided is valid
  if (!mongoose.Types.ObjectId.isValid(docID)) {
    const err = new Error("Invalid document ID!");
    err.statusCode = 404;
    throw err;
  }
  
  let document = await this.findById(docID).select(selectOptions);
  
  // If no document was found with that ID
  if (!document) {
    const err = new Error("Document not found!");
    err.statusCode = 404;
    throw err;
  }
  
  return document;
};

module.exports = { findDocumentByID };
