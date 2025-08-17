require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const phone = '01000000000';
  const password = '123456';
  const name = 'admin';
  const role = 'admin';

  // حذف أي أدمن قديم بنفس الرقم
  await User.deleteMany({ phone, role });

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, phone, password: hashedPassword, role });
  await user.save();
  console.log('Admin created:', { phone, password });
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
