import LogoImg from "../../assets/icons/itex-logo.svg";
import LogoWhite from "../../assets/icons/white-logo.svg";
import LockIcon from "../../assets/icons/lock.svg";
import { ReactSVG } from "react-svg";

const SecureFooter = () => {
  return (
    <>
      <div className="  mx-auto  w-fit flex items-center gap-x-2 text-[#828282] switch:text-white">
        <img src={LockIcon} alt="" className="w-4 h-4 hidden " />
        <img src={LockIcon} alt="" className="w-4 h-4 switch:hidden" />
        <p className="  text-sm font-medium">Secured By</p>
        <ReactSVG src={LogoImg} className="w-14 switch:hidden" />
        <img src={LogoWhite} alt="" className="w-14 hidden switch:inline" />
      </div>
      {/* <div className="hidden switch:flex mx-auto  w-fit  items-center gap-x-2">
        <LockIcon className="w-4 h-4  text-white"  />
        <p className="text-white text-sm font-medium">Secured By</p>
        <img src={LogoWhite} className="w-14 " alt="" />
      </div> */}
    </>
  );
};

export default SecureFooter;
