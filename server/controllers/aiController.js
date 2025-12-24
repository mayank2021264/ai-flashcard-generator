const FlashcardSet = require('../models/Flashcard');
const axios = require('axios');

// Helper function to call Google Gemini API
const generateFlashcardsWithGemini = async (content) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;


    const prompt = `You are a helpful assistant that generates educational flashcards. 
    Based on the following content, create exactly 10 flashcards with clear questions and concise answers.

    Content:
    ${content}

    Return ONLY a valid JSON array with this exact format, no additional text:
    [
      {"question": "Question text here", "answer": "Answer text here"},
      {"question": "Question text here", "answer": "Answer text here"}
    ]

    Make sure questions are clear and answers are informative but concise (1-3 sentences max).`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    console.debug("Gemini raw response:", JSON.stringify(response.data, null, 2));

    const generatedText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Invalid response format from Gemini");
    }

    let jsonText = generatedText.trim();
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    const flashcards = JSON.parse(jsonText);

    flashcards.forEach((card, i) => {
      if (!card.question || !card.answer) {
        throw new Error(`Flashcard ${i + 1} missing question or answer`);
      }
    });

    return flashcards;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error);
    const errMsg = error.response?.data?.error || error.message;
    throw new Error(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
  }
};


// Alternative: Helper function to call OpenAI API
const generateFlashcardsWithOpenAI = async (content) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    const prompt = `You are a helpful assistant that generates educational flashcards. 
    Based on the following content, create exactly 10 flashcards with clear questions and concise answers.
    
    Content:
    ${content}
    
    Return ONLY a valid JSON array with this exact format, no additional text:
    [
      {"question": "Question text here", "answer": "Answer text here"},
      {"question": "Question text here", "answer": "Answer text here"}
    ]
    
    Make sure questions are clear and answers are informative but concise (1-3 sentences max).`;

    const response = await axios.post(
      url,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates educational flashcards in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.choices[0].message.content.trim();
    
    // Parse JSON from response (remove markdown code blocks if present)
    let jsonText = generatedText;
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const flashcards = JSON.parse(jsonText);
    
    // Validate flashcards format
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('Invalid flashcards format from AI');
    }

    return flashcards;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error);
    const errMsg = error.response?.data?.error || error.message;
    throw new Error(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
  }
};

// @desc    Generate flashcards from text using AI
// @route   POST /api/ai/generate-from-text
// @access  Private
exports.generateFromText = async (req, res) => {
  try {
    const { text, title, description, tags, aiProvider } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text content to generate flashcards'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for the flashcard set'
      });
    }

    // Check text length (minimum 50 characters for meaningful flashcards)
    if (text.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Text content is too short. Please provide at least 50 characters.'
      });
    }

    // Generate flashcards using selected AI provider (default: Gemini)
    let flashcards;
    const provider = aiProvider || 'gemini';

    if (provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'OpenAI API key not configured'
        });
      }
      flashcards = await generateFlashcardsWithOpenAI(text);
    } else {
      // Default to Gemini
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Gemini API key not configured'
        });
      }
      flashcards = await generateFlashcardsWithGemini(text);
    }

    // Create flashcard set in database
    const flashcardSet = await FlashcardSet.create({
      title,
      description: description || `AI-generated flashcards from text using ${provider}`,
      flashcards,
      tags: tags || [],
      userId: req.user.id,
      source: 'text',
      isPublic: false
    });

    res.status(201).json({
      success: true,
      message: 'Flashcards generated successfully from text',
      data: flashcardSet
    });
  } catch (error) {
    console.error('Generate from text error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating flashcards from text',
      error: error.message
    });
  }
};

// @desc    Generate flashcards from PDF using AI
// @route   POST /api/ai/generate-from-pdf
// @access  Private
exports.generateFromPDF = async (req, res) => {
  try {
    const { title, description, tags, aiProvider } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for the flashcard set'
      });
    }

    // Import pdf-parse (dynamic import for CommonJS)
    const pdfParse = require('pdf-parse');

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract enough text from PDF. Please ensure PDF contains readable text.'
      });
    }

    // Limit text length to avoid token limits (take first 4000 characters)
    const textContent = extractedText.substring(0, 4000);

    // Generate flashcards using selected AI provider
    let flashcards;
    const provider = aiProvider || 'gemini';

    if (provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'OpenAI API key not configured'
        });
      }
      flashcards = await generateFlashcardsWithOpenAI(textContent);
    } else {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Gemini API key not configured'
        });
      }
      flashcards = await generateFlashcardsWithGemini(textContent);
    }

    // Create flashcard set in database
    const flashcardSet = await FlashcardSet.create({
      title,
      description: description || `AI-generated flashcards from PDF using ${provider}`,
      flashcards,
      tags: tags || [],
      userId: req.user.id,
      source: 'pdf',
      isPublic: false
    });

    res.status(201).json({
      success: true,
      message: 'Flashcards generated successfully from PDF',
      data: flashcardSet,
      info: {
        pdfPages: pdfData.numpages,
        textExtracted: extractedText.length
      }
    });
  } catch (error) {
    console.error('Generate from PDF error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating flashcards from PDF',
      error: error.message
    });
  }
};