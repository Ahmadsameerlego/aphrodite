const Service = require('../models/Service');
const path = require('path');

exports.list = async (req, res) => {
  const services = await Service.find();
  res.render('services/list', { services, title: req?.res?.locals?.t?.services || 'الخدمات' });
};

exports.addPage = (req, res) => {
  res.render('services/add', { title: req?.res?.locals?.t?.addService || 'إضافة خدمة' });
};

exports.add = async (req, res) => {
  const { name, price, details } = req.body;
  let image = req.file ? '/uploads/' + req.file.filename : null;
  await Service.create({ name, price, details, image });
  res.redirect('/services');
};

exports.editPage = async (req, res) => {
  const service = await Service.findById(req.params.id);
  res.render('services/edit', { service, title: req?.res?.locals?.t?.editService || 'تعديل خدمة' });
};

exports.edit = async (req, res) => {
  const { name, price, details } = req.body;
  let update = { name, price, details };
  if (req.file) update.image = '/uploads/' + req.file.filename;
  await Service.findByIdAndUpdate(req.params.id, update);
  res.redirect('/services');
};

exports.delete = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.redirect('/services');
};
