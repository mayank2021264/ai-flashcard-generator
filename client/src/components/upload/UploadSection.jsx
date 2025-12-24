import React from 'react';
import { useState } from 'react';
import { X, FileText, FileUp, Sparkles, Loader, CheckCircle } from 'lucide-react';
import { aiAPI } from '../../services/api';

const UploadSection = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'pdf'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Text form state
  const [textData, setTextData] = useState({
    title: '',
    text: '',
    description: '',
    tags: '',
  });

  // PDF form state
  const [pdfData, setPdfData] = useState({
    title: '',
    description: '',
    tags: '',
    file: null,
  });

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsArray = textData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await aiAPI.generateFromText({
        title: textData.title,
        text: textData.text,
        description: textData.description,
        tags: tagsArray,
        aiProvider: 'gemini'
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate flashcards from text');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!pdfData.file) {
      setError('Please select a PDF file');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pdf', pdfData.file);
      formData.append('title', pdfData.title);
      formData.append('description', pdfData.description);
      
      const tagsArray = pdfData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArray));
      formData.append('aiProvider', 'gemini');

      await aiAPI.generateFromPDF(formData);

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate flashcards from PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfData({ ...pdfData, file });
      setError('');
    } else {
      setError('Please select a valid PDF file');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-linear-to-br from-slate-800/95 to-purple-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-lg border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Flashcards</h2>
              <p className="text-sm text-gray-300">Generate with AI or create manually</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-6">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-green-200">Flashcards generated successfully</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        {!success && (
          <>
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'text'
                    ? 'text-white bg-white/10 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-5 h-5" />
                From Text
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'pdf'
                    ? 'text-white bg-white/10 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileUp className="w-5 h-5" />
                From PDF
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Text Form */}
            {activeTab === 'text' && (
              <form onSubmit={handleTextSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={textData.title}
                    onChange={(e) => setTextData({ ...textData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="E.g., JavaScript Fundamentals"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Text Content * (min 50 characters)
                  </label>
                  <textarea
                    value={textData.text}
                    onChange={(e) => setTextData({ ...textData, text: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-40 resize-none"
                    placeholder="Paste your educational content here... AI will generate flashcards from this text."
                    required
                    minLength={50}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {textData.text.length} characters (need at least 50)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={textData.description}
                    onChange={(e) => setTextData({ ...textData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief description of this flashcard set"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Tags (optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={textData.tags}
                    onChange={(e) => setTextData({ ...textData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="javascript, programming, basics"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating Flashcards...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate with AI
                    </>
                  )}
                </button>
              </form>
            )}

            {/* PDF Form */}
            {activeTab === 'pdf' && (
              <form onSubmit={handlePdfSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={pdfData.title}
                    onChange={(e) => setPdfData({ ...pdfData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="E.g., Computer Science Notes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Upload PDF * (max 10MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                      required
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="w-full px-4 py-8 bg-white/5 border-2 border-dashed border-white/20 rounded-lg text-white hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <FileUp className="w-12 h-12 text-purple-400" />
                      {pdfData.file ? (
                        <>
                          <span className="font-medium">{pdfData.file.name}</span>
                          <span className="text-sm text-gray-400">
                            {(pdfData.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">Click to upload PDF</span>
                          <span className="text-sm text-gray-400">or drag and drop</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={pdfData.description}
                    onChange={(e) => setPdfData({ ...pdfData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief description of this flashcard set"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Tags (optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={pdfData.tags}
                    onChange={(e) => setPdfData({ ...pdfData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="computer-science, notes, chapter-5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate with AI
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadSection;