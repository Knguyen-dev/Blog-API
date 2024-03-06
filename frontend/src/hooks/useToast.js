import { useContext } from "react";
import { ToastContext } from "../contexts/ToastProvider";

// Custom hook for using our global toast

export default function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw Error("useToast must be used inside an ToastProvider!");
	}
	return context;
}
