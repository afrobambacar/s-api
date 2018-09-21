import Email from 'models/email'

function create (req, res) {
  const { email } = req.body
  const model = new Email({ email });

  model.save()
    .then(_email => res.jsend.success({ email: _email }))
    .catch(err => res.jsend.fail(err))
}

export default {
  create
}