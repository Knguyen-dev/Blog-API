import { useContext } from "react";
import { NewEditorContext } from "../NewEditorProvider";
export default function useNewEditorContext() {
	const context = useContext(NewEditorContext);
	if (!context) {
		throw Error("NewEditorContext must be used inside an NewEditorContext!");
	}
	return context;
}
