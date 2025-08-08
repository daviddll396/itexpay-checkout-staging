export const api_endpoints = (paymentid: string) => {
  let base_url = `${import.meta.env.VITE_API_ENDPOINT}/v1`;
  let payment_details_base_url = import.meta.env.VITE_API_ENDPOINT;

  const isTest = paymentid?.split("_")[0] === "TEST";
  const isLiveUrl = window.location.href.includes("checkout.itexpay.com");
  const isLocal =
    window.location.href.includes("localhost") ||
    window.location.href.includes("checkout.itexpay.com-staging-env.s3");
  if (isTest && isLiveUrl) {
    base_url = `${import.meta.env.VITE_API_ENDPOINT_TEST}/v1`;
    payment_details_base_url = import.meta.env.VITE_API_ENDPOINT_TEST;
  }
  if (isLocal) {
    base_url = `${import.meta.env.VITE_API_ENDPOINT_LOCAL}/v1`;
    payment_details_base_url = import.meta.env.VITE_API_ENDPOINT_LOCAL;
  }
  return {
    base_url,
    fetch_merchant_limit: "/transaction/limit",
    fetch_merchant_setup: "/transaction/business",
    fetch_merchant_fee: "/transaction/fee",
    fetch_transaction_status: "/transaction/charge/status",
    create_event: "/transaction/charge/event",
    charge: "/transaction/charge",
    charge_validate: "/transaction/charge/validate",
    charge_options: "/transaction/charge/options",
    payment_details_base_url,
    init_payment: "/pay/init",
  };
};
