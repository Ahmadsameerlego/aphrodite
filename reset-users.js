require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

async function resetUsers() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  // حذف كل الأدمن والكاشير
  await User.deleteMany({ role: { $in: ['admin', 'cashier'] } });


  // إنشاء أدمن (بدون تشفير يدوي، الـ pre-save سيقوم بالتشفير)
  await new User({ name: 'admin', phone: '01000000000', password: '123456', role: 'admin' }).save();

  // إنشاء كاشير (بدون تشفير يدوي)
  await new User({ name: 'cashier1', phone: '01111111111', password: '123456', role: 'cashier' }).save();

  console.log('تم إعادة تعيين الأدمن والكاشير بنجاح');
  process.exit(0);
}

resetUsers().catch(err => { console.error(err); process.exit(1); });
