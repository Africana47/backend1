const Pool = require('../models/Pool');

/* ─────────────  Create a pool  ───────────── */
exports.createPool = async (req, res) => {
  try {
    const { name, description } = req.body;
    const pool = await Pool.create({
      name,
      description,
      createdBy: req.user.id,
      admins: [req.user.id],
      members: [req.user.id]
    });
    res.status(201).json(pool);
  } catch (err) {
    res.status(500).json({ message: 'Error creating pool', error: err.message });
  }
};

/* ─────────────  Join a pool  ───────────── */
exports.joinPool = async (req, res) => {
  try {
    const pool = await Pool.findById(req.params.poolId);
    if (!pool) return res.status(404).json({ message: 'Pool not found' });

    if (pool.members.includes(req.user.id))
      return res.status(400).json({ message: 'Already a member' });

    pool.members.push(req.user.id);
    await pool.save();
    res.json({ message: 'Joined pool', poolId: pool._id });
  } catch (err) {
    res.status(500).json({ message: 'Join failed', error: err.message });
  }
};

/* ─────────────  Contribute funds  ───────────── */
exports.contribute = async (req, res) => {
  try {
    const { amount } = req.body;
    const pool = await Pool.findById(req.params.poolId);
    if (!pool) return res.status(404).json({ message: 'Pool not found' });

    if (!pool.members.includes(req.user.id))
      return res.status(403).json({ message: 'Not a member' });

    pool.contributions.push({ user: req.user.id, amount });
    pool.balance += amount;
    await pool.save();
    res.json({ message: 'Contribution recorded', newBalance: pool.balance });
  } catch (err) {
    res.status(500).json({ message: 'Contribution failed', error: err.message });
  }
};

/* ─────────────  Propose an investment  ───────────── */
exports.proposeInvestment = async (req, res) => {
  try {
    const { title, description, amount } = req.body;
    const pool = await Pool.findById(req.params.poolId);
    if (!pool) return res.status(404).json({ message: 'Pool not found' });

    if (!pool.members.includes(req.user.id))
      return res.status(403).json({ message: 'Not a member' });

    pool.investments.push({
      title,
      description,
      amount,
      proposedBy: req.user.id
    });
    await pool.save();
    res.status(201).json({ message: 'Investment proposed' });
  } catch (err) {
    res.status(500).json({ message: 'Proposal failed', error: err.message });
  }
};

/* ─────────────  Vote on a proposal  ───────────── */
exports.voteInvestment = async (req, res) => {
  try {
    const { vote } = req.body; // 'yes' or 'no'
    const pool = await Pool.findById(req.params.poolId);
    if (!pool) return res.status(404).json({ message: 'Pool not found' });

    const investment = pool.investments.id(req.params.invId);
    if (!investment) return res.status(404).json({ message: 'Proposal not found' });

    // Remove any previous vote
    investment.votesYes.pull(req.user.id);
    investment.votesNo.pull(req.user.id);

    if (vote === 'yes') investment.votesYes.push(req.user.id);
    else investment.votesNo.push(req.user.id);

    await pool.save();
    res.json({ message: 'Vote recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Voting failed', error: err.message });
  }
};

/* ─────────────  Get pool overview  ───────────── */
exports.getPool = async (req, res) => {
  try {
    const pool = await Pool.findById(req.params.poolId)
      .populate('members', 'firstName lastName')
      .populate('contributions.user', 'firstName lastName')
      .populate('investments.proposedBy', 'firstName lastName');
    if (!pool) return res.status(404).json({ message: 'Pool not found' });

    res.json(pool);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pool', error: err.message });
  }
};

/* ─────────────  List pools (user is member)  ───────────── */
exports.listMyPools = async (req, res) => {
  try {
    const pools = await Pool.find({ members: req.user.id });
    res.json(pools);
  } catch (err) {
    res.status(500).json({ message: 'Error listing pools', error: err.message });
  }
};
