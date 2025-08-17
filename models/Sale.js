const mongoose = require('mongoose');


const saleSchema = new mongoose.Schema({
  items: [{
    type: { type: String, enum: ['service', 'product'], required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  totalPrice: { type: Number, required: true },
  customerName: { type: String },
  customerNationality: { type: String },
  cashierName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
