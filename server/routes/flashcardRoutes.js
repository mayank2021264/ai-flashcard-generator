const express = require('express');
const router = express.Router();
const {
  createFlashcardSet,
  getAllFlashcardSets,
  getFlashcardSetById,
  updateFlashcardSet,
  deleteFlashcardSet,
  searchFlashcardSets
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Search route (must come before /:id to avoid conflict)
router.get('/search', searchFlashcardSets);

// Main CRUD routes
router.route('/')
  .get(getAllFlashcardSets)    // GET /api/flashcards
  .post(createFlashcardSet);    // POST /api/flashcards

router.route('/:id')
  .get(getFlashcardSetById)     // GET /api/flashcards/:id
  .put(updateFlashcardSet)      // PUT /api/flashcards/:id
  .delete(deleteFlashcardSet);  // DELETE /api/flashcards/:id

module.exports = router;