// controllers/portfolioAnalyticsController.js
const Investment = require('../models/Investment');
const Insurance = require('../models/Insurance');
const Retirement = require('../models/RetirementInvestment');

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const investments = await Investment.find({ user: userId });
    const retirement = await Retirement.find({ user: userId });
    const insurance = await Insurance.find({ user: userId });

    let total = 0, byType = {}, roi = 0;
    const breakdown = [];

    investments.forEach(inv => {
      total += inv.amount;
      roi += inv.returns || 0;
      byType[inv.assetType] = (byType[inv.assetType] || 0) + inv.amount;
    });

    for (const type in byType) {
      breakdown.push({ type, percent: (byType[type] / total) * 100 });
    }

    res.json({
      totalInvested: total,
      totalROI: roi,
      breakdown,
      insuranceCount: insurance.length,
      retirementPlans: retirement.length
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Error generating analytics' });
  }
};
