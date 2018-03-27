const sequelize = require('../helpers/sequelize');
const bCrypt = require('bcryptjs');
// const fs = require('fs');

const encryptPassword = (password) => bCrypt.hashSync(password, 0, null);

module.exports.getUsers = async (req, res) => {
  const users = await sequelize.models.user.findAll();
  res.send(users);
};

module.exports.createUser = async (req, res) => {
  const user = await sequelize.models.user.create({
    firstName: req.body.firstName || '',
    middleName: req.body.middleName || '',
    surName: req.body.surName || '',
    username: req.body.username || '',
    password: encryptPassword(req.body.password),
    img: null,
    permission: req.body.permission,
    access_token: ''
  });

  const accessToken = user.encodeToken();
  await user.update({access_token: accessToken, permissionId: user.id});
  req.session.accessToken = accessToken;

  res.send(user);
};

module.exports.updateUser = async (req, res) => {
  const userData = req.body;
  const user = await sequelize.models.user.findOne({where: {id: req.params.id}});
  if (!user) return res.status(400).send({error: 'User not found'});

  if (userData.oldPassword && userData.password) {
    if (!user.isPasswordValid(userData.oldPassword)) {
      return res.status(400).send({error: 'Old password is wrong'});
    }
    userData.password = encryptPassword(userData.password);
  }
  await user.update(userData);
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
  const user = await sequelize.models.user.find({where: {id: req.params.id}});
  if (!user) {
    // fs.unlinkSync(req.file.path);
    return res.status(400).send('User not found');
  }
  res.send({path: `uploads/avatars/${req.file.filename}`});
};

module.exports.updateUserPermission = async (req, res) => {
  const user = await sequelize.models.user.findOne({where: {id: req.params.id}});
  if (!user) return res.status(400).send({error: 'User not found'});

  const reqPermissions = req.body.permission;
  const newPermissions = user.permission;

  for (const permissionName in reqPermissions) {
    if (!reqPermissions.hasOwnProperty(permissionName)) continue;
    Object.assign(newPermissions[permissionName], reqPermissions[permissionName]);
  }

  await user.update({permission: newPermissions});
  res.send({status: 'ok'});
};
