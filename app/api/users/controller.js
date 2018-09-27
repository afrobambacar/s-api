function create (req, res) {
  res.jsend.success({ hello: 'world' })
}

function getUser (req, res) {
  res.jsend.success({ hello: 'world' })
}

export {
  create,
  getUser
}