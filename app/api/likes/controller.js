import Like from './model'

function create (req, res) {
  const { uuid } = req.body
  const model = new Like({ uuid })

  model.save()
    .then(data => res.jsend.success(data))
    .catch(err => res.jsend.fail(err))
}

function count (req, res) {
  Like.countDocuments({}, (err, total) => {
    if (err) return res.jsend.fail(err)
    return res.jsend.success({ total })
  })
}

export {
  create,
  count
}