const express = require('express');
const router = express.Router();

const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const ctrlAuth = require('../controllers/auth');
const ctrlUser = require('../controllers/user');
const ctrlNews = require('../controllers/news');
const {AuthMiddleware} = require('../middlewares');

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

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json({type: 'text/plain'}));

router.post('/login', ctrlAuth.doLogin);
router.post('/authFromToken', ctrlAuth.authFromToken);
router.post('/createUser', ctrlUser.createUser);

// Apply middleware to remaining routes
router.use('/', AuthMiddleware);

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
