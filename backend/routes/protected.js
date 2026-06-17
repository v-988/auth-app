const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const UserStore = require('../models/userStore');

const router = express.Router();

// All routes in this file are protected
router.use(authMiddleware);

// ─── GET /api/protected/me ───────────────────────────────────────────────────

router.get('/me', (req, res) => {
  const user = UserStore.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  const { hashedPassword, ...safe } = user;
  res.json({ user: safe });
});

// ─── GET /api/protected/users — search + pagination ─────────────────────────

router.get('/users', (req, res) => {
  const { search = '', page = 1, limit = 5 } = req.query;

  let results = UserStore.all();

  // Search by name or email
  if (search.trim()) {
    const q = search.toLowerCase();
    results = results.filter(
      u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
  const total = results.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const paginated = results.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    users: paginated,
    pagination: { page: pageNum, limit: limitNum, total, totalPages }
  });
});

// ─── File upload ─────────────────────────────────────────────────────────────

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only images (JPEG, PNG, GIF, WEBP) and PDFs are allowed.'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received.' });
  res.json({
    message: 'File uploaded successfully.',
    file: {
      originalName: req.file.originalname,
      savedAs: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

module.exports = router;