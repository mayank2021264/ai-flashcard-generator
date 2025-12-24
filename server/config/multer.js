const multer = require('multer');

// Configure multer for memory storage (store files in memory as buffer)
const storage = multer.memoryStorage();

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only PDF files are allowed!'), false); // Reject file
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

module.exports = upload;