import { RoleKey } from "../types/Auth";
const roleMap: Record<RoleKey, string> = {
  user: import.meta.env.VITE_ROLE_USER,
  editor: import.meta.env.VITE_ROLE_EDITOR,
  admin: import.meta.env.VITE_ROLE_ADMIN,
};

// Remember our environment variables are strings
const reverseRoleMap: { [key: string]: string } = {
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
function getRoleNumber(roleName: RoleKey): string | undefined {
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
 */
function getRoleString(roleNumber: string | number): string | undefined {
  if (typeof roleNumber !== "string") {
    roleNumber = String(roleNumber);
  }
  return reverseRoleMap[roleNumber];
}

/**
 * Returns true if the user is an admin, else false.
 *
 * @param role - Role of a user (numerical representation)
 */
const verifyAdmin = (role: number): boolean => {
  const adminRole = parseInt(import.meta.env.VITE_ROLE_ADMIN);
  return role === adminRole;
};

/**
 * Returns true if the user is an editor, else false.
 *
 * @param role - Role of a user (numerical representation)
 */
const verifyEditor = (role: number): boolean => {
  const editorRole = parseInt(import.meta.env.VITE_ROLE_EDITOR);
  return role === editorRole;
};

const verifyUser = (role: number): boolean => {
  const userRole = parseInt(import.meta.env.VITE_ROLE_USER);
  return role === userRole;
};

export {
  getRoleNumber,
  getRoleString,
  verifyAdmin,
  verifyEditor,
  verifyUser,
  roleMap,
};
