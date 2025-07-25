const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

/* ─────────────────────────  REGISTER  ───────────────────────── */
exports.register = async (req, res) => {
  console.log('📨 Incoming user data:', req.body);
  const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password, // Password will be hashed by pre-save middleware
      phone,
      dateOfBirth,
      isVerified: true // ✅ You’re skipping email verification
    });

    await user.save();
    console.log('✅ User registered:', user.email);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('🔥 Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ───────────────────────────  LOGIN  ────────────────────────── */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('🔑 Login attempt:', email);

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ No user found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Incorrect password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

    console.log('✅ Login successful for user:', email);
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

/* ─────────────────────  EMAIL VERIFICATION PLACEHOLDER ───────────── */
exports.verifyEmail = (req, res) => {
  res.status(410).json({ message: 'Email verification is disabled' });
};
