import asyncHandler from "express-async-handler"

import Teacher from "../models/teachersModel.js"

const addTeacher = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, attendanceTime, teachingField, salary } =
    req.body

  const newTeacher = new Teacher({
    user: req.user._id,
    name,
    email,
    phoneNumber: Number(phoneNumber),
    attendanceTime,
    teachingField,
    salary,
    rolledAt: Date.now(),
  })

  if (newTeacher) {
    await newTeacher.save()
    res.json(newTeacher)
    res.status(201)
  } else {
    res.status(422)
    throw new Error("please add the credentials to add the teacher")
  }
})

const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find()

  if (teachers && teachers.length > 0) {
    res.json(teachers)
  } else {
    res.status(404)
    throw new Error("no teachers found in the database")
  }
})

const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacherId)

  if (teacher) {
    res.json(teacher)
  } else {
    res.status(404)
    throw new Error("no teacher found by the given id")
  }
})

const updateTeacher = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const teacher = await Teacher.findById(req.params.teacherId)

    if (teacher) {
      teacher.name = req.body.name || teacher.name
      teacher.email = req.body.email || teacher.email
      teacher.phoneNumber = req.body.phoneNumber || teacher.phoneNumber
      teacher.salary = req.body.salary || teacher.salary
      teacher.attendanceTime = req.body.attendanceTime || teacher.attendanceTime
      teacher.teachingField = req.body.teachingField || teacher.teachingField

      const updatedTeacher = await teacher.save()

      res.json(updatedTeacher)
    } else {
      res.status(404)
      throw new Error("no teacher found by the given id")
    }
  } else {
    const teacher = await Teacher.findOne({
      _id: req.params.teacherId,
      user: req.user._id,
    })

    if (teacher) {
      teacher.name = req.body.name || teacher.name
      teacher.email = req.body.email || teacher.email
      teacher.phoneNumber = req.body.phoneNumber || teacher.phoneNumber
      teacher.salary = req.body.salary || teacher.salary
      teacher.attendanceTime = req.body.attendanceTime || teacher.attendanceTime
      teacher.teachingField = req.body.teachingField || teacher.teachingField

      const updatedTeacher = await teacher.save()

      res.json(updatedTeacher)
    } else {
      res.status(404)
      throw new Error(
        "You have no permit to update a teacher added by other user"
      )
    }
  }
})

const deleteTeacher = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const teacher = await Teacher.findByIdAndDelete(req.params.teacherId)

    if (teacher) {
      res.json(teacher)
    } else {
      res.status(404)
      throw new Error("no teacher found by the given id")
    }
  } else {
    const teacher = await Teacher.findOneAndDelete({
      _id: req.params.teacherId,
      user: req.user._id,
    })

    if (teacher) {
      res.json(teacher)
    } else {
      res.status(404)
      throw new Error(
        "You have no permit to delete a teacher added by other user"
      )
    }
  }
})

const deleteTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.deleteMany()

  if (teachers) {
    res.json(teachers)
  } else {
    res.status(404)
    throw new Error("no teachers found in the database")
  }
})

const getReports = asyncHandler(async (req, res) => {
  let today = new Date()
  today.setHours(0, 0, 0, 0)
  let first = today.getDate() - today.getDay()
  let last = first + 6
  let firstDay = new Date(today.setDate(first)).toUTCString()
  let lastDay = new Date(today.setDate(last)).toUTCString()
  let firstDayMonth = new Date(today.setDate(1))
  var lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  lastDayMonth.setHours(23, 59, 59, 0)
  today = new Date().setHours(0, 0, 0, 0)

  return res.json(
    await Teacher.find({ created: { $gte: today } }).exec(),
    await Teacher.find({
      created: { $gte: firstDay, $lte: lastDay },
    }).exec(),
    Teacher.find({
      created: { $gte: firstDayMonth, $lte: lastDayMonth },
    }).exec()
  )
})

export {
  addTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  deleteTeachers,
  getReports,
}
