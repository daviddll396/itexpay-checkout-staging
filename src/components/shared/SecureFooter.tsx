import LogoImg from "../../assets/icons/itex-logo.svg";
import LogoWhite from "../../assets/icons/white-logo.svg";
import { ReactComponent as LockIcon } from "../../assets/icons/lock.svg";
import {ReactSVG} from "react-svg";

const SecureFooter = () => {
  return (
    <>
      <div className=" switch:hidden mx-auto  w-fit flex items-center gap-x-2">
        <LockIcon className="w-4 h-4 hidden " />
        <LockIcon className="w-4 h-4 switch:hidden" />
        <p className="text-[#828282] text-sm font-medium">Secured By</p>
        <ReactSVG src={LogoImg} className="w-14" />
      </div>
      <div className="hidden switch:flex mx-auto  w-fit  items-center gap-x-2">
        <LockIcon className="w-4 h-4  text-white" stroke="#FFFFFF" />
        <p className="text-white text-sm font-medium">Secured By</p>
        <img src={LogoWhite} className="w-14 " alt="" />
      </div>
    </>
  );
};

export default SecureFooter;
