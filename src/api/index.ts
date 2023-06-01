/**
 * This class defines the API calls to the backend
 *
 */
import { api_endpoints } from "./api";
import axios from "axios";

export function get_payment_details(paymentid: string) {
  const url =
    api_endpoints(paymentid).payment_details_base_url +
    api_endpoints(paymentid).init_payment;
  return new Promise((resolve, reject) => {
    axios
      .get(url + "/" + paymentid, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          reject(error);
        }
      );
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

export async function charge(paymentid: any, key: string, request: any) {
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
}

export async function validate_otp(paymentid: any, key: string, request: any) {
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
