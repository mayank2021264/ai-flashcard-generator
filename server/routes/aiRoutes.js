const express = require('express');
const router = express.Router();
const { generateFromText, generateFromPDF } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');

// Apply authentication middleware to all routes
router.use(protect);

// Generate flashcards from text
router.post('/generate-from-text', generateFromText);

// Generate flashcards from PDF (with file upload)
router.post('/generate-from-pdf', upload.single('pdf'), generateFromPDF);

module.exports = router;