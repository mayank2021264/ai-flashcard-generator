const FlashcardSet = require('../models/Flashcard');

// @desc    Create a new flashcard set
// @route   POST /api/flashcards
// @access  Private
exports.createFlashcardSet = async (req, res) => {
  try {
    const { title, description, flashcards, tags, isPublic } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for the flashcard set'
      });
    }

    if (!flashcards || flashcards.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one flashcard'
      });
    }

    // Create flashcard set with authenticated user ID
    const flashcardSet = await FlashcardSet.create({
      title,
      description: description || '',
      flashcards,
      tags: tags || [],
      isPublic: isPublic || false,
      userId: req.user.id, // From auth middleware
      source: 'manual'
    });

    res.status(201).json({
      success: true,
      message: 'Flashcard set created successfully',
      data: flashcardSet
    });
  } catch (error) {
    console.error('Create flashcard set error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating flashcard set',
      error: error.message
    });
  }
};

// @desc    Get all flashcard sets for logged in user
// @route   GET /api/flashcards
// @access  Private
exports.getAllFlashcardSets = async (req, res) => {
  try {
    const flashcardSets = await FlashcardSet.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets
    });
  } catch (error) {
    console.error('Get flashcard sets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching flashcard sets',
      error: error.message
    });
  }
};

// @desc    Get single flashcard set by ID
// @route   GET /api/flashcards/:id
// @access  Private
exports.getFlashcardSetById = async (req, res) => {
  try {
    const flashcardSet = await FlashcardSet.findById(req.params.id);

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }

    // Check if user owns this flashcard set
    if (flashcardSet.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this flashcard set'
      });
    }

    res.status(200).json({
      success: true,
      data: flashcardSet
    });
  } catch (error) {
    console.error('Get flashcard set error:', error);
    
    // Handle invalid MongoDB ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error fetching flashcard set',
      error: error.message
    });
  }
};

// @desc    Update flashcard set
// @route   PUT /api/flashcards/:id
// @access  Private
exports.updateFlashcardSet = async (req, res) => {
  try {
    let flashcardSet = await FlashcardSet.findById(req.params.id);

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }

    // Check if user owns this flashcard set
    if (flashcardSet.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this flashcard set'
      });
    }

    // Update fields
    const { title, description, flashcards, tags, isPublic } = req.body;

    flashcardSet = await FlashcardSet.findByIdAndUpdate(
      req.params.id,
      {
        title: title || flashcardSet.title,
        description: description !== undefined ? description : flashcardSet.description,
        flashcards: flashcards || flashcardSet.flashcards,
        tags: tags !== undefined ? tags : flashcardSet.tags,
        isPublic: isPublic !== undefined ? isPublic : flashcardSet.isPublic
      },
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    res.status(200).json({
      success: true,
      message: 'Flashcard set updated successfully',
      data: flashcardSet
    });
  } catch (error) {
    console.error('Update flashcard set error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating flashcard set',
      error: error.message
    });
  }
};

// @desc    Delete flashcard set
// @route   DELETE /api/flashcards/:id
// @access  Private
exports.deleteFlashcardSet = async (req, res) => {
  try {
    const flashcardSet = await FlashcardSet.findById(req.params.id);

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }

    // Check if user owns this flashcard set
    if (flashcardSet.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this flashcard set'
      });
    }

    await FlashcardSet.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Flashcard set deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete flashcard set error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting flashcard set',
      error: error.message
    });
  }
};

// @desc    Search flashcard sets
// @route   GET /api/flashcards/search?q=searchterm
// @access  Private
exports.searchFlashcardSets = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search term'
      });
    }

    const flashcardSets = await FlashcardSet.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets
    });
  } catch (error) {
    console.error('Search flashcard sets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching flashcard sets',
      error: error.message
    });
  }
};