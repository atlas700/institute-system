import asyncHandler from "express-async-handler"
import dayjs from "dayjs"

import Student from "../models/studentsModel.js"

const addStudent = asyncHandler(async (req, res) => {
  const {
    name,
    fatherName,
    phoneNumber,
    time,
    registrationFees,
    cardFees,
    address,
    gender,
  } = req.body

  const newStudent = new Student({
    user: req.user._id,
    name,
    fatherName,
    phoneNumber,
    gender,
    address,
    time,
    registrationFees: {
      feesAmount: req.body.registrationFees.feesAmount,
      isPaid: req.body.registrationFees.isPaid,
      paidAt: req.body.registrationFees.isPaid ? Date.now() : undefined,
    },
    cardFees: {
      feesAmount: req.body.cardFees.feesAmount,
      isPaid: req.body.cardFees.isPaid,
      paidAt: req.body.cardFees.isPaid ? Date.now() : undefined,
    },
    created: Date.now(),
    isPaid: req.body.isPaid ? req.body.isPaid : undefined,
    paidAt: req.body.isPaid ? Date.now() : undefined,
  })

  if (newStudent) {
    let student = await newStudent.save()

    res.status(201)
    res.json(student)

    // end of the statement 1
  } else {
    res.status(422)
    throw new Error("please provide the credentials to add the student")
  }
})

// sending all students with no search and pagination
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().populate("serieses")

  if (students && students.length > 0) {
    res.json(students)
  } else {
    res.status(404)
    throw new Error("no students found in the database.")
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

const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId).populate(
    "serieses"
  )

  if (student) {
    res.json(student)
  } else {
    res.status(404)
    throw new Error("no student found by the given id")
  }
})

const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId)

  if (student) {
    student.name = req.body.name || student.name
    student.fatherName = req.body.fatherName || student.fatherName
    student.gender = req.body.gender || student.gender
    student.phoneNumber = req.body.phoneNumber || student.phoneNumber
    student.address = req.body.address || student.address
    student.registrationFees =
      req.body.registrationFees || student.registrationFees
    student.cardFees = req.body.cardFees || student.cardFees
    student.isPaid = req.body.isPaid ? true : false
    student.paidAt = student.isPaid ? Date.now() : undefined

    const updatedStudent = await student.save()

    res.json(updatedStudent)
  } else {
    res.status(404)
    throw new Error("no student found by the given id")
  }
})

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.studentId)

  if (student) {
    res.json("Successfully Deleted")
  } else {
    res.status(404)
    throw new Error("no student found by the given id")
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

const getOneDayReports = asyncHandler(async (req, res) => {
  const currentDate = dayjs()
  const currentDay = currentDate.date()
  const currentMonth = currentDate.month() + 1
  const currentYear = currentDate.year()

  const lastDay = currentDay - 1

  const yesterdayDate = dayjs(`${currentYear}, ${currentMonth}, ${lastDay}`)

  const students = await Student.find({
    created: { $gte: yesterdayDate.format(), $lt: currentDate.format() },
  })

  if (students && students.length > 0) {
    res.json({ students, from: "today" })
  } else {
    res.status(404)
    throw new Error("no students where added today, we can't find any")
  }
})

const getOneWeekReports = asyncHandler(async (req, res) => {
  const currentDate = dayjs()

  const startOfCurrentWeek = currentDate.startOf("week")

  const students = await Student.find({
    created: { $gte: startOfCurrentWeek.format(), $lt: currentDate.format() },
  })

  if (students && students.length > 0) {
    res.json({
      students,
      from: startOfCurrentWeek.format(),
      to: currentDate.format(),
    })
  } else {
    res.status(404)
    throw new Error("no students found in that period of time")
  }
})

const getOneMonthReports = asyncHandler(async (req, res) => {
  const currentDate = dayjs()
  const oneMonthLater = currentDate.month() + 1 - 1

  const pastDate = dayjs(`${currentDate.year()}, ${oneMonthLater} ,1 `)

  const startOfCurrentMonth = currentDate.startOf("month")

  const students = await Student.find({
    created: { $gte: pastDate.format(), $lt: startOfCurrentMonth.format() },
  })

  if (students && students.length > 0) {
    res.json({
      students,
      from: pastDate.format(),
      to: startOfCurrentMonth.format(),
    })
  } else {
    res.status(404)
    throw new Error("no students found in that period of time")
  }
})

const getOneYearReports = asyncHandler(async (req, res) => {
  const currentDate = dayjs()
  const oneYearLater = currentDate.year() - 1

  const pastDate = dayjs(`${oneYearLater}, 1 ,1 `)

  const startOfCurrentYear = currentDate.startOf("year")

  const students = await Student.find({
    created: { $gte: pastDate.format(), $lt: startOfCurrentYear.format() },
  })

  if (students && students.length > 0) {
    res.json({
      students,
      from: pastDate.format(),
      to: startOfCurrentYear.format(),
    })
  } else {
    res.status(404)
    throw new Error("no students found in that period of time")
  }
})

export {
  addStudent,
  getAllStudents,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  deleteStudents,
  getOneMonthReports,
  getOneYearReports,
  getOneWeekReports,
  getOneDayReports,
}
