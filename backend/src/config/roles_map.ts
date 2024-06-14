/*

- It's common to use numeric identifiers for roles. Here are some 
  benefits of doing so:

1. scalability: As number of roles grow, numeric representations can
  help managing them and make processing efficient.
2. security: Provides a level of obfuscation or abstraction, making 
  it difficult for unauthorized users to guesss or manipulate role 
  assignments

+ What if you want to change the numerical values of the roles? (migration guide):
1. Create your new role values, using an object with those new values. If you have existing users
  you should probably transfer their roles. For example, user's role user as  '1020' and 
  your new admin role is '1030', use a script to update that stuff in the 
  database.

2. Then update your environment variables on the frontend to match the new role vlaues.


+ Changing role values to strings or adding new roles:
- If you've created a new type of role that isn't an 'admin', 'editor', or 'user', then the big
  part of your work would just be deciding the new permissions that this role has that differentiates
  it from our existing 'admin', 'editor', and 'user' roles.

- Changing role values from numbers to string is a big change. If so do these:
1. Update the 'User' model to ensure the correct default role is being chosen. Update the 'addEmployee' and 'updateEmployee' service functions and controllers 
  since those involve taking role input from api requests. Here you'll want to ensure that you're getting valid 
  roles from external requests so adjust the userValidators.role middleware to ensure you are getting the right roles.
2. Update roleVerification middleware to take strings instead.
3. Finally don't forget to update the environment variables in your front-end when 
  your role values change. This and also update the 'Teams' page on the front-end since 
  since one of the components 'AddEmployeeForm' may need to be adjusted if you changed the data-type 
  for the value of a role. And also ensure that the EmployeeGrid works well with this new role selection, so 
  you'll likely need to check the column definition on that. But other than that you should be good.

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

const reverse_role_map: {[key: number]: string} = {
  5150: "admin",
  1984: "editor",
  2001: "user"
}



export {roles_map, reverse_role_map};