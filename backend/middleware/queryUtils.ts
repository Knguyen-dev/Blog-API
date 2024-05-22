import { ParsedQs } from "qs";


/**
 * Handles converting query parameters into an array of strings or undefined
 * 
 * - The query parameter can come in multiple forms:
 * 1. A string. For example, '?param=value'
 * 2. string[]: An array of strings. For example '?param=value1&param=value2'
 * 3. ParsedQs: Parseq object. It may represent structure ddata with keys and values. So 
 *   it would be '?param[key]=value'.
 * 4. ParsedQs[]: An array of Parseq objects.
 * 5. Undefined
 * 
 * @param {string | string[] | ParsedQs | ParsedQs[] | undefined} param - The query parameter to be converted
 * @returns {string[] | undefined} - The converted string or undefined 
 */
const convertQueryParamToArray = (param: string | string[] | ParsedQs | ParsedQs[] | undefined): string[] | undefined => {

  // If undefined, empty string, etc., return undefined
  if (!param) {
    return undefined;
  }

  // If the query parameter is a singular string, return the string in an array
  if (typeof param === "string") {
    return [param]
  }

  /*
  - If query parameter is an array:
  1. If the item in the array is already a string, return it as is
  2. Else, it could be an object, number, etc. so return a json string
  */
  
  if (Array.isArray(param)) {
    return param.map(item => 
      typeof item === 'string' ? item : JSON.stringify(item)
    );
  }

  // If the parameter is a singular object, convert it to a JSON string and reutrn that into an object
  if (typeof param === 'object') {
    return [JSON.stringify(param)];
  }

  // For other types, return undefined (this should not be reached)
  return undefined;
}


export {
  convertQueryParamToArray,
}