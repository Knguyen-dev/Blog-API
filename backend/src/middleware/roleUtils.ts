import { reverse_role_map } from "../config/roles_map"

const getRoleString = (roleNumber: number) => {
  return reverse_role_map[roleNumber]
}

export {
  getRoleString
}