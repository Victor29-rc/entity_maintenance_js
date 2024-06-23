const VALIDATION_RULES = {
  required: (value) => value.trim().length > 0,
  numeric: (value) => !isNaN(value) && value.trim().length > 0,
  natural_number: (value) => !isNaN(value) && value.trim().length > 0,
};

const VALIDATION_MESSAGES = {
  required: (field) => `The ${field} field is required`,
  numeric: (field) => `The ${field} should be a numeric`,
  natural_number: (field) => `The ${field} should be a natural number`,
};

const validate = (value, fieldName, rules) => {
  errorMessages = [];
  rules = rules.split('|');

  rules.forEach((rule) => {
    if (VALIDATION_RULES.hasOwnProperty(rule)) {
      if (!VALIDATION_RULES[rule].call(null, value)) {
        errorMessages.push(VALIDATION_MESSAGES[rule].call(null, fieldName));
      }
    } else {
      errorMessages.push(`The validation rule ${rule} does not exists`);
    }
  });

  return {
    isValid: errorMessages.length === 0,
    errors: errorMessages,
  };
};
