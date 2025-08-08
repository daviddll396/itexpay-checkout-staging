/**
 * This class defines the API calls to the backend
 *
 */
import { api_endpoints } from "./api";
import axios from "axios";

export function get_payment_details(paymentid: string) {
  // Mock data for development
  const mockData = {
    paymentid: paymentid,
    amount: 5000,
    currency: "NGN",
    publickey: "pk_test_mock_key_123456789",
    paymentmethods: ["card", "account", "qr", "enaira", "phone"],
    source: {
      customer: {
        email: "customer@example.com",
        name: "John Doe",
        phone: "+2348012345678",
      },
    },
    custom: [
      {
        name: "sidebar_color",
        value: "#041926",
      },
      {
        name: "button_color",
        value: "#27AE60",
      },
    ],
    redirecturl: "https://example.com/success",
    tradingname: "Demo Store",
    merchant_logo: null,
  };

  return new Promise((resolve) => {
    // Simulate API delay - reduced for faster testing
    setTimeout(() => {
      resolve({ data: mockData });
    }, 50);
  });
}

export function fetch_merchant_limit(
  key: string,
  paymentid: string,
  payment_method: string,
  amount: any,
  currency: string,
  country: string
) {
  var url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).fetch_merchant_limit;
  axios
    .post(url + "?publickey=" + key, {
      transaction: {
        paymentmethod: payment_method,
      },
      order: {
        amount: amount,
        currency: currency,
        country: country,
      },
    })
    .then(
      (response) => {
        console.log(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
}

export function fetch_merchant_setup(key: string, paymentid: string) {
  var url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).fetch_merchant_setup;
  axios.get(url + "?publickey=" + key).then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );
}

export function fetch_merchant_fee(
  paymentid: any,
  key: string,
  payment_method: any,
  amount: any,
  currency: any,
  country: any
) {
  // MOCK DATA FOR TESTING - COMMENT OUT WHEN DONE
  console.log("🔧 MOCK: fetch_merchant_fee called with:", {
    payment_method,
    amount,
    currency,
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFeeData = {
        fee: {
          amount: Math.round(amount * 0.015), // 1.5% fee
          currency: currency,
          type: "percentage",
        },
        total: {
          amount: amount + Math.round(amount * 0.015),
          currency: currency,
        },
      };
      console.log("🔧 MOCK: Returning merchant fee:", mockFeeData);
      resolve(mockFeeData);
    }, 300);
  });

  // ORIGINAL CODE - UNCOMMENT WHEN DONE TESTING
  /*
  var url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).fetch_merchant_fee;
  return new Promise((resolve, reject) => {
    axios
      .post(
        url + "?publickey=" + key,
        {
          transaction: {
            paymentmethod: payment_method,
          },
          order: {
            amount: amount,
            currency: currency,
            country: country,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          reject(error);
        }
      );
  });
  */
}

export function create_or_update_event(
  paymentid: any,
  key: string,
  modalreference: any,
  paymentlinkreference: any,
  actor: any,
  evttype: any,
  activity: any
) {
  var url =
    api_endpoints(paymentid).base_url + api_endpoints(paymentid).create_event;
  axios
    .post(url + "?publickey=" + key, {
      source: {
        event: {
          modalreference: modalreference,
          paymentlinkreference: paymentlinkreference,
          context: "web",
          eventtype: evttype,
          actor: actor,
          activity: activity,
          //token: token,
        },
      },
    })
    .then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
}

export async function get_transaction_status(key: string, paymentid: string) {
  // MOCK DATA FOR TESTING - COMMENT OUT WHEN DONE
  console.log("🔧 MOCK: get_transaction_status called with:", {
    key,
    paymentid,
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockStatusResponse = {
        status: "completed",
        message: "Transaction completed successfully",
        reference: "MOCK_STATUS_REF_" + Date.now(),
        transaction_id: "TXN_" + Math.random().toString(36).substr(2, 9),
        amount: 5000,
        currency: "NGN",
        payment_method: "card",
      };
      console.log("🔧 MOCK: Returning transaction status:", mockStatusResponse);
      resolve(mockStatusResponse);
    }, 400);
  });

  // ORIGINAL CODE - UNCOMMENT WHEN DONE TESTING
  /*
  var url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).fetch_transaction_status +
    "?publickey=" +
    key +
    "&paymentid=" +
    paymentid;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  */
}

export async function charge_options({
  paymentid,
  key,
  request,
}: {
  paymentid: string;
  key: string;
  request: any;
}) {
  // MOCK DATA FOR TESTING - COMMENT OUT WHEN DONE
  console.log("🔧 MOCK: charge_options called with:", { paymentid, request });

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockOptionsData = {
        options: {
          banks: [
            { code: "044", name: "Access Bank" },
            { code: "011", name: "First Bank" },
            { code: "058", name: "GT Bank" },
            { code: "032", name: "Union Bank" },
          ],
          cards: [
            { type: "visa", name: "Visa" },
            { type: "mastercard", name: "Mastercard" },
            { type: "verve", name: "Verve" },
          ],
        },
        status: "success",
      };
      console.log("🔧 MOCK: Returning charge options:", mockOptionsData);
      resolve(mockOptionsData);
    }, 400);
  });

  // ORIGINAL CODE - UNCOMMENT WHEN DONE TESTING
  /*
  var url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).charge_options +
    "?publickey=" +
    key;

  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  */
}

export async function callEvent(paymentid: any, request: any, key: any) {
  var url = `${
    api_endpoints(paymentid).base_url
  }/transaction/charge/event?publickey=${key}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function charge(paymentid: string, key: string, request: any) {
  // MOCK DATA FOR TESTING - COMMENT OUT WHEN DONE
  console.log("🔧 MOCK: charge called with:", { paymentid, request });

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockChargeResponse = {
        status: "success",
        message: "Payment initiated successfully",
        reference: "MOCK_REF_" + Date.now(),
        transaction_id: "TXN_" + Math.random().toString(36).substr(2, 9),
        requires_otp: request.paymentmethod === "card",
        requires_3ds: request.paymentmethod === "card",
        redirect_url:
          request.paymentmethod === "card"
            ? "https://3ds.example.com/auth"
            : null,
      };
      console.log("🔧 MOCK: Returning charge response:", mockChargeResponse);
      resolve(mockChargeResponse);
    }, 800);
  });

  // ORIGINAL CODE - UNCOMMENT WHEN DONE TESTING
  /*
  var url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).charge +
    "?publickey=" +
    key;

  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  */
}

export async function validate_otp(paymentid: any, key: string, request: any) {
  // MOCK DATA FOR TESTING - COMMENT OUT WHEN DONE
  console.log("🔧 MOCK: validate_otp called with:", { paymentid, request });

  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock OTP validation - accept any 6-digit code
      const otp = request.otp || request.pin;
      const isValid = /^\d{6}$/.test(otp);

      const mockOtpResponse = {
        status: isValid ? "success" : "failed",
        message: isValid ? "OTP validated successfully" : "Invalid OTP",
        reference: "MOCK_OTP_REF_" + Date.now(),
        transaction_id: "TXN_" + Math.random().toString(36).substr(2, 9),
      };
      console.log("🔧 MOCK: Returning OTP validation:", mockOtpResponse);
      resolve(mockOtpResponse);
    }, 600);
  });

  // ORIGINAL CODE - UNCOMMENT WHEN DONE TESTING
  /*
  var url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).charge_validate +
    "?publickey=" +
    key;
  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  */
}

export function initiate_charge(paymentid: any, key: string, request: any) {
  let url =
    api_endpoints(paymentid).base_url +
    api_endpoints(paymentid).charge +
    "?publickey=" +
    key;
  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
