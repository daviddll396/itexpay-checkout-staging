export const formatAndSetCcNumber = (value: any) => {
  const inputVal = value.replace(/ /g, "");
  let inputNumbersOnly = inputVal.replace(/\D/g, "");
  if (inputNumbersOnly.length > 18) {
    inputNumbersOnly = inputNumbersOnly.substr(0, 18);
  }
  const splits = inputNumbersOnly.match(/.{1,4}/g);
  let spacedNumber = "";
  if (splits) {
    spacedNumber = splits.join(" ");
  }
  return spacedNumber;
};

export const validateCVVNumber = (val: any) => {
  let value = val.replace(/\D/g, "");
  let regex = /^[0-9]{1,3}$/;
  if (value.length > 3) {
    value = value.substr(0, 3);
  }
  const matched = value.match(regex);
  if (matched) {
    console.log(matched);
    value = matched;
  }
  return value;
};

export const validateExpiryDate = (val: any) => {
  const validDate = `${new Date().getFullYear()}`.substr(2, 5);
  if (val.length < 1) {
    return "";
  }
  const inputVal = val.replace(/\//g, "");
  let value = inputVal.replace(/\D/g, "");
  if (value.length > 4) {
    value = value.substr(0, 4);
  }
  const splits = value.match(/.{1,2}/g);
  let spacedNumber = "";
  if (splits && Number(splits[0]) < 13) {
    if (
      splits &&
      splits[1] &&
      splits[1].match(/[0-9]{2}/) &&
      Number(splits[1]) < Number(validDate)
    ) {
      spacedNumber = `${splits[0]}/`;
    } else {
      spacedNumber = splits.join("/");
    }
  } else {
    // alert("return vallue");
    return "";
  }

  return spacedNumber;
};

export const validateOTP = (val: string) => {
  let inputNumbersOnly = val.replace(/\D/g, "");

  if (inputNumbersOnly.length > 6) {
    inputNumbersOnly = inputNumbersOnly.substr(0, 6);
  }
  return inputNumbersOnly
};

export const validateNumberOnly=(val:string)=>{
  let inputNumbersOnly = val.replace(/\D/g, "");
  return inputNumbersOnly
}