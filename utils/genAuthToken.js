import jwt from "jsonwebtoken"

const genAuthToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY)
}

export default genAuthToken
