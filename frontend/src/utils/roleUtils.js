const verifyAdmin = (role) => {
	const adminRole = parseInt(import.meta.env.VITE_ROLE_ADMIN);
	return role === adminRole;
};

const verifyEditor = (role) => {
	const editorRole = parseInt(import.meta.env.VITE_ROLE_EDITOR);
	return role === editorRole;
};

export { verifyAdmin, verifyEditor };
