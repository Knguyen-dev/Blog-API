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

- populateOptions: An array of strings indicating the fields that should be 
  populated.
*/
const findDocumentByID = async function(docID, populateOptions = null) {
  // Check if the document ID provided is valid
  if (!mongoose.Types.ObjectId.isValid(docID)) {
    const err = new Error(`Invalid ${this.modelName} ID!`);
    err.statusCode = 404;
    throw err;
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
  
  let query = this.findById(docID);
  if (populateOptions) {
    for (const field of populateOptions) {
      query = query.populate(field);
    }
  }

  // Execute the query and attempt to return our document
  const document = await query.exec();
  
  // If no document was found with that ID
  if (!document) {
    const err = new Error(`${this.modelName} not found!`);
    err.statusCode = 404;
    throw err;
  }
  
  return document;
};

/*

- NOTE: Function assumes tags and postTags are arrays of strings.
  So for postTags, convert the object ids into strings first.
*/
function areTagIDsSubset(tags, postTags) {
  // Convert arrays to sets for efficient comparison
  const tagsSet = new Set(tags);
  const postTagsSet = new Set(postTags);
  
  // Check if all tag IDs in 'tags' are already present in 'postTags'
  // If true, it means all provided tag IDs are valid, as they are already associated with the post
  // If false, it indicates there are unknown and potentially invalid tag IDs in the 'tags' array
  return [...tagsSet].every(tagID => postTagsSet.has(tagID));
}


module.exports = { findDocumentByID, areTagIDsSubset };
