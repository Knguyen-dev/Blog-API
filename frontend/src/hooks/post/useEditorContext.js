import { useContext } from "react";
import { EditorContext } from "../../contexts/EditorProvider";
export default function useEditorContext() {
	const context = useContext(EditorContext);
	if (!context) {
		throw Error("EditorContext must be used inside an EditorProvider!");
	}
	return context;
}
