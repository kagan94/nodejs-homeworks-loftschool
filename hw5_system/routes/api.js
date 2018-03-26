const express = require('express');
const router = express.Router();

const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const sequelize = require('../helpers/sequelize');
const ctrlAuth = require('../controllers/auth');
const ctrlUser = require('../controllers/user');
const ctrlNews = require('../controllers/news');
const {isAuthenticated} = require('../middlewares');

// configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'uploads', 'avatars'));
  },
  filename: (req, file, cb) => {
    const newFilename = `${req.user.id}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});
const upload = multer({storage});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json({type: 'text/plain'}));

// TODO: Remove this route later
router.use('/', async function (req, res, next) {
  const email = 'test@test.com';
  const user = await sequelize.models.user.findOne({email: email});
  req.user = user;
  next();
});

router.post('/login', ctrlAuth.doLogin);
router.post('/authFromToken', ctrlAuth.authFromToken);
router.post('/createUser', ctrlUser.createUser);

// Apply middleware to remaining routes
// router.use('/', isAuthenticated);
// TODO: Uncomment it

router.get('/getUsers', ctrlUser.getUsers);
router.put('/updateUser/:id', ctrlUser.updateUser);
router.delete('/deleteUser/:id', ctrlUser.deleteUser);
router.put('/updateUserPermission/:id', ctrlUser.updateUserPermission);

const fileFieldName = '1';
router.post('/saveUserImage/:id', upload.single(fileFieldName), ctrlUser.saveUserImage);

router.get('/getNews', ctrlNews.getNews);
router.post('/newNews', ctrlNews.createNews);
router.put('/updateNews/:id', ctrlNews.updateNews);
router.delete('/deleteNews/:id', ctrlNews.deleteNews);

module.exports = router;
