import React from 'react';
import { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw,
  Edit,
  Check,
  XCircle
} from 'lucide-react';
import { flashcardAPI } from '../../services/api';

const FlashcardViewer = ({ flashcardSet, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSet, setEditedSet] = useState(flashcardSet);
  const [saving, setSaving] = useState(false);

  const currentCard = editedSet.flashcards[currentIndex];
  const totalCards = editedSet.flashcards.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (editMode) return; // Disable shortcuts in edit mode

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          handleFlip();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isFlipped, editMode]);

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCardEdit = (field, value) => {
    const updatedFlashcards = [...editedSet.flashcards];
    updatedFlashcards[currentIndex] = {
      ...updatedFlashcards[currentIndex],
      [field]: value
    };
    setEditedSet({
      ...editedSet,
      flashcards: updatedFlashcards
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await flashcardAPI.update(flashcardSet._id, {
        title: editedSet.title,
        description: editedSet.description,
        flashcards: editedSet.flashcards,
        tags: editedSet.tags
      });
      setEditMode(false);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedSet(flashcardSet);
    setEditMode(false);
  };

  const progress = ((currentIndex + 1) / totalCards) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-linear-to-br from-slate-800/95 to-purple-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-lg border-b border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {editMode ? (
                <input
                  type="text"
                  value={editedSet.title}
                  onChange={(e) => setEditedSet({ ...editedSet, title: e.target.value })}
                  className="text-2xl font-bold text-white bg-white/10 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{editedSet.title}</h2>
              )}
              {editedSet.description && !editMode && (
                <p className="text-gray-300 mt-1">{editedSet.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-300 mt-2">
              Card {currentIndex + 1} of {totalCards}
            </p>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <div
              className="relative w-full h-78 cursor-pointer perspective-1000"
              onClick={!editMode ? handleFlip : undefined}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front (Question) */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="w-full h-full bg-linear-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl border border-white/20 p-8 flex flex-col items-center justify-center shadow-2xl">
                    <p className="text-sm font-medium text-purple-300 mb-4 uppercase tracking-wide">
                      Question
                    </p>
                    {editMode ? (
                      <textarea
                        value={currentCard.question}
                        onChange={(e) => handleCardEdit('question', e.target.value)}
                        className="text-2xl font-bold text-white text-center bg-white/10 rounded-lg p-4 w-full h-48 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                        {currentCard.question}
                      </h3>
                    )}
                    {!editMode && (
                      <p className="text-sm text-gray-400 mt-6 flex items-center gap-2">
                        <RotateCw className="w-4 h-4" />
                        Click or press Space to flip
                      </p>
                    )}
                  </div>
                </div>

                {/* Back (Answer) */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180">
                  <div className="w-full h-full bg-linear-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl border border-white/20 p-8 flex flex-col items-center justify-center shadow-2xl">
                    <p className="text-sm font-medium text-green-300 mb-4 uppercase tracking-wide">
                      Answer
                    </p>
                    {editMode ? (
                      <textarea
                        value={currentCard.answer}
                        onChange={(e) => handleCardEdit('answer', e.target.value)}
                        className="text-xl text-white text-center bg-white/10 rounded-lg p-4 w-full h-48 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <p className="text-xl md:text-2xl text-white text-center leading-relaxed">
                        {currentCard.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button
                onClick={handleFlip}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <RotateCw className="w-5 h-5" />
                Flip Card
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === totalCards - 1}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            {!editMode && (
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
                  Previous
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
                  Next
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd>
                  Flip
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd>
                  Close
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardViewer;