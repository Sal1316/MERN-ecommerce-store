import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

// authenticate is for checking to see if user has valid credentials.
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next(); // so we can go to other reques or other middleware.
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// authorizedAdmin check to see if isAdmin record is true
const authorizedAdmin = (req, res, next) => {
      if(req.user && req.user.isAdmin) {
            next()
      } else {
            res.status(401).send("Not authorized as an admin")
      }

}

export {authenticate, authorizedAdmin}