const roleMap = {
	user: import.meta.env.VITE_ROLE_USER,
	editor: import.meta.env.VITE_ROLE_EDITOR,
	admin: import.meta.env.VITE_ROLE_ADMIN,
};

// Remember our environment variables are strings
const reverseRoleMap = {
	[import.meta.env.VITE_ROLE_USER]: "User",
	[import.meta.env.VITE_ROLE_EDITOR]: "Editor",
	[import.meta.env.VITE_ROLE_ADMIN]: "Admin",
};

/**
 * Gets number associated with a role
 *
 * @param {string} roleName - String representation of a role
 * @returns {number} Numerical representation of a role
 */
function getRoleNumber(roleName) {
	roleName = roleName.toLowerCase();

	// Return value associated with role, or undefined if it wasn't in the thing
	return parseInt(roleMap[roleName]);
}

/**
 * Returns the human-readable string representation of a role, when given
 * the numerical representation of the role.
 * @param {number} roleNumber - Numerical representation of a role
 * @returns {string} String representation of a role
 */
function getRoleString(roleNumber) {
	if (typeof roleNumber !== "string") {
		roleNumber = String(roleNumber);
	}

	return reverseRoleMap[roleNumber];
}

export { getRoleNumber, getRoleString };
