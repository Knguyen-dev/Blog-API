import User from "../models/User";
import { createError } from "../middleware/errorUtils";
import { generatePasswordHash, verifyPassword } from "../middleware/passwordUtils";
import { generateRefreshToken } from "../middleware/tokenUtils";
import { roles_map } from "../config/roles_map";

/**
 * Attempts to sign up a user given some user information; main function used in the signup controller
 * 
 * NOTE: Information such as email and username are assumed to be lowercased before-hand.
 */
const signupUser = async (email: string, username: string, password: string, fullName: string) => {

  // Attempt to find a user with the given username or email
  const existingUser = await User.findOne({
    $or: [
      {username: username},
      {email: email}
    ]
  });

  // A user exists with the inputted usernmae or email, so the input is invalid
  if (existingUser) {
    if (existingUser.email === email) {
      throw createError(400, "Email is already associated with another account!")
    } else {
      throw createError(400, "Username already taken!");
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
    role,
  });

  // Then return the user
  return user;
}

/**
 * Handles doing database check for the user being logged in. If successful,
 * we should be returned a user, with updated lastLogin attribute, and the 
 * updated refresh token attribute; used in the login controller
 * 
 * @param username - username associated with the user account
 * @param password - plaintext password associated with user
 */
const loginUser = async (username: string, password: string) => {
  
  // Attempt to find user via their username
  const user = await User.findOne({username});

  /*
  - No user was found with that username, however for our error we should 
    show indicate that either the usernaem or password was incorrect. This 
    prevents a malicious user from gleaning any login information.
  */
  if (!user) {
    throw createError(400, "Username or password was incorrect!");
  }

  // Verify if the plain-text password the user entered, matches the 
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw createError(400, "Username or password was incorrect!");
  }

  /*
  - Set the 'lastLogin' to now in UTC time. Stores the date and time 
  in utc. Also update the refresh token
  - Generate a refresh token and associate it with the user
  */
  user.lastLogin = new Date();
  user.refreshToken = generateRefreshToken(user);

  // Save the user, updating their lastLogin and refreshToken
  await user.save();

  // Return user
  return user;
}

const authServices = {
  signupUser,
  loginUser,
}
export default authServices;