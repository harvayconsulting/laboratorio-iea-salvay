
import { useToast } from "@/hooks/use-toast";

type ToastType = "success" | "error";

interface ToastStyles {
  success: {
    background: string;
    border: string;
    color?: string;
  };
  error: {
    background: string;
    color: string;
  };
}

const toastStyles: ToastStyles = {
  success: {
    background: "#F2FCE2",
    border: "1px solid #c1e1b9",
  },
  error: {
    background: "#ea384c",
    color: "white",
  },
};

export const useCustomToast = () => {
  const { toast } = useToast();

  const showToast = (
    title: string,
    description: string,
    type: ToastType = "success",
    duration: number = 3000
  ) => {
    toast({
      title,
      description,
      style: toastStyles[type],
      duration,
    });
  };

  return { showToast };
};
