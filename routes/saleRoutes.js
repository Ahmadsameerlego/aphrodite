const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Service = require('../models/Service');
const userController = require('../controllers/userController');

// صفحة إضافة عملية بيع جديدة (متاحة للأدمن والكاشير)
router.get('/new', userController.ensureAuthenticated(['admin', 'cashier']), async (req, res) => {
	const products = await Product.find();
	const services = await Service.find();
		res.render('sales/form', { products, services, title: req?.res?.locals?.t?.newSale || 'عملية بيع جديدة' });
});

// حفظ عملية البيع
router.post('/', userController.ensureAuthenticated(['admin', 'cashier']), async (req, res) => {
	const { customerName, customerNationality, items } = req.body;
	let parsedItems = [];
	let totalPrice = 0;
	try {
		parsedItems = JSON.parse(items);
		totalPrice = parsedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	} catch {
		return res.redirect('/sales/new');
	}
	const sale = await Sale.create({
		items: parsedItems,
		totalPrice,
		customerName,
		customerNationality,
		cashierName: req.session.user.name
	});
	res.redirect(`/sales/receipt/${sale._id}`);
});

// صفحة طباعة الفاتورة
router.get('/receipt/:id', userController.ensureAuthenticated(['admin', 'cashier']), async (req, res) => {
	const sale = await Sale.findById(req.params.id);
	if (!sale) return res.redirect('/sales');
		res.render('sales/receipt', { sale, title: req?.res?.locals?.t?.receipt || 'إيصال' });
});

// عرض كل المبيعات (للأدمن فقط)
router.get('/', userController.ensureAuthenticated(['admin']), async (req, res) => {
	const sales = await Sale.find().sort({ createdAt: -1 });
		res.render('sales/list', { sales, title: req?.res?.locals?.t?.sales || 'المبيعات' });
});

module.exports = router;
