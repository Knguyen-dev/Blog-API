const verifyAdmin = (role: number): boolean => {
	const adminRole = parseInt(import.meta.env.VITE_ROLE_ADMIN);
	return role === adminRole;
};

const verifyEditor = (role: number): boolean => {
	const editorRole = parseInt(import.meta.env.VITE_ROLE_EDITOR);
	return role === editorRole;
};

export { verifyAdmin, verifyEditor };
