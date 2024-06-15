import { reverse_role_map } from "../config/roles_map"

/**
 * 
 * @param roleNumber - Given a number, return the role associated with it.
 * @returns 
 */
const getRoleString = (roleNumber: number): string | undefined  => {
  return reverse_role_map[roleNumber]
}

export {
  getRoleString
}