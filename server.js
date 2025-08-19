require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');

const app = express();

// ✅ تحقق من قراءة المتغيرات
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined. Check your .env file!");
  process.exit(1);
} else {
  console.log("✅ MONGO_URI loaded:", process.env.MONGO_URI);
}

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session (لازم يكون قبل أي ميدل وير بيستخدم req.session)
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // يوم
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict"
  }
}));
console.log("MONGO_URI from env:", process.env.MONGO_URI);

// لغة الموقع
const languages = {};
['ar', 'en'].forEach(l => {
  const filePath = path.join(__dirname, 'lang', `${l}.json`);
  if (fs.existsSync(filePath)) {
    languages[l] = JSON.parse(fs.readFileSync(filePath));
  }
});

app.use((req, res, next) => {
  let lang = req.session.lang || 'ar';
  if (req.query.lang && ['ar', 'en'].includes(req.query.lang)) {
    lang = req.query.lang;
    req.session.lang = lang;
  }
  res.locals.t = languages[lang] || {};
  res.locals.lang = lang;
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

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).render('500', { title: 'خطأ في السيرفر' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
