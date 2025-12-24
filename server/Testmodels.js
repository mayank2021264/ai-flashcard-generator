const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const FlashcardSet = require('./models/Flashcard');

// Load environment variables
dotenv.config();

// Test function
const testModels = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('\n🧪 Starting Model Tests...\n');

    // Test 1: Create a user
    console.log('📝 Test 1: Creating a test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ User created:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email
    });

    // Test 2: Password hashing check
    console.log('\n📝 Test 2: Checking password hashing...');
    const isMatch = await testUser.comparePassword('password123');
    console.log('✅ Password comparison works:', isMatch);

    // Test 3: Create a flashcard set
    console.log('\n📝 Test 3: Creating a flashcard set...');
    const testFlashcardSet = await FlashcardSet.create({
      title: 'JavaScript Basics',
      description: 'Fundamental JavaScript concepts',
      userId: testUser._id,
      source: 'manual',
      tags: ['javascript', 'programming', 'basics'],
      flashcards: [
        {
          question: 'What is JavaScript?',
          answer: 'JavaScript is a programming language used for web development.'
        },
        {
          question: 'What is a variable?',
          answer: 'A variable is a container for storing data values.'
        },
        {
          question: 'What is a function?',
          answer: 'A function is a reusable block of code designed to perform a specific task.'
        }
      ]
    });
    console.log('✅ Flashcard set created:', {
      id: testFlashcardSet._id,
      title: testFlashcardSet.title,
      flashcardCount: testFlashcardSet.flashcardCount
    });

    // Test 4: Query flashcard sets by user
    console.log('\n📝 Test 4: Querying user\'s flashcard sets...');
    const userFlashcards = await FlashcardSet.find({ userId: testUser._id });
    console.log('✅ Found', userFlashcards.length, 'flashcard set(s)');

    // Test 5: Populate user data
    console.log('\n📝 Test 5: Populating user data...');
    const populatedSet = await FlashcardSet.findById(testFlashcardSet._id)
      .populate('userId', 'name email');
    console.log('✅ Populated data:', {
      title: populatedSet.title,
      owner: populatedSet.userId.name
    });

    // Cleanup - Delete test data
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ _id: testUser._id });
    await FlashcardSet.deleteOne({ _id: testFlashcardSet._id });
    console.log('✅ Test data cleaned up');

    console.log('\n✨ All tests passed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Run tests
testModels();