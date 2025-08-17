const express = require('express');
const router = express.Router();

const multer = require('multer');
const Service = require('../models/Service');
const userController = require('../controllers/userController');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// عرض جميع الخدمات
router.get('/', userController.ensureAuthenticated(['admin']), async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.render('services/list', { services, title: req?.res?.locals?.t?.services || 'الخدمات' });
});

// فورم إضافة خدمة
router.get('/add', userController.ensureAuthenticated(['admin']), (req, res) => {
  res.render('services/form', { service: {}, action: '/services', method: 'POST', title: 'إضافة خدمة' });
});

// إضافة خدمة جديدة
router.post('/', userController.ensureAuthenticated(['admin']), upload.single('image'), async (req, res) => {
  const { name, price, details } = req.body;
  const service = new Service({
    name,
    price,
    details,
    image: req.file ? req.file.buffer : undefined
  });
  await service.save();
  res.redirect('/services');
});

// فورم تعديل خدمة
router.get('/edit/:id', userController.ensureAuthenticated(['admin']), async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.redirect('/services');
  res.render('services/form', { service, action: `/services/${service._id}?_method=PUT`, method: 'POST', title: 'تعديل خدمة' });
});

// تعديل خدمة
router.put('/:id', userController.ensureAuthenticated(['admin']), upload.single('image'), async (req, res) => {
  const { name, price, details } = req.body;
  const update = { name, price, details };
  if (req.file) update.image = req.file.buffer;
  await Service.findByIdAndUpdate(req.params.id, update);
  res.redirect('/services');
});

// حذف خدمة
router.delete('/:id', userController.ensureAuthenticated(['admin']), async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.redirect('/services');
});

module.exports = router;
