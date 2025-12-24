const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a question'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please provide an answer'],
    trim: true
  }
}, {
  _id: true // Each flashcard gets its own ID
});

const flashcardSetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the flashcard set'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  flashcards: [flashcardSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Flashcard set must belong to a user']
  },
  source: {
    type: String,
    enum: ['text', 'pdf', 'manual'],
    default: 'manual'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
flashcardSetSchema.index({ userId: 1, createdAt: -1 });
flashcardSetSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual field for flashcard count
flashcardSetSchema.virtual('flashcardCount').get(function() {
  return this.flashcards.length;
});

// Ensure virtuals are included when converting to JSON
flashcardSetSchema.set('toJSON', { virtuals: true });
flashcardSetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema);