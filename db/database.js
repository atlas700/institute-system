import mongoose from "mongoose"

function configDB() {
  try {
    mongoose.connect(process.env.DB_PORT_PRODUCTION)
  } catch (error) {
    console.log(error)
  }
}

export default configDB
