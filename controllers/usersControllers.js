import asyncHandler from "express-async-handler"
import bcrypt from "bcryptjs"

import User from "../models/usersModel.js"
import genAuthToken from "../utils/genAuthToken.js"

const signup = asyncHandler(async (req, res) => {
  const newUser = new User(req.body)

  if (newUser) {
    res.status(201)
    const user = await newUser.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genAuthToken(user._id),
    })
  } else {
    res.status(422)
    throw new Error("please add the credentials to register")
  }
})

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (user) {
    const isUserPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (isUserPasswordMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: genAuthToken(user._id),
      })
    } else {
      res.status(422)
      throw new Error("unable to login, email or password is incorrect ")
    }
  } else {
    res.status(422)
    throw new Error("unable to login, email or password is incorrect ")
  }
})

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()

  if (users) {
    res.json(users)
  } else {
    res.status(404)
    throw new Error("no users found in the database")
  }
})

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("no user found by the given id, please try again")
  }
})

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password")

  res.json(user)
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    const oldPasswordMatch = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    )
    if (oldPasswordMatch) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) user.password = req.body.password

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: genAuthToken(updatedUser._id),
      })
    } else {
      res.status(401)
      throw new Error("old password is incorrect")
    }
  } else {
    res.status(404)
    throw new Error("no student found by the given id")
  }
})

const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)

  if (user) {
    user.isAdmin = req.body.isAdmin || false

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: genAuthToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error("no student found by the given id")
  }
})

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id)

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("no user found by the given id")
  }
})

const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId)

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("no user found by the given id")
  }
})

const deleteAllUsers = asyncHandler(async (req, res) => {
  const users = await User.deleteMany()

  if (users) {
    res.json(users)
  } else {
    res.status(404)
    throw new Error("unable to delete the users, try again")
  }
})

export {
  signup,
  login,
  getUsers,
  getUserById,
  getProfile,
  deleteAllUsers,
  deleteUser,
  updateUser,
  adminDeleteUser,
  adminUpdateUser,
}
