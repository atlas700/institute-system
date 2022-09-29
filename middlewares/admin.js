const admin = (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(422)
    next(new Error("Not Authorized As An Admin"))
  }
}

export default admin
