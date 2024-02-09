import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useAuthContext() {
	const context = useContext(AuthContext);
	if (!context) {
		throw Error("useAuthContext must be used inside an AuthContextProvider!");
	}
	return context;
}
