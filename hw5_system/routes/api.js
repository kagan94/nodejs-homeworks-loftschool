const express = require('express');
const router = express.Router();

const ctrlAuth = require('../controllers/auth');
const ctrlUser = require('../controllers/user');
const ctrlNews = require('../controllers/news');
const {isUser} = require('../middlewares');

router.post('/login', ctrlAuth.doLogin);
router.post('/authFromToken', ctrlAuth.authFromToken);

// Apply middleware to remaining routes
router.use('/', [isUser]);

router.get('/getUsers', ctrlUser.getUsers);
router.post('/createUser', ctrlUser.createUser);
router.put('/updateUser/:id', ctrlUser.updateUser);
router.delete('/deleteUser/:id', ctrlUser.deleteUser);
router.post('/saveUserImage/:id', ctrlUser.saveUserImage);
router.post('/updateUserPermission/:id', ctrlUser.updateUserPermission);

router.get('/getNews', ctrlNews.getNews);
router.post('/newNews', ctrlNews.createNews);
router.put('/updateNews/:id', ctrlNews.updateNews);
router.delete('/deleteNews/:id', ctrlNews.deleteNews);

module.exports = router;
