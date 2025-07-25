// const User = require('../models/User');

// // Get all users
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get user by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Update user status (e.g., suspend or activate account)
// exports.updateUserStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const validStatuses = ['active', 'suspended', 'closed'];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     ).select('-password');

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ message: 'User status updated', user });
//   } catch (error) {
//     console.error('Error updating user status:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Promote user to admin
// exports.promoteToAdmin = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { isAdmin: true },
//       { new: true }
//     ).select('-password');

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ message: 'User promoted to admin', user });
//   } catch (error) {
//     console.error('Error promoting user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Delete a user
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ message: 'User deleted' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.getDashboard = (req, res) => {
//   res.json({ message: 'Welcome to the admin dashboard' });
// };

const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');

// Admin dashboard summary
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });

    const totalInvestments = await Investment.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalInvestments,
        totalTransactions,
        totalDeposits: totalDeposits[0]?.total || 0
      },
      message: 'Admin dashboard stats'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (paginated, searchable)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    })
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    });

    res.json({
      users,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user status (e.g., suspend or activate account)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'suspended', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Promote user to admin
exports.promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User promoted to admin', user });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk update user statuses
exports.bulkUpdateUserStatuses = async (req, res) => {
  try {
    const { userIds, status } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Invalid user ID list' });
    }

    const validStatuses = ['active', 'suspended', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await User.updateMany({ _id: { $in: userIds } }, { status });

    res.json({ message: 'User statuses updated' });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


