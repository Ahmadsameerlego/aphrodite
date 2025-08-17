const User = require('../models/User');
const bcrypt = require('bcryptjs');



exports.loginPage = (req, res) => {
  res.render('login', { title: 'تسجيل الدخول', role: '' });
};

exports.login = async (req, res) => {
  const { role } = req.body;
  if (role === 'admin') {
    const { phone, password } = req.body;
    console.log('ADMIN LOGIN TRY:', { phone, password });
    const user = await User.findOne({ phone, role: 'admin' });
    console.log('ADMIN USER FOUND:', user);
    if (!user) return res.render('login', { error: 'رقم التليفون أو كلمة المرور غير صحيحة', role, title: 'تسجيل الدخول' });
    if (typeof user.password !== 'string') {
      return res.render('login', { error: 'خطأ في كلمة المرور المخزنة، يرجى التواصل مع الدعم', role, title: 'تسجيل الدخول' });
    }
    if (typeof password !== 'string') {
      return res.render('login', { error: 'كلمة المرور المدخلة غير صالحة، يرجى إعادة المحاولة', role, title: 'تسجيل الدخول' });
    }
    const valid = await bcrypt.compare(password, user.password);
    console.log('ADMIN PASSWORD VALID:', valid);
    if (!valid) return res.render('login', { error: 'رقم التليفون أو كلمة المرور غير صحيحة', role, title: 'تسجيل الدخول' });
    req.session.user = { id: user._id, name: user.name, role: user.role };
    return res.redirect('/dashboard');
  } else if (role === 'cashier') {
    const { username, cashierPassword } = req.body;
    console.log('CASHIER LOGIN TRY:', { username, cashierPassword });
    const user = await User.findOne({ name: username, role: 'cashier' });
    console.log('CASHIER USER FOUND:', user);
    if (!user) return res.render('login', { error: 'اسم المستخدم أو كلمة المرور غير صحيحة', role, title: 'تسجيل الدخول' });
    if (typeof user.password !== 'string') {
      return res.render('login', { error: 'خطأ في كلمة المرور المخزنة، يرجى التواصل مع الدعم', role, title: 'تسجيل الدخول' });
    }
    if (typeof cashierPassword !== 'string') {
      return res.render('login', { error: 'كلمة المرور المدخلة غير صالحة، يرجى إعادة المحاولة', role, title: 'تسجيل الدخول' });
    }
    const valid = await bcrypt.compare(cashierPassword, user.password);
    console.log('CASHIER PASSWORD VALID:', valid);
    if (!valid) return res.render('login', { error: 'اسم المستخدم أو كلمة المرور غير صحيحة', role, title: 'تسجيل الدخول' });
    req.session.user = { id: user._id, name: user.name, role: user.role };
    return res.redirect('/cashier');
  } else {
    return res.render('login', { error: 'يجب اختيار نوع المستخدم', title: 'تسجيل الدخول' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

// Middleware للتحقق من تسجيل الدخول والدور
exports.ensureAuthenticated = (roles = []) => {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/');
    if (roles.length && !roles.includes(req.session.user.role)) {
      // إذا كان كاشير وحاول يفتح صفحة أدمن
      if (req.session.user.role === 'cashier') return res.redirect('/cashier');
      // إذا كان أدمن وحاول يفتح صفحة كاشير
      if (req.session.user.role === 'admin') return res.redirect('/dashboard');
      return res.redirect('/');
    }
    res.locals.user = req.session.user;
    next();
  };
};
