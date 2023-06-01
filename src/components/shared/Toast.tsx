
type ToastProps = {
  type?: "success" | "error";
  msg?: string;
  trigger?:boolean;
};
const Toast = ({ msg, type }: ToastProps) => {
  return (
    <div className="hidden absolute top-0 right-0 w-3/5 px-3 py-4 bg-theme z-[1000]"></div>
  );
};

export default Toast;
