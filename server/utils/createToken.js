import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  }); // first thing you have to do is provide a payload object or string and then the secret key.

  //   set JWT as an HTTP_only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // if node_env is not the case, change it to development.
    sameSite: "strict",
    maxAge: 30*24*60*60*1000, // 30 days
  });

  return token
};

export default generateToken;
