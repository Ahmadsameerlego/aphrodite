require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

async function createCashier() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const name = 'cashier1';
  const password = '123456';
  const phone = '01111111111';
  const role = 'cashier';

  // حذف أي كاشير قديم بنفس الاسم
  await User.deleteMany({ name, role });

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, phone, password: hashedPassword, role });
  await user.save();
  console.log('Cashier created:', { username: name, password });
  process.exit(0);
}

createCashier().catch(err => { console.error(err); process.exit(1); });
