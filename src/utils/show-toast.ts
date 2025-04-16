import toast, { ToastPosition } from "react-hot-toast";

type BaseToastProps = {
  duration: number;
  position: ToastPosition;
};

type ToastTypeProps = "error" | "warning" | "success" | "promise" | "loading";

const baseConfig: BaseToastProps = {
  duration: 4000,
  position: "top-center",
};

const showToast = (type: ToastTypeProps, message: string) => {
  switch (type) {
    case "success":
      toast.success(message, baseConfig);
      break;
    case "error":
      toast.error(message, baseConfig);
      break;
    case "loading":
      toast.loading(message, baseConfig);
      break;
    default:
      toast(message, baseConfig);
      break;
  }
};

export default showToast;
