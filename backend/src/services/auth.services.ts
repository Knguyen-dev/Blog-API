import User from "../models/User";
import { createError } from "../middleware/errorUtils";
import { generatePasswordHash } from "../middleware/passwordUtils";
import { roles_map } from "../config/roles_map";

const signupUser = async (email: string, username: string, password: string, fullName: string) => {
  // Check for a user with that exact username or email
  const existingUser = await User.findOne({
    $or: [
      {email: email},
      {username: username}
    ]
  });

  // if existingUser, email was duplicate, username was duplicate, or both were duplicate.
  if (existingUser) {
    if (existingUser.username === username) {
      throw createError(400, "Username already taken! Please choose a different username");
    } else {
      throw createError(400, "Email is already associated with another account! Please use a different email!");
    }
  }

  


  // Defaults; users have role user, and they aren't marked as an employee
  const role = roles_map.user;

  // Generate a password hash
  const hash = await generatePasswordHash(password);

  // Save user into the database
  const user = await User.create({
    email,
    username,
    password: hash,
    fullName,
    role
  });

  // Then return the user
  return user;
}

const authServices = {
  signupUser,
}
export default authServices;