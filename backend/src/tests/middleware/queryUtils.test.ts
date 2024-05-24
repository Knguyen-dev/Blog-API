import { describe, test, expect } from "@jest/globals";
import { convertQueryParamToArray } from "../../middleware/queryUtils";

describe("convertQueryParamsToArray middleware", () => {  
  test("if param is undefined, return undefined", () => {
    expect(convertQueryParamToArray(undefined)).toBeUndefined();
  })

  test("if param is a string, return that string in an array", () => {
    const myParam = "MyString"
    expect(convertQueryParamToArray(myParam)).toEqual([myParam]);
  })

  test('should return array with JSON string if parameter is an object', () => {
    const param = { key: 'value' };
    const jsonParam = JSON.stringify(param)
    expect(convertQueryParamToArray(param)).toEqual([jsonParam]);
  });  

  test('should return array of strings if parameter is an array of strings', () => {
    expect(convertQueryParamToArray(['test1', 'test2'])).toEqual(['test1', 'test2']);
  });

  test("should return an array of strings if parameter is an array of objects", () => {
    const param = [{ key: 'value' }, { key2: 'value2' }];
    const jsonParam = param.map(p => JSON.stringify(p));
    expect(convertQueryParamToArray(param)).toEqual(jsonParam);
  })
})