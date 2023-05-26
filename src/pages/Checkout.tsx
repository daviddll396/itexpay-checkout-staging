import { useState } from "react";
import Sidebar from "../components/sidebar";
import { ReactComponent as Cancel } from "../assets/icons/cancel.svg";
import CloseIcon from "../assets/icons/close.svg";
import SecureFooter from "../components/shared/SecureFooter";
import Logo from "../assets/images/merchantlogo.png";
// import CreditCard from "../assets/icons/credit-card.svg";
import { ReactSVG } from "react-svg";
import { paymentChannels } from "../data";
import CardPayment from "../components/card/CardPayment";
import QRPayment from "src/components/qr";
import USSDPayment from "src/components/ussd";
import BankTransfer from "src/components/transfer";
import ChangePaymentDrawer from "../components/changePaymentDrawer";

// const DesktopCheckout = () => {
//   const [active, setActive] = useState(paymentChannels[0]);

//   return (
//     <div className="my-[8%] p-4">
//       <div className="relative max-w-[705px] h-[580px] max-h-[580px]   mx-auto border border-theme rounded-theme bg-white shadow-custom_shadow p-10 ">
//         <img
//           src={CloseIcon}
//           alt="close"
//           className="w-10 absolute  -left-4 -top-4 z-[10] cursor-pointer"
//         />
//         <Sidebar active={active} setActive={setActive} />

//         <div className=" ml-[30%]  pl-5 ">
//           <div className="text-end mt-3 mb-10">
//             <h2 className="font-extrabold text-3xl text-[#005B27]">
//               NGN 1,000.00
//             </h2>
//             <p className="text-text text-sm">philipkk@gmail.com</p>
//           </div>
//           {active.id === "card" && <CardPayment />}
//           {active.id === "qr" && <QRPayment />}
//           {active.id === "ussd" && <USSDPayment />}
//           {active.id === "transfer" && <BankTransfer />}
//         </div>
//       </div>
//       <div className="mt-6">
//         <SecureFooter />
//       </div>
//     </div>
//   );
// };
// const MobileCheckout = () => {
//   const [active, setActive] = useState(paymentChannels[0]);
//   const [selectState, setSelectState] = useState(false);

//   const handleChangePaymentMethod = () => {
//     setSelectState(true);
//   };
//   const getActive=(channelid:string)=>{
//   let channel = paymentChannels.find(({id})=> id = channelid)
//   return channel
//   }
//   return (
//     <div
//       className={`w-full relative bg-white h-screen   min-h-fit  flex flex-col justify-between `}
//     >
//       {selectState ? (
//         <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-[3]"></div>
//       ) : null}

//       <div>
//         <div className="bg-dark text-white">
//           <div className=" flex items-center justify-between px-5 py-3">
//             <div className="flex items-center ">
//               <img src={Logo} alt="logo" className="w-9 h-9 mr-1" />
//               <h3 className="text-sm font-bold ml-1">Test MyParfait</h3>
//             </div>
//             <div className="flex items-center">
//               <Cancel className="w-5 h-5" />
//               <span className="ml-1 text-xs">Close</span>
//             </div>
//           </div>
//         </div>
//         {!selectState ? (
//           <div className="border-y border-y-theme bg-theme/10 py-3 flex items-center justify-between px-4">
//             <div className="flex items-center ml-3">
//               <ReactSVG
//                 src={active.icon}
//                 className="w-4"
//                 stroke="#001E31"
//               />
//               <span className="text-[#001E31] ml-3">
//                 {active.name}
//               </span>
//             </div>

//             <button
//               onClick={handleChangePaymentMethod}
//               className="p-2 bg-transparent text-theme font-bold text-xs"
//             >
//               Change
//             </button>
//           </div>
//         ) : null}

//         <div className="px-6">
//           <div className="text-end my-8">
//             <h2 className="font-extrabold text-2xl text-[#005B27]">
//               NGN 1,000.00
//             </h2>
//             <p className="text-text text-xs font-medium">philipkk@gmail.com</p>
//           </div>
//           {/* {selectState === true ? (
//             <div>
//               <p className="text-[#555555]/70 mb-4">Make payment with:</p>

//               <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4  text-[#89B4CF] w-full ">
//                 {paymentChannels.map(({ name, icon }, i) => (
//                   <li
//                     key={name}
//                     onClick={() => {
//                       setActive(i);
//                       setSelectState(false);
//                     }}
//                     className={`col-span-1 flex items-center text-xs py-3 pl-6 cursor-pointer font-medium text-[#3d3e42] rounded-theme hover:bg-theme/10 ${
//                       active === i
//                         ? "bg-theme/10 border border-theme  "
//                         : "bg-[#EDEDEDBD]/70 "
//                     }`}
//                   >
//                     <ReactSVG src={icon} className="w-4" stroke="#2837a8" />
//                     <span className="ml-3">{name}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : ( */}
//           {active.id === "card" && <CardPayment />}
//           {active.id === "qr" && <QRPayment />}
//           {active.id === "ussd" && <USSDPayment />}
//           {active.id === "transfer" && <BankTransfer />}
//           {/* )} */}
//           {selectState === true ? (
//             <ChangePaymentDrawer
//               active={active}
//               setActive={setActive}
//               selectState={selectState}
//               setSelectState={setSelectState}
//             />
//           ) : null}
//         </div>
//       </div>
//       <SecureFooter />
//     </div>
//   );
// };
// const MobileCheckout2 = () => {
//   const [active, setActive] = useState(0);
//   const [selectState, setSelectState] = useState(false);

//   const handleChangePaymentMethod = () => {
//     setSelectState(true);
//   };

//   return (
//     <div>
//       <div className="w-full relative bg-white min-h-screen switch:min-h-fit switch:h-full  flex flex-col justify-between   desktop-card">
//         {/* {selectState ? (
//           <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 z-[2]"></div>
//         ) : null} */}
//         <div>
//           <div className="bg-dark text-white switch:rounded-tl-theme switch:rounded-tr-theme">
//             <div className=" flex items-center justify-between gap-3 px-6 py-3">
//               {/* {!selectState ? (
//                 <div onClick={handleChangePaymentMethod}>
//                   <ArrowLeft className="w-9 h-9 p-1 md:hidden" />
//                 </div>
//               ) : (
//                 <div className="h-1 w-1 bg-transparent"></div>
//               )} */}

//               <div className="flex items-center ">
//                 <img src={Logo} alt="logo" className="w-12 h-12 mr-1" />
//                 <h3 className="text-base font-bold ml-2 max-w-[12rem] truncate">
//                   Test MyParfait mdfbavfgvafuyabdfgvafjghbadf
//                 </h3>
//               </div>
//               <div className="flex items-center ">
//                 <Cancel className="w-5 h-5" />
//                 <span className="ml-1 text-xs">Close</span>
//               </div>
//             </div>
//           </div>

//           <div className="border-y border-y-theme bg-theme/10 py-3 flex items-center justify-between px-4">
//             <div className="flex items-center ml-3">
//               {/* <ReactSVG
//                   src={paymentChannels[active].icon}
//                   className="w-4"
//                   stroke="#001E31"
//                 /> */}
//               <img src={CreditCard} alt="card" className="w-6" />
//               <span className="text-[#001E31] text-[15px] font-semibold ml-3">
//                 Pay with {paymentChannels[active].name}
//               </span>
//             </div>

//             <button
//               onClick={handleChangePaymentMethod}
//               className="py-1 px-2 bg-theme text-white font-bold text-xs rounded"
//             >
//               Change
//             </button>

//             {/* <Menu as="div" className="relative inline-block text-left z-[5]">
//                 <Menu.Button>
//                   <button
//                     // onClick={handleChangePaymentMethod}
//                     className="py-1 px-2 bg-theme text-white font-bold text-xs rounded"
//                   >
//                     Change
//                   </button>
//                 </Menu.Button>

//                 <Transition
//                   enter="transition duration-100 ease-out"
//                   enterFrom="transform scale-95 opacity-0"
//                   enterTo="transform scale-100 opacity-100"
//                   leave="transition duration-75 ease-out"
//                   leaveFrom="transform scale-100 opacity-100"
//                   leaveTo="transform scale-95 opacity-0"
//                 >
//                   <Menu.Items className="absolute z-[1000] right-0  mt-2 w-[320px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow ring-opacity-5 focus:outline-none">
//                     {paymentChannels.map(({ name, icon }, i) => (
//                       <Menu.Item>
//                         <div
//                           onClick={() => setActive(i)}
//                           className="flex items-center text-xs py-3 pl-6 cursor-pointer font-medium text-[#001E31]"
//                         >
//                           <ReactSVG
//                             src={icon}
//                             className="w-4"
//                             stroke="#001E31"
//                           />
//                           <span className="ml-3">{name}</span>
//                         </div>
//                       </Menu.Item>
//                     ))}
//                   </Menu.Items>
//                 </Transition>
//               </Menu> */}
//           </div>

//           <div className="px-6">
//             <div className="text-end my-8">
//               <h2 className="font-extrabold text-2xl text-text">
//                 NGN 1,000.00
//               </h2>
//               <p className="text-[#555555]/80 text-xs ">philipkk@gmail.com</p>
//             </div>
//             {/* {selectState === true ? (
//               <div>
//                 <p className="text-[#555555]/70 mb-4">Make payment with:</p>

//                 <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4  text-[#89B4CF] w-full ">
//                   {paymentChannels.map(({ name, icon }, i) => (
//                     <li
//                       onClick={() => {
//                         setActive(i);
//                         setSelectState(false);
//                       }}
//                       className={`col-span-1 flex items-center text-xs py-3 pl-6 cursor-pointer font-medium text-[#001E31] rounded-theme ${
//                         active === i
//                           ? "bg-theme/10 border border-theme  "
//                           : "bg-[#EDEDEDBD]/70 "
//                       }`}
//                     >
//                       <ReactSVG src={icon} className="w-4" stroke="#001E31" />
//                       <span className="ml-3">{name}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <CardPayment />
//             )} */}
//             <CardPayment />
//           </div>
//         </div>
//         <div className="switch:hidden">
//           <SecureFooter />
//         </div>

//         {/* change paymentdrawer */}
//         {selectState === true ? (
//           <ChangePaymentDrawer
//             active={active}
//             setActive={setActive}
//             selectState={selectState}
//             setSelectState={setSelectState}
//           />
//         ) : null}
//       </div>
//       <div className="hidden switch:block mt-6">
//         <SecureFooter />
//       </div>
//     </div>
//   );
// };

const Checkout = () => {
  const [active, setActive] = useState(paymentChannels[0]);
  const [selectState, setSelectState] = useState(false);

  const handleChangePaymentMethod = () => {
    setSelectState(true);
  };
  // const getActive=(channelid:string)=>{
  // let channel = paymentChannels.find(({id})=> id = channelid)
  // return channel
  // }
  return (
    <>
      <div className="hidden switch:block">
      <div className="my-[8%] p-4">
      <div className="relative max-w-[705px] h-[580px] max-h-[580px]   mx-auto border border-theme rounded-theme bg-white shadow-custom_shadow p-10 ">
        <img
          src={CloseIcon}
          alt="close"
          className="w-10 absolute  -left-4 -top-4 z-[10] cursor-pointer"
        />
        <Sidebar active={active} setActive={setActive} />

        <div className=" ml-[30%]  pl-5 ">
          <div className="text-end mt-3 mb-10">
            <h2 className="font-extrabold text-3xl text-[#005B27]">
              NGN 1,000.00
            </h2>
            <p className="text-text text-sm">philipkk@gmail.com</p>
          </div>
          {active.id === "card" && <CardPayment />}
          {active.id === "qr" && <QRPayment />}
          {active.id === "ussd" && <USSDPayment />}
          {active.id === "transfer" && <BankTransfer />}
        </div>
      </div>
      <div className="mt-6">
        <SecureFooter />
      </div>
    </div>
      </div>
      <div className="switch:hidden">
      <div
      className={`w-full relative bg-white h-screen   min-h-fit  flex flex-col justify-between `}
    >
      {selectState ? (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-[3]"></div>
      ) : null}

      <div>
        <div className="bg-dark text-white">
          <div className=" flex items-center justify-between px-5 py-3">
            <div className="flex items-center ">
              <img src={Logo} alt="logo" className="w-9 h-9 mr-1" />
              <h3 className="text-sm font-bold ml-1">Test MyParfait</h3>
            </div>
            <div className="flex items-center">
              <Cancel className="w-5 h-5" />
              <span className="ml-1 text-xs">Close</span>
            </div>
          </div>
        </div>
        {!selectState ? (
          <div className="border-y border-y-theme bg-theme/10 py-3 flex items-center justify-between px-4">
            <div className="flex items-center ml-3">
              <ReactSVG
                src={active.icon}
                className="w-4"
                stroke="#001E31"
              />
              <span className="text-[#001E31] ml-3">
                {active.name}
              </span>
            </div>

            <button
              onClick={handleChangePaymentMethod}
              className="p-2 bg-transparent text-theme font-bold text-xs"
            >
              Change
            </button>
          </div>
        ) : null}

        <div className="px-6">
          <div className="text-end my-8">
            <h2 className="font-extrabold text-2xl text-[#005B27]">
              NGN 1,000.00
            </h2>
            <p className="text-text text-xs font-medium">philipkk@gmail.com</p>
          </div>
          {/* {selectState === true ? (
            <div>
              <p className="text-[#555555]/70 mb-4">Make payment with:</p>

              <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4  text-[#89B4CF] w-full ">
                {paymentChannels.map(({ name, icon }, i) => (
                  <li
                    key={name}
                    onClick={() => {
                      setActive(i);
                      setSelectState(false);
                    }}
                    className={`col-span-1 flex items-center text-xs py-3 pl-6 cursor-pointer font-medium text-[#3d3e42] rounded-theme hover:bg-theme/10 ${
                      active === i
                        ? "bg-theme/10 border border-theme  "
                        : "bg-[#EDEDEDBD]/70 "
                    }`}
                  >
                    <ReactSVG src={icon} className="w-4" stroke="#2837a8" />
                    <span className="ml-3">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : ( */}
          {active.id === "card" && <CardPayment />}
          {active.id === "qr" && <QRPayment />}
          {active.id === "ussd" && <USSDPayment />}
          {active.id === "transfer" && <BankTransfer />}
          {/* )} */}
          {selectState === true ? (
            <ChangePaymentDrawer
              active={active}
              setActive={setActive}
              selectState={selectState}
              setSelectState={setSelectState}
            />
          ) : null}
        </div>
      </div>
      <SecureFooter />
    </div>
      </div>
    </>
  );
};

export default Checkout;
