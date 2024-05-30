import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database";
import User from "../models/User";
import mongoose from "mongoose";
import {generatePasswordHash} from "../middleware/passwordUtils";
import {roles_map} from "./roles_map";


const users = [
  { email: "ciri@gmail.com", username: "WitcherCiri", password: "P$ssword_123", fullName: "Ciri" },
  { email: "jill.valentine@gmail.com", username: "ResidentEvilJill", password: "P$ssword_123", fullName: "Jill Valentine" },
  { email: "leon.kennedy@gmail.com", username: "ResidentEvilLeon", password: "P$ssword_123", fullName: "Leon S. Kennedy" },
  { email: "arthas.menethil@gmail.com", username: "WarcraftArthas", password: "P$ssword_123", fullName: "Arthas Menethil" },
  { email: "kerrigan@gmail.com", username: "StarcraftKerrigan", password: "P$ssword_123", fullName: "Sarah Kerrigan" },
  { email: "sam.fisher@gmail.com", username: "SplinterCellSam", password: "P$ssword_123", fullName: "Sam Fisher" },
  { email: "jaina.proudmoore@gmail.com", username: "WarcraftJaina", password: "P$ssword_123", fullName: "Jaina Proudmoore" },
  { email: "yuna@gmail.com", username: "FFX_Yuna", password: "P$ssword_123", fullName: "Yuna" },
  { email: "lightning@gmail.com", username: "FF13_Lightning", password: "P$ssword_123", fullName: "Lightning" },
  { email: "niko.bellic@gmail.com", username: "GTA4Niko", password: "P$ssword_123", fullName: "Niko Bellic" },
  { email: "trevor.philips@gmail.com", username: "GTAVTrevor", password: "P$ssword_123", fullName: "Trevor Philips" },
  { email: "claire.redfield@gmail.com", username: "ResidentEvilClaire", password: "P$ssword_123", fullName: "Claire Redfield" },
  { email: "dovahkiin@gmail.com", username: "SkyrimDovahkiin", password: "P$ssword_123", fullName: "Dovahkiin" },
  { email: "vault.boy@gmail.com", username: "FalloutVaultBoy", password: "P$ssword_123", fullName: "Vault Boy" },
  { email: "shepard@gmail.com", username: "MassEffectShepard", password: "P$ssword_123", fullName: "Commander Shepard" },
  { email: "clementine@gmail.com", username: "WalkingDeadClem", password: "P$ssword_123", fullName: "Clementine" },
  { email: "garrus@gmail.com", username: "MassEffectGarrus", password: "P$ssword_123", fullName: "Garrus Vakarian" },
  { email: "liara@gmail.com", username: "MassEffectLiara", password: "P$ssword_123", fullName: "Liara T'Soni" },
  { email: "miranda@gmail.com", username: "MassEffectMiranda", password: "P$ssword_123", fullName: "Miranda Lawson" },
 
];






const signupUser = async (email: string, username: string, password: string, fullName: string) => {

  // Check if the username is available
  const isAvailable = await User.isUsernameAvailable(username);
  if (!isAvailable) {
    console.log(`Username ${username} not available, skipping`);
    return;
  }

  // Defaults; users have role user, and they aren't marked as an employee
  const role = roles_map.editor;

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

async function main() {
  try {
    await connectDB();
    for (const user of users) {
      const u = await signupUser(user.email, user.username, user.password, user.fullName);
      if (u) {
        console.log("Signed up: ", u.username);
      } 
    }
  } catch (err: any) {
    console.log("Error inserting user: ", err.message);
  }
}
main();