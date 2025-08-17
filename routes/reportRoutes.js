const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const Sale = require('../models/Sale');
const userController = require('../controllers/userController');

router.get('/', reportController.reportPage);

// تقرير المبيعات للأدمن فقط
router.get('/sales', userController.ensureAuthenticated(['admin']), async (req, res) => {
	const now = new Date();
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const [today, week, month, total, last20] = await Promise.all([
		Sale.aggregate([
			{ $match: { createdAt: { $gte: startOfDay } } },
			{ $group: { _id: null, sum: { $sum: "$totalPrice" } } }
		]),
		Sale.aggregate([
			{ $match: { createdAt: { $gte: startOfWeek } } },
			{ $group: { _id: null, sum: { $sum: "$totalPrice" } } }
		]),
		Sale.aggregate([
			{ $match: { createdAt: { $gte: startOfMonth } } },
			{ $group: { _id: null, sum: { $sum: "$totalPrice" } } }
		]),
		Sale.aggregate([
			{ $group: { _id: null, sum: { $sum: "$totalPrice" } } }
		]),
		Sale.find().sort({ createdAt: -1 }).limit(20)
	]);

	res.render('salesReport', {
		title: req?.res?.locals?.t?.salesReport || 'تقرير المبيعات',
		totalToday: today[0]?.sum || 0,
		totalWeek: week[0]?.sum || 0,
		totalMonth: month[0]?.sum || 0,
		totalAll: total[0]?.sum || 0,
		sales: last20,
		filter: {}
	});
});

module.exports = router;
