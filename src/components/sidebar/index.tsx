// import { useState } from "react";
import { paymentChannels } from "../../data";
import Logo from "../../assets/images/merchantlogo.png"
import { ReactSVG } from "react-svg";

const Sidebar = (props: { setActive:React.Dispatch<React.SetStateAction<any>>; active: any; }) => {
 const {active, setActive}=props

  return (
    <div className="absolute left-0 bottom-0 top-0 rounded-tl-theme rounded-bl-theme  bg-dark  w-[30%] flex flex-col   pl-3 py-6 text-white">
      <div className=" flex items-center gap-x-2 mt-5 mb-10 ml-5">
        <img src={Logo} alt="logo" className="w-12"/>
        <h3 className="text-sm font-bold">Test MyParfait</h3>
      </div>

      <div className="pl-3">
        <p className="text-white/60 font-semibold text-sm mb-3 ml-2">
          Make payment with:
        </p>

        <ul className="flex flex-col gap-y-4 pl-2 text-[#89B4CF] w-full ">
          {paymentChannels.map((item) => (
            <li
            key={item.id}
              onClick={() => setActive(item)}
              className={`flex items-center text-xs py-2 pl-6 cursor-pointer ${
               active.id === item.id
                  ? "bg-white/10 border-y border-l border-theme rounded-tl-theme rounded-bl-theme text-theme font-bold"
                  : "font-medium"
              }`}
            >
              <ReactSVG
                src={item.icon}
                className="w-4"
                stroke={active === item.id ? "#27AE60" : ""}
              />
              <span className="ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
