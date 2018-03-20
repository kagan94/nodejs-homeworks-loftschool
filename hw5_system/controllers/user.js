const sequelize = require('../helpers/sequelize');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports.getUsers = async (req, res) => {
  const users = await sequelize.models.user.findAll();
  res.send(users);
};

module.exports.createUser = async (req, res) => {
  const user = await sequelize.models.user.create({
    name: req.body.name,
    password: req.body.password
  });

  // TODO: genereate payload for new user
  // const payload = 'sdasdasdasda1231dcasdas';
  res.send(user);
};

module.exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const user = await sequelize.models.user.find({where: {id: userId}});
  if (!user)
    return res.status(400);

  await user.update({
    name: req.body.name,
    password: req.body.password
  });
  res.send(user);
};

module.exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  const user = await sequelize.models.user.find({where: {id: userId}});
  if (user) {
    await user.destroy();
    return res.status(200);
  }
  res.status(410);
};

module.exports.saveUserImage = async (req, res) => {
  const userId = req.params.id;
  const user = await sequelize.models.user.find({where: {id: userId}});
  if (!user) {
    return res.status(400).send('User not found');
  }

  const avatarsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  if (!fs.existsSync(avatarsDir))
    fs.mkdirSync(avatarsDir);

  const form = new formidable.IncomingForm();
  form.uploadDir = avatarsDir;

  try {
    await form.parse(req, async function (err, fields, files) {
      if (err) throw new Error('Error occurred while saving ' + err.message);

      const fileKey = Object.keys(files)[0];
      const file = fileKey ? files[fileKey] : null;

      if (files.length === 0) throw new Error('File was not supplied');
      if (file.size === 0) throw new Error('File is empty');

      const fileExt = file.name.split('.').pop();
      const newFileName = Date.now() + '.' + fileExt;

      const oldPath = file.path;
      const newPath = path.join(avatarsDir, newFileName);
      fs.renameSync(oldPath, newPath);

      // Remove old avatar
      const oldAvatarPath = path.join(avatarsDir, user.avatar);
      fs.removeSync(oldAvatarPath);

      // Update user avatar path in DB
      await user.update({avatar: newFileName});

      return res.send(newFileName);
    });
  } catch (err) {
    return res.status(400).send('Error occurred while saving ' + err.message);
  }
};

module.exports.updateUserPermission = (req, res) => {
  const tgtUserId = req.params.id;
  const data = req.body;

  // TODO: update user permissions

  res.send('');
};
