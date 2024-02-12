import { createContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState(null);

	console.log("Auth state: ", auth);

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};
AuthProvider.propTypes = {
	children: PropTypes.element,
};

export { AuthContext, AuthProvider };
