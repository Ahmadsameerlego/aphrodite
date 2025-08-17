const Product = require('../models/Product');
const path = require('path');

exports.list = async (req, res) => {
  const products = await Product.find();
  res.render('products/list', { products, title: req?.res?.locals?.t?.products || 'المنتجات' });
};

exports.addPage = (req, res) => {
  res.render('products/add', { title: req?.res?.locals?.t?.addProduct || 'إضافة منتج' });
};

exports.add = async (req, res) => {
  const { name, price, quantity, details } = req.body;
  let image = req.file ? '/uploads/' + req.file.filename : null;
  await Product.create({ name, price, quantity, details, image });
  res.redirect('/products');
};

exports.editPage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('products/edit', { product, title: req?.res?.locals?.t?.editProduct || 'تعديل منتج' });
};

exports.edit = async (req, res) => {
  const { name, price, quantity, details } = req.body;
  let update = { name, price, quantity, details };
  if (req.file) update.image = '/uploads/' + req.file.filename;
  await Product.findByIdAndUpdate(req.params.id, update);
  res.redirect('/products');
};

exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products');
};
