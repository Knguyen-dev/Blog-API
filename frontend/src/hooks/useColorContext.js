import { useContext } from "react";
import { ColorContext } from "../contexts/ColorModeProvider";

export default function useColorContext() {
	const context = useContext(ColorContext);
	if (!context) {
		throw Error("useColorContext must be used inside an ColorProvider!");
	}
	return context;
}
