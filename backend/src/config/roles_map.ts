/*

- It's common to use numeric identifiers for roles. Here are some 
  benefits of doing so:

1. scalability: As number of roles grow, numeric representations can
  help managing them and make processing efficient.
2. security: Provides a level of obfuscation or abstraction, making 
  it difficult for unauthorized users to guesss or manipulate role 
  assignments
*/

interface RolesMap {
  admin: number,
  editor: number,
  user: number,
}

const roles_map: RolesMap = {
  admin: 5150,
  editor: 1984,
  user: 2001,
}

export {roles_map};