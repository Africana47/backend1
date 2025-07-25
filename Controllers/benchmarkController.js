// controllers/benchmarkController.js

const Investment = require('../models/Investment');

// Static benchmark data (annual average returns)
const benchmarks = {
  sp500: {
    name: 'S&P 500',
    annualReturn: 0.08,
  },
  nasdaq: {
    name: 'NASDAQ Composite',
    annualReturn: 0.10,
  },
  msci: {
    name: 'MSCI World Index',
    annualReturn: 0.065,
  },
};

/**
 * @desc    Compare user's investment performance with market benchmarks
 * @route   GET /api/benchmark
 * @access  Private
 */
exports.getBenchmarkComparison = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all investments by the authenticated user
    const investments = await Investment.find({ user: userId });

    if (!investments || investments.length === 0) {
      return res.status(404).json({
        message: 'No investments found to benchmark.',
      });
    }

    // Calculate total invested and total return
    let totalInvested = 0;
    let totalReturns = 0;

    for (const inv of investments) {
      totalInvested += inv.amount || 0;
      totalReturns += inv.returns || 0;
    }

    if (totalInvested === 0) {
      return res.status(400).json({
        message: 'Total investment amount is zero. Cannot calculate ROI.',
      });
    }

    const userROI = totalReturns / totalInvested; // ROI as a decimal (e.g., 0.12 = 12%)

    // Compare user's ROI with each benchmark
    const comparisons = Object.entries(benchmarks).map(([key, benchmark]) => {
      const difference = userROI - benchmark.annualReturn;

      return {
        benchmark: benchmark.name,
        benchmarkAnnualReturn: parseFloat((benchmark.annualReturn * 100).toFixed(2)) + '%',
        userAnnualReturn: parseFloat((userROI * 100).toFixed(2)) + '%',
        performanceDelta: parseFloat((difference * 100).toFixed(2)) + '%',
        beatBenchmark: difference > 0,
      };
    });

    res.status(200).json({
      message: 'Benchmark comparison successful',
      portfolio: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalReturns: parseFloat(totalReturns.toFixed(2)),
        userROI: parseFloat((userROI * 100).toFixed(2)) + '%',
      },
      comparisons,
    });
  } catch (error) {
    console.error('Benchmark comparison failed:', error);
    res.status(500).json({
      message: 'Internal server error while comparing benchmarks.',
    });
  }
};
