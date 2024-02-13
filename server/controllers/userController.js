import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log("username: ", username);
  console.log("email: ", email);
  console.log("password: ", password);

  if (!username || !email || !password) {
    throw new Error("PleAse fIll all the inpUt fIelds.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("UsEr alrEady exIsts.");

  //#region Hashed Password:
  const salt = await bcrypt.genSalt(); // default is 10 rounds.
  const hashedPassword = await bcrypt.hash(password, salt);
  /*this hashes the password so it does not get hacked, 
  but what is used to varify that this password matches the one inputed in registration?
  ans: this is done by creating a token in the browser and setting it to the cookies. jwt auth.*/
  //#endregion

  // creating user:
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (err) {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    ); // just compares the user password to existin user password.

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    }
  }
});
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.send("HEllo, you hAve loGged oUt");

  res.cooke("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ messge: "LogGed out successfully." });
});
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // empty obj means give us everything you have.
  res.json(users);
});
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({ _id: user._id, username: user.username, email: user.email });
  }
});
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username; // if the user provide a new username, we change it.
    user.emai = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(); // default is 10 rounds.
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })

  } else {
    res.status(404) {
      throw new Error("UsEr nOt foUnd")
    }
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
