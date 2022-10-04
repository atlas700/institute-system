import path from "path"
import express from "express"
import "dotenv/config"

import configDB from "./db/database.js"
import studentsRoutes from "./routes/studentsRoutes.js"
import teachersRoutes from "./routes/teachersRoutes.js"
import usersRoutes from "./routes/usersRoutes.js"

const app = express()

configDB()

const __dirname = path.resolve()

app.use(express.json())

app.use(express.static(path.join("public")))

// for frontend Cross Origin Resources Sharing error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Cross-Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")

  next()
})

app.use("/api/students", studentsRoutes)
app.use("/api/teachers", teachersRoutes)
app.use("/api/users", usersRoutes)

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"))
})

// a route for unregistered routes
// app.use((req, res, next) => {
//   const error = new Error(`Route Not Found - ${req.originalUrl}`)
//   res.status(404)
//   next(error)
// })

// a route for the errors
app.use((err, req, res, next) => {
  const errorCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(errorCode)
  res.json({
    message: err.message,
    stack:
      process.env.NODE_ENVIRONMENT === "production" ? err.stack : undefined,
  })
})

app.listen(process.env.NODE_PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENVIRONMENT} mode on port ${process.env.NODE_PORT}`
  )
)
