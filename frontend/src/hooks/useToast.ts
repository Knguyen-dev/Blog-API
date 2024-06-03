import { useContext } from "react";
import { ToastContext } from "../contexts/ToastProvider";

export default function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw Error("useToast must be used inside a ToastProvider!");
  }
  return context;
}
