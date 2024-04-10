const mongoose = require('mongoose');


/**
 * Function for finding a document. We'll append this onto a schema to 
 * turn this into a static method for a model.
 * 
 * @param {Model} model - Mongoose Model to perform the search on
 * @param {string} docID - Id of the document
 * @param {array} populateOptions - Array of strings that indicate the fields that should be populated
 *                                  in case we want to populate some refs.
 * @returns {object|} - A document/model instance returned, or null if no document was found
 */
const findDocByID = async function(model, docID, populateOptions = null) {
  // Check if the document ID provided is valid
  if (!mongoose.Types.ObjectId.isValid(docID)) {
    return null;
  }
  
  /*
  1. Create our query object
  2. If 'populateOptions', then we passed in some fields to populate, so add
    these populate commands onto the query.
  - NOTE: Although it may appear that we are resetting the query object with each
    iteration of the loop, this is not the case. In JavaScript, objects are passed 
    by reference, so when we call the populate method on the query object, we are 
    updating its reference with a new reference that includes an additional populate 
    command for the current field. Therefore, each iteration of the loop modifies the 
    query object to include the population instruction for the corresponding field in the populateOptions object."
  */
  let query = model.findById(docID);
  if (populateOptions) {
    for (const field of populateOptions) {
      query = query.populate(field);
    }
  }

  // Execute the query and attempt to return our document
  const document = await query.exec();
  
  // Return our document, or null if nothing was found
  return document;
};

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
} 

module.exports = {
  findDocByID,
  isValidObjectId
};
