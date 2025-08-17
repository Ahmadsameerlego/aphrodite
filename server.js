require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // وقف السيرفر لو الاتصال فشل
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session (يجب أن يكون قبل أي ميدل وير يستخدم req.session)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// لغة الموقع
const fs = require('fs');
app.use((req, res, next) => {
  let lang = req.session.lang || 'ar';
  if (req.query.lang && ['ar','en'].includes(req.query.lang)) {
    lang = req.query.lang;
    req.session.lang = lang;
  }
  try {
    const langFile = fs.readFileSync(path.join(__dirname, 'lang', lang + '.json'));
    res.locals.t = JSON.parse(langFile);
    res.locals.lang = lang;
  } catch {
    res.locals.t = {};
    res.locals.lang = 'ar';
  }
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/userRoutes'));
app.use('/services', require('./routes/serviceRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/sales', require('./routes/saleRoutes'));
app.use('/reports', require('./routes/reportRoutes'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'الصفحة غير موجودة' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
