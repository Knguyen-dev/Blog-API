/*
+ EditorLayout: Layout for the Editor Suite


- NOTE: The reason we use a layout despite it only being an 'Outlet' is because
  it allows us protect all routes in '/editor-suite' with one 'ProtectedRoute'
  component. All routes in 'editor-suite' should only be accessible by 
  'editors' and 'admins'.
*/

import { Outlet } from "react-router-dom";
import { EditorProvider } from "../contexts/EditorProvider";

export default function EditorLayout() {
	return (
		<EditorProvider>
			<Outlet />
		</EditorProvider>
	);
}
