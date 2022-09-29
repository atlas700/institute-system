import jwt from "jsonwebtoken"

const genAuthToken = id => {
  return jwt.sign({ id }, "mySecret")
}

export default genAuthToken
