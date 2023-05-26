import QRIcon from "../assets/icons/qr.svg";
import USSDIcon from "../assets/icons/ussd.svg";
import BankTransferIcon from "../assets/icons/transfer.svg";
import Card from "../assets/icons/card.svg";

export const paymentChannels = [
  {
    name: "Card",
    id: "card",
    icon: Card,
  },
  {
    name: "USSD",
    id: "ussd",
    icon: USSDIcon,
  },
  {
    name: "Bank Transfer",
    id: "transfer",
    icon: BankTransferIcon,
  },
  {
    name: "QR Code",
    id: "qr",
    icon: QRIcon,
  },
  {
    name: "E-Naira",
    id: "e-naira",
    icon: Card,
  },
  {
    name: "Mobile Money",
    id: "momo",
    icon: Card,
  },
];
