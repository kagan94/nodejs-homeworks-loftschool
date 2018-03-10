const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');
const ctrlAdmin = require('../controllers/admin');
const ctrlLogin = require('../controllers/login');
const {isAdmin} = require('./middleware.js');

router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.sendEmail);

router.get('/admin', isAdmin, ctrlAdmin.edit);
router.post('/admin/skills', isAdmin, ctrlAdmin.update);
router.post('/admin/products', isAdmin, ctrlAdmin.storeProduct);

router.get('/login', ctrlLogin.getIndex);
router.post('/login', ctrlLogin.postLogin);
router.get('/logout', ctrlLogin.postLogout);

module.exports = router;
