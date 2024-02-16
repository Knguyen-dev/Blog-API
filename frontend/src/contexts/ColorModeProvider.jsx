/*
+ ColorModeProvider: Going to be our 'theme' provider for allowing us 
  to control when our application is using dark or light mode.


+ Credit: https://mui.com/material-ui/customization/dark-mode/#dark-mode-by-default
*/

import { createContext, useState } from "react";
import PropTypes from "prop-types";

const ColorContext = createContext();

export default function ColorModeProvider({ children }) {
	return <ColorContext.Provider>{children}</ColorContext.Provider>;
}

ColorModeProvider.propTypes = {
	children: PropTypes.element,
};
