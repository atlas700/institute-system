import mongoose from "mongoose"

function configDB() {
  mongoose.connect("mongodb://127.0.0.1/centerDB", error => {
    if (error) {
      console.log(error)
      return process.exit(1)
    }
    console.log("Database connected successfully")
  })
}

export default configDB
