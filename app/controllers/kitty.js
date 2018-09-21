import Kitty from 'models/kitty';

function createKitty (req, res) {
  const { name } = req.body
  const model = new Kitty({ name })

  model.save()
    .then(data => res.jsend.success(data))
    .catch(err => res.jsend.fail(err))
}

function getKitty (req, res) {
  const _id = req.params.id

  Kitty.findById(_id)
    .exec()
    .then(data => res.jsend.success(data))
    .catch(err => res.jsend.fail(err))
}

export default {
  createKitty,
  getKitty,
}
