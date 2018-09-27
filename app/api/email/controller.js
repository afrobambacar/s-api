import Email from './model'

function create (req, res) {
  const { email } = req.body
  const options = {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
    rawResult: true
  }

  Email.findOneAndUpdate({ email }, { email }, options)
    .then(raw => {
      const isNew = raw.lastErrorObject.updatedExisting

      raw.value.set('isNew', !isNew, { strict: false })
      res.jsend.success(raw.value);
    })
    .catch(err => res.jsend.fail(err))
}

export {
  create
}