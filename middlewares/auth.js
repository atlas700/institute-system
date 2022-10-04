import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"

import User from "../models/usersModel.js"

const auth = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization

  if (token) {
    token = token.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    const user = await User.findById(decoded.id)

    if (user) {
      req.user = user
      next()
    } else {
      res.status(422)
      next(new Error("no user found"))
    }
  } else {
    res.status(422)
    next(new Error("Not Authorized As An User"))
  }
})

export default auth
