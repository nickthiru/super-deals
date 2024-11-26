// backend/src/utils/validateData.js

/**
 * Validate data against the provided schema
 * @param {Object} schema - The schema to validate against
 * @param {Object} data - The data to validate
 * @returns {Object} Validation result
 */
async function validateData(schema, data) {
  try {
    await schema.parseAsync(data);
    return { success: true };
  } catch (error) {
    console.error("Validation Error:", error);
    if (error.errors && error.errors.length > 0) {
      // Return detailed error messages from the schema
      return {
        success: false,
        error: "Validation failed",
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      };
    }
    // Fallback for unexpected error structure
    return { success: false, error: "Invalid data: " + error.message };
  }
}

module.exports = validateData;