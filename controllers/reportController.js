const Sale = require('../models/Sale');

exports.reportPage = async (req, res) => {
  let { from, to } = req.query;
  let filter = {};
  if (from && to) {
    filter.date = { $gte: new Date(from), $lte: new Date(to) };
  }
  const sales = await Sale.find(filter);
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  res.render('reports', {
    sales,
    totalSales,
    count: sales.length,
    from,
    to
  });
};
