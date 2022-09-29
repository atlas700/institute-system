import asyncHandler from "express-async-handler"

import Student from "../models/studentsModel.js"

const addStudent = asyncHandler(async (req, res) => {
  const { name, fatherName, studentPhone, fatherPhone, fees, address, gender } =
    req.body

  const newStudent = new Student({
    user: req.user._id,
    name,
    fatherName,
    studentPhone: Number(studentPhone),
    fatherPhone: Number(fatherPhone),
    gender,
    address,
    registeredAt: Date.now(),
    fees: Number(fees),
    isPaid: req.body.isPaid ? req.body.isPaid : undefined,
    paidAt: req.body.isPaid ? Date.now() : undefined,
  })

  if (newStudent) {
    await newStudent.save()
    res.json(newStudent)
    res.status(201)
  } else {
    res.status(422)
    throw new Error("please add the credentials to add the student")
  }
})

const getStudents = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {}

  const count = await Student.countDocuments({
    ...keyword,
  })
  const students = await Student.find({
    ...keyword,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  if (students && students.length > 0) {
    res.json({ students, page, pages: Math.ceil(count / pageSize) })
  } else {
    res.status(404)
    throw new Error("no students found in the database")
  }
})

const getSpecificUserStudents = asyncHandler(async (req, res) => {
  const userId = req.params.userId

  const students = await Student.find({ user: userId })

  if (students) {
    res.json(students)
  } else {
    res.status(404)
    throw new Error("no students found in the database")
  }
})

const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId)

  if (student) {
    res.json(student)
  } else {
    res.status(404)
    throw new Error("no student found by the given id")
  }
})

const updateStudent = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const student = await Student.findById(req.params.studentId)

    if (student) {
      student.name = req.body.name || student.name
      student.fatherName = req.body.fatherName || student.fatherName
      student.gender = req.body.gender || student.gender
      student.studentPhone = req.body.studentPhone || student.studentPhone
      student.fatherPhone = req.body.fatherPhone || student.fatherPhone
      student.address = req.body.address || student.address
      student.fees = Number(req.body.fees) || student.fees
      student.isPaid = req.body.isPaid ? true : false
      student.paidAt = student.isPaid ? Date.now() : undefined

      const updatedStudent = await student.save()

      res.json(updatedStudent)
    } else {
      res.status(404)
      throw new Error("no student found by the given id")
    }
  } else {
    const student = await Student.findOne({
      _id: req.params.studentId,
      user: req.user._id,
    })

    if (student) {
      student.name = req.body.name || student.name
      student.fatherName = req.body.fatherName || student.fatherName
      student.gender = req.body.gender || student.gender
      student.studentPhone = req.body.studentPhone || student.studentPhone
      student.fatherPhone = req.body.fatherPhone || student.fatherPhone
      student.address = req.body.address || student.address
      student.fees = Number(req.body.fees) || student.fees
      student.isPaid = req.body.isPaid ? true : false
      student.paidAt = student.isPaid ? Date.now() : undefined

      const updatedStudent = await student.save()

      res.json(updatedStudent)
    } else {
      res.status(404)
      throw new Error(
        "You have no permit to update a student added by other user"
      )
    }
  }
})

const deleteStudent = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const student = await Student.findByIdAndDelete(req.params.studentId)

    if (student) {
      res.json(student)
    } else {
      res.status(404)
      throw new Error("no student found by the given id")
    }
  } else {
    const student = await Student.findOneAndDelete({
      _id: req.params.studentId,
      user: req.user._id,
    })

    if (student) {
      res.json(student)
    } else {
      res.status(404)
      throw new Error(
        "You have no permit to delete a student added by other user"
      )
    }
  }
})

const deleteStudents = asyncHandler(async (req, res) => {
  const students = await Student.deleteMany()

  if (students) {
    res.json(students)
  } else {
    res.status(404)
    throw new Error("no students found in the database")
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
    await Student.find({ created: { $gte: today } }).exec(),
    await Student.find({
      created: { $gte: firstDay, $lte: lastDay },
    }).exec(),
    Student.find({
      created: { $gte: firstDayMonth, $lte: lastDayMonth },
    }).exec()
  )
})

export {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  deleteStudents,
  getReports,
  getSpecificUserStudents,
}
