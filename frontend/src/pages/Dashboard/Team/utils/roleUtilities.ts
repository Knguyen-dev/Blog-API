const roleMap: {[key: string]: string} = {
	user: import.meta.env.VITE_ROLE_USER,
	editor: import.meta.env.VITE_ROLE_EDITOR,
	admin: import.meta.env.VITE_ROLE_ADMIN,
};

// Remember our environment variables are strings
const reverseRoleMap: {[key: string]: string} = {
	[import.meta.env.VITE_ROLE_USER]: "User",
	[import.meta.env.VITE_ROLE_EDITOR]: "Editor",
	[import.meta.env.VITE_ROLE_ADMIN]: "Admin",
};

/**
 * Gets number associated with a role
 *
 * @param {string} roleName - String representation of a role
 * @returns {number} Role number; still a string
 *
 * NOTE: It's fine to work with strings for the role number. We're only using this when we
 * want to convert a role string to a number, and then pass it to the backend. Then at that point
 * the backend will sanitize and parse it. But since the function name is 'getRoleNumber' then 
 * we'll parse it back into an integer.
 */
function getRoleNumber(roleName: string): string | undefined {
	roleName = roleName.toLowerCase();

	const roleNumber = roleMap[roleName];

	// Return value associated with role, or undefined if it wasn't in the thing
	return roleNumber;
}

/**
 * Returns the human-readable string representation of a role, when given
 * the numerical representation of the role.
 * @param {string | number} roleNumber - Numerical representation of a role; convert it to a string.
 * @returns {string} String representation of a role
 *
 *
 * NOTE: When we get it from the server
 */
function getRoleString(roleNumber: string | number ) {
	if (typeof roleNumber !== "string") {
		roleNumber = String(roleNumber);
	}
	return reverseRoleMap[roleNumber];
}

export { getRoleNumber, getRoleString };
