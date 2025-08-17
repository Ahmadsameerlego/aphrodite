const Service = require('../models/Service');
const path = require('path');

exports.list = async (req, res) => {
  const services = await Service.find();
  res.render('services/list', { services });
};

exports.addPage = (req, res) => {
  res.render('services/add');
};

exports.add = async (req, res) => {
  const { name, price, details } = req.body;
  let image = req.file ? '/uploads/' + req.file.filename : null;
  await Service.create({ name, price, details, image });
  res.redirect('/services');
};

exports.editPage = async (req, res) => {
  const service = await Service.findById(req.params.id);
  res.render('services/edit', { service });
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
