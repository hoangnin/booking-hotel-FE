/**
 * Removes empty fields from an object before sending to API
 * @param {Object} obj - The object to clean
 * @returns {Object} - New object without empty fields
 */
export const removeEmptyFields = (obj) => {
  const filteredObj = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    // Only include properties that are not empty strings, null, or undefined
    if (value !== "" && value !== null && value !== undefined) {
      filteredObj[key] = value;
    }
  });

  return filteredObj;
};
