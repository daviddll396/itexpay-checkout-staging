import QRIcon from "../assets/icons/qr.svg";
import USSDIcon from "../assets/icons/ussd.svg";
import BankTransferIcon from "../assets/icons/transfer.svg";
import Card from "../assets/icons/card.svg";
import ENaira from "../assets/icons/e-naira.svg"

export const paymentChannels = [
  {
    name: "Card",
    id: "card",
    icon: Card,
  },
  // {
  //   name: "USSD",
  //   id: "ussd",
  //   icon: USSDIcon,
  // },
  {
    name: "Bank Transfer",
    id: "account",
    icon: BankTransferIcon,
  },
  {
    name: "QR Code",
    id: "qr",
    icon: QRIcon,
  },
  {
    name: "E-Naira",
    id: "enaira",
    icon: ENaira,
  },
  {
    name: "Pay With Phone",
    id: "phone",
    icon: USSDIcon,
  },
  // {
  //   name: "Mobile Money",
  //   id: "momo",
  //   icon: Card,
  // },
];

export const banksData=[
{
  bankName:"Wema Bank",
  id:'pos'
},
{
  bankName:"Polaris Bank",
  id:'q'
},
{
  bankName:"GT Bank",
  id:'pws'
},
{
  bankName:"UBA",
  id:'pes'
},
{
  bankName:"VFD Microfinance bank",
  id:'prs'
},
{
  bankName:"Firstbank of Nigeria",
  id:'pcs'
},
{
  bankName:"UBA",
  id:'pvs'
},
]
