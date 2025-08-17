const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', productController.list);
router.get('/add', productController.addPage);
router.post('/add', upload.single('image'), productController.add);
router.get('/edit/:id', productController.editPage);
router.post('/edit/:id', upload.single('image'), productController.edit);
router.post('/delete/:id', productController.delete);

module.exports = router;
