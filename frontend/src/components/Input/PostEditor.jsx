/*
+ PostEditor: A custom TinyMCE editor that's a controlled component. Allows users 
  to enter in text input (some markup patterns supported), and that is turned into HTML.
  
- NOTE:
1. 'Added non-passive event listener to a scroll-blocking 'touchstart' event':
  A performance-related warning that indicates that an event listener is being
  added to the 'touchstart' event and this may block scrolling. In the modern era
  browsers encourages devs to amrk such event listeners as passive to improve scrolling 
  experiences, especially on touch devices. Solution: In this case, we found out that this 
  is happening due to TinyMce. After Googling, it seems the solution was to set UI mode to 'split"."

2. With TinyMCE, mode of the UI is set on initialization only. So if the user changes the 
  theme of the application, they'll need to refresh to apply the theme to the editor. 
  It's unfortunate, but it's just how it is with the current tinymce editor.
*/

import { Editor } from "@tinymce/tinymce-react";
import useColorContext from "../../hooks/useColorContext";
import PropTypes from "prop-types";

export default function PostEditor({ initialValue, value, setValue }) {
	const { preferences } = useColorContext();

	return (
		<Editor
			textareaName="body"
			apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
			initialValue={initialValue}
			value={value}
			onEditorChange={(newValue) => setValue(newValue)}
			init={{
				ui_mode: "split",
				image_caption: true,

				// Allows for indent manipulation via pressing tab key
				setup: function (ed) {
					ed.on("keydown", function (event) {
						if (event.key === "Tab") {
							// tab pressed
							if (event.shiftKey) {
								ed.execCommand("Outdent");
							} else {
								ed.execCommand("Indent");
							}
							event.preventDefault();
							return false;
						}
					});
				},

				/*Only issue is that onchange this component doesn't seem to re-render */
				skin: preferences.darkMode ? "oxide-dark" : "oxide",
				content_css: preferences.darkMode ? "dark" : "light",
				height: 300,

				menubar: "edit insert view format table tools help",
				menu: {
					edit: {
						title: "Edit",
						items:
							"undo redo | cut copy paste pastetext | selectall | searchreplace",
					},
					view: {
						title: "View",
						items:
							"code | visualaid visualblocks | preview fullscreen searchreplace",
					},
					insert: {
						title: "Insert",
						items: "image link media codesample inserttable | charmap hr",
					},
					format: {
						title: "Format",
						items:
							"bold italic underline strikethrough superscript subscript | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat",
					},
					tools: {
						title: "Tools",
						items: "wordcount",
					},
					table: {
						title: "Table",
						items:
							"inserttable | cell row column | advtablesort | tableprops deletetable",
					},
					help: { title: "Help", items: "help" },
				},

				plugins: [
					"advlist",
					"autolink",
					"lists",
					"link",
					"image",
					"media",
					"charmap",
					"preview",
					"anchor",
					"searchreplace",
					"visualblocks",
					"fullscreen",
					"media",
					"table",
					"code",
					"codesample",
					"help",
					"wordcount",
				],

				toolbar:
					"undo redo | formatselect | " +
					"bold italic forecolor | alignleft aligncenter alignright alignjustify | " +
					"bullist numlist outdent indent | " +
					"link unlink | searchreplace | fullscreen | help",
				content_style:
					"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
			}}
		/>
	);
}
PostEditor.propTypes = {
	initialValue: PropTypes.string,
	value: PropTypes.string,
	setValue: PropTypes.func,
};
