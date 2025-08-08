var ItexPayNS = ItexPayNS || {};
ItexPayNS.ItexPay = class {
  constructor({
    first_name: e,
    last_name: t,
    phone_number: r,
    api_key: n,
    email: a,
    amount: i,
    reference: s,
    currency: o,
    onCompleted: h,
    redirecturl: l,
    paymentlinkreference: d,
    onError: m,
    onClose: y,
  }) {
    if (!e) throw "First name is required as an argument for the ItexPay SDK";
    if (!t) throw "Last name is required as an argument for the ItexPay SDK";
    if (!n) throw "API key is required as an argument for the ItexPay SDK";
    if (!a) throw "Email  is required as an argument for the ItexPay SDK";
    if (!i) throw "Amount is required as an argument for the ItexPay SDK";
    if (!s)
      throw "A dynamic refernce is required as an argument for the ItexPay SDK";
    if (!o) throw "Currency is required as an argument for the ItexPay SDK";
    if (!h)
      throw "An onCompleted callback is required as an argument for the ItexPay SDK";
    if (!m)
      throw "An onError callback is required as an argument for the ItexPay SDK";
    if (!y)
      throw "An onClose callback is required as an argument for the ItexPay SDK";
    (this.redirecturl = l),
      (this.onClose = y),
      (this.reference = s),
      (this.first_name = e),
      (this.last_name = t),
      (this.phone_number = r),
      (this.email = a),
      (this.amount = i),
      (this.currency = o),
      (this.onCompleted = h),
      (this.paymentlinkreference = d),
      (this.onError = m),
      (this.API_KEY = n),
      (this.body = document?.getElementsByTagName("body")[0]),
      (this.parentDiv = document?.createElement("div")),
      (this.ItexPayFrame = document?.createElement("iframe")),
      (this.loaderWrapper = document?.createElement("div")),
      (this.head = document.head),
      (this.ItexPayStyle = document?.createElement("style")),
      this.head.appendChild(this.ItexPayStyle),
      (this.ItexPayStyle.innerHTML =
        "@-webkit-keyframes spin {\n            0% { -webkit-transform: rotate(0deg); }\n            100% { -webkit-transform: rotate(360deg); }\n          }\n          @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n          }\n        ");
  }
  close() {
    (this.parentDiv.style.display = "none"), this.onClose();
  }
  init() {
    (this.loaderWrapper.style.cssText =
      "\n    display: 'block';\n    border: 3px solid white;\n            border-radius: 50%;\n            border-top: 3px solid green;\n            width: 44px;\n            height: 44px;\n            -webkit-animation: spin 2s linear infinite; /* Safari */\n            animation: spin 2s linear infinite;\n"),
      (this.ItexPayFrame.style.cssText =
        "\n    display: none;\nborder: none;\nbackground-color: transparent;\n"),
      (this.parentDiv.style.cssText =
        "\ndisplay: flex;\njustify-content: center;\nalign-items: center;\nposition: fixed;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;\nbackground-color: rgba(0,0,0,0.4);\nz-index: 99999999    "),
      this.ItexPayFrame.addEventListener("load", () => {
        (this.ItexPayFrame.style.display = "block"),
          (this.loaderWrapper.style.display = "none"),
          (this.ItexPayFrame.style.width = "100vw"),
          (this.ItexPayFrame.style.height = "100vh"),
          (this.ItexPayFrame.allow = "clipboard-write");
      }),
      window.addEventListener("message", (e) => {
        if (
          (e.data.closeModal && this.close(),
          e.data.checkoutMounted &&
            ((this.loaderWrapper.style.display = "none"),
            (this.ItexPayFrame.style.width = "100%"),
            (this.ItexPayFrame.style.height = "100vh")),
          "vbvcomplete" === e.data.name)
        ) {
          const { response: t } = e.data,
            { code: r } = t;
          "00" === r ? this.onCompleted(t) : this.onError(t), this.close();
        }
      }),
      this.body?.appendChild(this.parentDiv),
      this.parentDiv?.appendChild(this.ItexPayFrame),
      this.parentDiv?.appendChild(this.loaderWrapper),
      fetch("https://staging.api.itexpay.com/api/pay/init/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.API_KEY,
        },
        body: JSON.stringify({
          amount: this.amount,
          currency: this.currency,
          customer: {
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            phone_number: this.phone_number,
          },
          redirecturl: this.redirecturl,
          reference: this.reference,
          paymentlinkreference: this.paymentlinkreference,
        }),
      })
        .then((e) => e.json())
        .then((e) => {
          const { status: t, failure_message: r, authorization_url: n } = e;
          if ("failed" === t) return this.onError(r), void this.close();
          this.ItexPayFrame.src = n;
        })
        .catch((e) => {
          (this.loaderWrapper.style.display = "none"),
            (this.parentDiv.style.display = "none"),
            this.onError(e.message),
            this.close();
        });
  }
};
