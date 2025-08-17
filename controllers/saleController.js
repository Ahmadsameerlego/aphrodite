const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Service = require('../models/Service');

exports.cashierPage = async (req, res) => {
  const products = await Product.find();
  const services = await Service.find();
  res.render('cashier', {
    products,
    services,
    title: req?.res?.locals?.t?.cashier || 'الكاشير'
  });
};

exports.createSale = async (req, res) => {
  const { customerName, nationality, products, services, total } = req.body;
  const employee = req.session.user ? req.session.user.name : 'كاشير';
  // products and services are arrays of objects
  await Sale.create({
    customerName,
    nationality,
    products,
    services,
    total,
    employee
  });
  res.redirect('/cashier?success=1');
};
