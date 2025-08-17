require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function deleteAllAdmins() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({ role: 'admin' });
  console.log('All admin users deleted');
  process.exit(0);
}

deleteAllAdmins().catch(err => { console.error(err); process.exit(1); });
