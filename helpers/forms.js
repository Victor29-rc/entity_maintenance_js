const snakeCaseToCamelCase = (str) => {
  let strCamelCase = '';

  for (let i = 0; i < str.length; i++) {
    const value = str[i];

    if (value === '_') strCamelCase += str[i + 1].toUpperCase();
    else if (str[i - 1] !== '_') strCamelCase += value.toLowerCase();
  }

  return strCamelCase;
};

const clearFormFields = (form) => {
  form.querySelectorAll('input[type="text"]').forEach((input) => {
    input.value = '';
  });
};

const serializedForm = (form) => {
  const inputElements = form.querySelectorAll('input[type="text"]');

  let formObj = {};

  inputElements.forEach((element) => {
    formObj[snakeCaseToCamelCase(element.name)] = element.value;
  });

  return formObj;
};
