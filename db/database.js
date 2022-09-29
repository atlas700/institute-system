import mongoose from 'mongoose'

function configDB() {
  try {
    mongoose.connect(process.env.DB_PORT)

    console.log(`Successfully connected to the ${process.env.DB_PORT}`)
  } catch (error) {
    console.log(error)
  }
}

export default configDB
