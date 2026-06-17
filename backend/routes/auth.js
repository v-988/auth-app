const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserStore = require('../models/userStore');

const router = express.Router();

// ─── Helpers ────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function safeUser(user) {
  const { hashedPassword, ...safe } = user;
  return safe;
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
      .matches(/[A-Z]/).withMessage('Password needs at least one uppercase letter.')
      .matches(/[0-9]/).withMessage('Password needs at least one number.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }

    const { name, email, password } = req.body;

    if (UserStore.findByEmail(email)) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = UserStore.create({ name, email, hashedPassword });

    const token = signToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: safeUser(user)
    });
  }
);

// ─── POST /api/auth/login ────────────────────────────────────────────────────

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }

    const { email, password } = req.body;

    const user = UserStore.findByEmail(email);
    if (!user) {
      // Generic message to avoid user-enumeration
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: safeUser(user)
    });
  }
);

module.exports = router;