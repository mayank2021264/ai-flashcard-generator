import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { flashcardAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { 
  Brain, 
  Plus, 
  LogOut, 
  Search, 
  Sparkles,
  BookOpen,
  TrendingUp,
  Zap
} from 'lucide-react';
import FlashcardGrid from './FlashcardGrid';
import UploadSection from '../upload/UploadSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await flashcardAPI.getAll();
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      showToast('Failed to load flashcards', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      fetchFlashcards();
      return;
    }

    try {
      const response = await flashcardAPI.search(query);
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard set?')) {
      try {
        await flashcardAPI.delete(id);
        setFlashcardSets(flashcardSets.filter(set => set._id !== id));
        showToast('Flashcard set deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting:', error);
        showToast('Failed to delete flashcard set', 'error');
      }
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchFlashcards();
    showToast('Flashcards generated successfully!', 'success');
  };

  // Calculate stats
  const totalFlashcards = flashcardSets.reduce((sum, set) => sum + set.flashcards.length, 0);
  const aiGenerated = flashcardSets.filter(set => set.source !== 'manual').length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <ToastContainer />
      {/* Navbar */}
      <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FlashGenius</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-300">
            Ready to boost your learning with AI-powered flashcards?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Sets */}
          <div className="bg-linear-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/30 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{flashcardSets.length}</h3>
            <p className="text-purple-200 text-sm">Total Flashcard Sets</p>
          </div>

          {/* Total Cards */}
          <div className="bg-linear-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/30 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{totalFlashcards}</h3>
            <p className="text-blue-200 text-sm">Total Flashcards</p>
          </div>

          {/* AI Generated */}
          <div className="bg-linear-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500/30 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-pink-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-pink-300" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{aiGenerated}</h3>
            <p className="text-pink-200 text-sm">AI Generated Sets</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search flashcards..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowUpload(true)}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create Flashcards
          </button>
        </div>

        {/* Upload Section Modal */}
        {showUpload && (
          <UploadSection 
            onClose={() => setShowUpload(false)} 
            onSuccess={handleUploadComplete}
          />
        )}

        {/* Flashcard Grid */}
        <FlashcardGrid 
          flashcardSets={flashcardSets} 
          loading={loading}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Dashboard;