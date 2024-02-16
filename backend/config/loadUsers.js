// Load users into the database
require("dotenv").config()

const mongoose = require("mongoose")
const User = require("../models/User");
const roles_list = require("./roles_list");

const userList = [
  {
    email: "knguyensky@gmail.com",
    username: "kbizzzyycentral",
    fullName: "Kevin Z. Nguyen",
    password: "P$ssword_123",
    role: roles_list.admin,
  },
  {
    email: "thenoc27@gmail.com",
    username: "grandcreamfraiche",
    fullName: "Frank Fraiche",
    password: "P$ssword_123",
    role: roles_list.editor,
  },
  {
    email: "mario@nintendo.com",
    username: "Mario70",
    fullName: "Mario Mario",
    password: "P$ssword_123",
    role: roles_list.user,
  },
  {
    email: "Jack@burgers.gov",
    username: "JackColm4n",
    fullName: "Jack E. Colman",
    password: "P$ssword_123",
    role: roles_list.user,
  },
]

const loadUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany(); // Delete all users
    
    for (let i = 0; i < userList.length; i++) {
      const email = userList[i].email;
      const username = userList[i].username;
      const fullName = userList[i].fullName;
      const password = userList[i].password;
      const role = userList[i].role
      await User.signup(email, username, password, fullName, role);
    }

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
loadUsers();