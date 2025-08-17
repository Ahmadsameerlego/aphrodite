const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  details: { type: String },
  image: { type: String, default: null }
});

module.exports = mongoose.model('Product', productSchema);
