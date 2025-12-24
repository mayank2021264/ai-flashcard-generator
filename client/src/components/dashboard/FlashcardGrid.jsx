import React from 'react';
import { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Tag, 
  FileText, 
  FileUp, 
  Edit, 
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';
import FlashcardViewer from '../flashcards/FlashcardViewer';

const FlashcardGrid = ({ flashcardSets, loading, onDelete }) => {
  const [selectedSet, setSelectedSet] = useState(null);

  const getSourceIcon = (source) => {
    switch (source) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'pdf':
        return <FileUp className="w-4 h-4" />;
      default:
        return <Edit className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'text':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'pdf':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      default:
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
    }
  };

  const getSourceBadge = (source) => {
    const colors = {
      text: 'bg-blue-500/30 text-blue-200',
      pdf: 'bg-green-500/30 text-green-200',
      manual: 'bg-purple-500/30 text-purple-200'
    };
    
    const labels = {
      text: 'Text',
      pdf: 'PDF',
      manual: 'Manual'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[source]} flex items-center gap-1`}>
        {getSourceIcon(source)}
        {labels[source]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 animate-pulse"
          >
            <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mb-6"></div>
            <div className="h-20 bg-white/20 rounded mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-white/20 rounded flex-1"></div>
              <div className="h-8 bg-white/20 rounded w-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (flashcardSets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
          <div className="bg-linear-to-br from-purple-600 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Flashcards Yet</h3>
          <p className="text-gray-300 mb-6">
            Create your first flashcard set to start learning!
          </p>
          <p className="text-sm text-gray-400">
            Use AI to generate flashcards from text or PDFs, or create them manually.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcardSets.map((set) => (
          <div
            key={set._id}
            className={`bg-linear-to-br ${getSourceColor(set.source)} backdrop-blur-lg rounded-xl p-6 border transform hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer group`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white line-clamp-2 flex-1">
                {set.title}
              </h3>
              {getSourceBadge(set.source)}
            </div>

            {/* Description */}
            {set.description && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {set.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{set.flashcards.length} cards</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(set.createdAt)}</span>
              </div>
            </div>

            {/* Tags */}
            {set.tags && set.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {set.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-200 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
                {set.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-200">
                    +{set.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSet(set)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 group-hover:bg-white/20"
              >
                <Eye className="w-4 h-4" />
                Study
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(set._id);
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Flashcard Viewer Modal */}
      {selectedSet && (
        <FlashcardViewer
          flashcardSet={selectedSet}
          onClose={() => setSelectedSet(null)}
        />
      )}
    </>
  );
};

export default FlashcardGrid;