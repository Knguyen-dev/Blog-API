module.exports = {
  testEnvironment: 'node',

  // any tracking info, suc has number of times called, is reset between every time
  clearMocks: true, 

  /*
  - Resets all mocks between tests. Includes resetting any custom
    implementations with jest.spyOn
  */
  resetMocks: true,
  restoreMocks: true,

  verbose: true,
  forceExit: true,
}