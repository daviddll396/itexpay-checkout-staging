export const formatAndSetCcNumber = (value: any) => {
  const inputVal = value.replace(/ /g, "");
  let inputNumbersOnly = inputVal.replace(/\D/g, "");

  if (inputNumbersOnly.length > 16) {
    inputNumbersOnly = inputNumbersOnly.substr(0, 16);
  }

  const splits = inputNumbersOnly.match(/.{1,4}/g);

  let spacedNumber = "";
  if (splits) {
    spacedNumber = splits.join(" ");
  }

  return spacedNumber;
};

export const validateCVVNumber = (value: any) => {
  // const regex pattern("^[0-9]{3,4}$");
  const split = value.match(/^[0-9]{3,4}$/);
  if (split )

  return split;
};
