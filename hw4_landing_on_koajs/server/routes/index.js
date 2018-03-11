const router = require('koa-router')();
const compose = require('koa-compose');

const ctrlHome = require('../controllers/home');
const ctrlAdmin = require('../controllers/admin');
const ctrlLogin = require('../controllers/login');
const {isAdmin, koaFileBody} = require('../middlewares');

router.get('/', ctrlHome.getHome);
router.post('/', ctrlHome.postSendEmail);

router.get('/admin', isAdmin, ctrlAdmin.getEdit);
router.post('/admin/skills', isAdmin, ctrlAdmin.postUpdateSkills);
router.post('/admin/products', compose([isAdmin, koaFileBody]), ctrlAdmin.postStoreProduct);

router.get('/login', ctrlLogin.getLogin);
router.post('/login', ctrlLogin.postLogin);
router.get('/logout', ctrlLogin.getLogout);

module.exports = router;
