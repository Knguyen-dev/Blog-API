import { useContext } from "react";
import { SnackbarContext } from "../contexts/SnackBarProvider";

export default function useSnackbar() {
	const context = useContext(SnackbarContext);
	if (!context) {
		throw Error("useSnackbar must be used inside an SnackBarProvider!");
	}
	return context;
}
