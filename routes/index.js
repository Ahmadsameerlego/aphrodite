const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.loginPage);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// حماية لوحة التحكم للأدمن فقط
router.get('/dashboard', userController.ensureAuthenticated(['admin']), (req, res) => res.render('dashboard', { title: req?.res?.locals?.t?.dashboard || 'لوحة التحكم' }));
// حماية صفحة الكاشير للكاشير فقط
router.get('/cashier', userController.ensureAuthenticated(['cashier']), require('../controllers/saleController').cashierPage);

module.exports = router;
