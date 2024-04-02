const mongoose = require("mongoose");
const findDocByID = require("../../middleware/findDocByID");




describe("findDocByID", () => {

  const mockModel = {
    findById: jest.fn()
  }

  const mockDocument = {
    _id: new mongoose.Types.ObjectId(),
  }

  const mockQuery = {
    exec: jest.fn(),
    populate: jest.fn()
  }


  test("should return null if invalid document ID is provided", async() => {
    // call with an invalid document ID
    const doc = await findDocByID(mockModel, "invalidID");
    expect(doc).toBeNull();
  })

  test("should return null if a valid doc ID doesnt link to a real doc in the db", async() => {
    
    // Mock findById to return a mock query object
    jest.spyOn(mockModel, "findById").mockReturnValue(mockQuery);

    // Simulate that executing the query returns no document
    jest.spyOn(mockQuery, "exec").mockReturnValue(null)

    // find document using the mock document id
    const doc = await findDocByID(mockModel, mockDocument._id);

    expect(doc).toBeNull();
  })

  test("should return document if found", async() => {
    // Mock findById to return a mock query object
    jest.spyOn(mockModel, "findById").mockReturnValue(mockQuery);

    // When executing query we return the mock document.
    jest.spyOn(mockQuery, "exec").mockReturnValue(mockDocument);

    const doc = await findDocByID(mockModel, mockDocument._id);

    expect(doc).toEqual(mockDocument);
  })

  test('should populate fields if populateOptions are provided', async () => {
    const populateOptions = ['field1', 'field2'];

    jest.spyOn(mockModel, "findById").mockReturnValue(mockQuery);
    jest.spyOn(mockQuery, "exec").mockReturnValue(mockDocument);

    // mock the query.populate function
    const populateSpy = jest.spyOn(mockQuery, "populate").mockReturnValue(mockQuery);

    const result = await findDocByID(mockModel, mockDocument._id, populateOptions);
    expect(result).toEqual(mockDocument);

    // Ensure populate method is called for each field in populateOptions
    populateOptions.forEach((field, index) => {
      // Assert that the populate method is called with the correct field
      expect(populateSpy.mock.calls[index][0]).toBe(field);
    });

    expect(mockModel.findById).toHaveBeenCalledWith(mockDocument._id);
  });
})