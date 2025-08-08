import CryptoJS from "crypto-js";
import AesUtil from "src/utils/aesutil";
import forge from "node-forge";

window.forge = forge;

export function generate_reference(type: any, length: any) {
  return generate_references(type, length);
}

export function toBase64String(words: any) {
  return CryptoJS.enc.Base64.stringify(words);
}

export function encrypt_key(key: any, rsaPublicKey: any) {
  return encryptForge(key, rsaPublicKey);
}

export function encrypt_data(data: any, rsaPublicKey: any) {
  let passPhase = "";
  var iv = CryptoJS.lib.WordArray.random(256 / 8).toString(CryptoJS.enc.Hex);
  let util = new AesUtil(256, 1000);
  var salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  let key = toBase64String(util.generateKey(salt, passPhase));
  let encrypted_key = window.btoa(encrypt_key(key, rsaPublicKey));
  var encryptedData = util.encrypt(salt, iv, passPhase, data);

  return { ctx: encrypted_key, data: encryptedData };
}

function encryptForge(data: any, rsaPublicKey: any) {
  let pk = `-----BEGIN PUBLIC KEY-----${rsaPublicKey}-----END PUBLIC KEY-----`;
  let pubKey = window.forge.pki.publicKeyFromPem(pk);
  let encryptText = pubKey.encrypt(
    window.forge.util.encodeUtf8(data),
    "RSA-OAEP",
    {
      md: window.forge.md.sha256.create(),
      mgf1: {
        md: window.forge.md.sha1.create(),
      },
    }
  );
  return encryptText;
}

function split_expiry(expiry: string | null) {
  if (expiry === null || expiry === "") {
    throw new Error("expiry date is missing");
  }
  if (!expiry.includes("/")) {
    throw new Error("invalid expiry date. should be in format MM/YY");
  }
  var s = expiry.split("/");
  var month = s[0];
  var year = s[1];
  try {
    var m_month = parseInt(month);
    if (m_month <= 0 || m_month > 12) {
      throw new Error(
        "Invalid month specified. Month should be between 01 - 12"
      );
    }
  } catch (err) {
    throw new Error("Invalid month specified.");
  }
  if (year.length !== 2) {
    throw new Error("Invalid year. Year must be 2-digit");
  }
  var y_year = parseInt(year);
  var d = new Date();
  var n = d.getFullYear();
  var nn = n + "".substr(0, 2);
  var yy_year = parseInt(nn + y_year);
  if (yy_year <= 0 || yy_year < n) {
    throw new Error("Invalid year specified. year should be greater than " + n);
  }
  return s;
}

export function create_ussd_transaction(
  mref: any,
  callbackurl: any,
  redirecturl: any,
  amt: any,
  currency: any,
  country: any,
  fname: any,
  lname: any,
  email: any,
  phone: any,
  fingerprint: any,
  modalref: any,
  plref: any,
  paymentid: any
) {
  return {
    transaction: {
      modalreference: modalref,
      paymentlinkreference: plref,
      paymentid: paymentid,
      txref: mref,
      callbackurl: callbackurl,
      redirecturl: redirecturl,
      paymentmethod: "ussd",
    },
    order: {
      amount: amt,
      description: "USSD payment",
      currency: currency,
      country: country,
    },
    source: {
      customer: {
        firstname: fname,
        lastname: lname,
        email: email,
        msisdn: phone,
        device: {
          fingerprint: fingerprint,
          ip: "127.0.0.1",
        },
      },
    },
  };
}

export function create_bank_transaction(
  mref: any,
  callbackurl: any,
  redirecturl: any,
  amt: any,
  currency: any,
  country: any,
  fname: any,
  lname: any,
  email: any,
  phone: any,
  bank: string,
  fingerprint: any,
  modalref: any,
  plref: any,
  no: any,
  bvn: any,
  dob: any,
  paymentid: any
) {
  if (bank === "GTBANK" || bank === "FIRST_BANK") {
    return {
      transaction: {
        modalreference: modalref,
        paymentlinkreference: plref,
        paymentid: paymentid,
        txref: mref,
        callbackurl: callbackurl,
        redirecturl: redirecturl,
        paymentmethod: "account",
      },
      order: {
        amount: amt,
        description: "Card payment",
        currency: currency,
        country: country,
      },
      source: {
        customer: {
          firstname: fname,
          lastname: lname,
          email: email,
          msisdn: phone,
          account: {
            bank: bank,
          },
          device: {
            fingerprint: fingerprint,
            ip: "127.0.0.1",
          },
        },
      },
    };
  } else if (bank === "STERLING_BANK") {
    return {
      transaction: {
        modalreference: modalref,
        paymentlinkreference: plref,
        paymentid: paymentid,
        txref: mref,
        callbackurl: callbackurl,
        redirecturl: redirecturl,
        paymentmethod: "account",
      },
      order: {
        amount: amt,
        description: "Account payment",
        currency: currency,
        country: country,
      },
      source: {
        customer: {
          firstname: fname,
          lastname: lname,
          email: email,
          msisdn: phone,
          account: {
            bank: bank,
            number: no,
          },
          device: {
            fingerprint: fingerprint,
            ip: "127.0.0.1",
          },
        },
      },
    };
  } else {
    return {
      transaction: {
        modalreference: modalref,
        paymentlinkreference: plref,
        paymentid: paymentid,
        txref: mref,
        callbackurl: callbackurl,
        redirecturl: redirecturl,
        paymentmethod: "account",
      },
      order: {
        amount: amt,
        description: "Account payment",
        currency: currency,
        country: country,
      },
      source: {
        customer: {
          firstname: fname,
          lastname: lname,
          email: email,
          msisdn: phone,
          bvn: bvn,
          dob: dob,
          account: {
            bank: bank,
            number: no,
          },
          device: {
            fingerprint: fingerprint,
            ip: "127.0.0.1",
          },
        },
      },
    };
  }
}

export function create_card_transaction(
  mref: any,
  callbackurl: any,
  redirecturl: any,
  amt: any,
  currency: any,
  country: any,
  fname: any,
  lname: any,
  email: any,
  phone: any,
  card: {
    expiry: any;
    pin: { one: null; two: null; three: null; four: null };
    pan: any;
    cvv: any;
  },
  fingerprint: any,
  modalref: any,
  plref: any,
  paymentid: any,
  authoption: any
) {
  var exp = split_expiry(card.expiry);
  if (exp === null || exp === undefined) return;
  if (
    card.pin.one != null &&
    card.pin.two != null &&
    card.pin.three != null &&
    card.pin.four != null
  ) {
    return {
      transaction: {
        modalreference: modalref,
        paymentlinkreference: plref,
        paymentid: paymentid,
        txref: mref,
        callbackurl: callbackurl,
        redirecturl: redirecturl,
        authoption: authoption ?? "PIN",
        paymentmethod: "card",
      },
      order: {
        amount: amt,
        description: "Card payment",
        currency: currency,
        country: country,
      },
      source: {
        customer: {
          firstname: fname,
          lastname: lname,
          email: email,
          msisdn: phone,
          card: {
            number: card.pan,
            expirymonth: exp[0],
            expiryyear: exp[1],
            cvv: card.cvv,
            pin: card.pin.one + card.pin.two + card.pin.three + card.pin.four,
          },
          device: {
            fingerprint: fingerprint,
            ip: "127.0.0.1",
          },
        },
      },
    };
  }
  return {
    transaction: {
      modalreference: modalref,
      paymentlinkreference: plref,
      paymentid: paymentid,
      txref: mref,
      callbackurl: callbackurl,
      redirecturl: redirecturl,
      authoption: authoption ?? "3DS",
      paymentmethod: "card",
    },
    order: {
      amount: amt,
      description: "Card payment",
      currency: currency,
      country: country,
    },
    source: {
      customer: {
        firstname: fname,
        lastname: lname,
        email: email,
        msisdn: phone,
        card: {
          number: card.pan,
          expirymonth: exp[0],
          expiryyear: exp[1],
          cvv: card.cvv,
        },
        device: {
          fingerprint: fingerprint,
          ip: "127.0.0.1",
        },
      },
    },
  };
}

export function create_request_option(method: any, opt: any) {
  return {
    transaction: {
      paymentmethod: method,
    },
    source: {
      customer: {
        card: {
          first6: opt,
        },
      },
    },
  };
}

export function create_otp_transaction(otp: any, payment_id: any) {
  return {
    transaction: {
      paymentid: payment_id,
      otp: otp,
    },
  };
}

export function create_bank_transfer_transaction(
  mref: any,
  callbackurl: any,
  amt: any,
  currency: any,
  country: any,
  fname: any,
  lname: any,
  email: any,
  phone: any,
  paymentid: any
) {
  return {
    transaction: {
      merchantreference: mref,
      paymentid: paymentid,
      txref: mref,
      callbackurl: callbackurl,
      authoption: "BANK_TRANSFER",
      paymentmethod: "account",
    },
    order: {
      amount: amt,
      description: "Bank Transfer",
      currency: currency,
      country: country,
    },
    source: {
      customer: {
        firstname: fname,
        lastname: lname,
        email: email,
        msisdn: phone,
        account: {
          type: "TEMPORARY",
        },
      },
    },
  };
}

export function create_qr_transaction(
  mref: any,
  callbackurl: any,
  redirecturl: any,
  amt: any,
  currency: any,
  country: any,
  fname: any,
  lname: any,
  email: any,
  phone: any,
  fingerprint: any,
  modalref: any,
  plref: any,
  paymentid: any
) {
  return {
    transaction: {
      modalreference: modalref,
      paymentlinkreference: plref,
      paymentid: paymentid,
      txref: mref,
      callbackurl: callbackurl,
      redirecturl: redirecturl,
      paymentmethod: "qr",
    },
    order: {
      amount: amt,
      description: "QR Payment",
      currency: currency,
      country: country,
    },
    source: {
      customer: {
        firstname: fname,
        lastname: lname,
        email: email,
        msisdn: phone,
        device: {
          fingerprint: fingerprint,
          ip: "127.0.0.1",
        },
      },
    },
  };
}
export function create_enaira_transaction(
  mref: any,
  callbackurl: any,
  redirecturl: any,
  amt: any,
  currency: any,
  country: any,
  fname: any,
  lname: any,
  email: any,
  phone: any,
  fingerprint: any,
  modalref: any,
  plref: any,
  paymentid: any,
  wallet: any,
  wallettype: any,
  authtype: any,
  authdata: any
) {
  return {
    transaction: {
      modalreference: modalref,
      paymentlinkreference: plref,
      paymentid: paymentid,
      txref: mref,
      callbackurl: callbackurl,
      redirecturl: redirecturl,
      paymentmethod: "enaira",
    },
    order: {
      amount: amt,
      description: "Enaira payment",
      currency: currency,
      country: country,
    },
    source: {
      customer: {
        firstname: fname,
        lastname: lname,
        email: email,
        msisdn: phone,
        device: {
          fingerprint: fingerprint,
          ip: "127.0.0.1",
        },
        enaira: {
          wallettype: wallettype,
          wallet: wallet,
          authtype: authtype,
          authdata: authdata,
        },
      },
    },
  };
}
export function create_payattitude_transaction(
  mref: any,
  callbackurl: any,
  redirecturl: any,
  amt: any,
  currency: any,
  country: any,
  fname: any,
  lname: any,
  email: any,
  phone: any,
  fingerprint: any,
  modalref: any,
  plref: any,
  paymentid: any,
  phonenumber: any
) {
  return {
    transaction: {
      modalreference: modalref,
      paymentlinkreference: plref,
      paymentid: paymentid,
      txref: mref,
      callbackurl: callbackurl,
      redirecturl: redirecturl,
      paymentmethod: "phone",
    },
    order: {
      amount: amt,
      description: `Pay with phone from ${phonenumber}`,
      currency: currency,
      country: country,
    },
    source: {
      customer: {
        firstname: fname,
        lastname: lname,
        email: email,
        msisdn: phone,
        device: {
          fingerprint: fingerprint,
          ip: "127.0.0.1",
        },
        payattitude: {
          phonenumber: phonenumber,
        },
      },
    },
  };
}
function generate_references(prefix: string, length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return prefix + "-" + result;
}
// export function card_type(number: any) {
//   if (!luhnCheck(number)) {
//     return "";
//   }
//   var re = {
//     electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
//     maestro:
//       /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
//     dankort: /^(5019)\d+$/,
//     interpayment: /^(636)\d+$/,
//     unionpay: /^(62|88)\d+$/,
//     visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
//     mastercard: /^5[1-5][0-9]{14}$/,
//     amex: /^3[47][0-9]{13}$/,
//     diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
//     discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
//     jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
//     verve: /^506[0-9]{16}$/,
//   };

//   for (var key in re) {
//     if (re[key].test(number)) {
//       return key;
//     }
//   }
// }

// export function getCardType(cardNum: {
//   match: (arg0: RegExp) => any;
//   indexOf: (arg0: string) => number;
//   substr: (arg0: number, arg1: number) => number;
//   length: number;
// }) {
//   if (!luhnCheck(cardNum)) {
//     return "";
//   }
//   var payCardType = "";
//   var regexMap = [
//     { regEx: /^4[0-9]{5}/gi, cardType: "VISA" },
//     { regEx: /^5[1-5][0-9]{4}/gi, cardType: "MASTERCARD" },
//     { regEx: /^3[47][0-9]{3}/gi, cardType: "AMEX" },
//     { regEx: /^(5[06-8]\d{4}|6\d{5})/gi, cardType: "MAESTRO" },
//   ];

//   for (var j = 0; j < regexMap.length; j++) {
//     if (cardNum.match(regexMap[j].regEx)) {
//       payCardType = regexMap[j].cardType;
//       break;
//     }
//   }

//   if (
//     cardNum.indexOf("50") === 0 ||
//     cardNum.indexOf("60") === 0 ||
//     cardNum.indexOf("65") === 0
//   ) {
//     var g = "508500-508999|606985-607984|608001-608500|652150-653149";
//     var i = g.split("|");
//     for (var d = 0; d < i.length; d++) {
//       var c = parseInt(i[d].split("-")[0], 10);
//       var f = parseInt(i[d].split("-")[1], 10);
//       if (
//         cardNum.substr(0, 6) >= c &&
//         cardNum.substr(0, 6) <= f &&
//         cardNum.length >= 6
//       ) {
//         payCardType = "RUPAY";
//         break;
//       }
//     }
//   }
//   return payCardType;
// }

// function luhnCheck(cardNum: string) {
//   // Luhn Check Code from https://gist.github.com/4075533
//   // accept only digits, dashes or spaces
//   var numericDashRegex = /^[\d\-\s]+$/;
//   if (!numericDashRegex.test(cardNum)) return false;

//   // The Luhn Algorithm. It's so pretty.
//   var nCheck = 0,
//     nDigit = 0,
//     bEven = false;
//   var strippedField = cardNum.replace(/\D/g, "");

//   for (var n = strippedField.length - 1; n >= 0; n--) {
//     var cDigit = strippedField.charAt(n);
//     nDigit = parseInt(cDigit, 10);
//     if (bEven) {
//       if ((nDigit *= 2) > 9) nDigit -= 9;
//     }

//     nCheck += nDigit;
//     bEven = !bEven;
//   }

//   return nCheck % 10 === 0;
// }
