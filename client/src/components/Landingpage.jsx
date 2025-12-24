import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Zap, BookOpen, FileText, FileUp, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">FlashGenius</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Learn Smarter with
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> AI-Powered </span>
              Flashcards
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Transform any text or PDF into interactive flashcards instantly. Study efficiently with AI-generated content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/signup"
                className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center gap-2 text-lg"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-lg font-semibold hover:bg-white/20 transition-all text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose FlashGenius?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all">
              <div className="bg-linear-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Generation</h3>
              <p className="text-gray-300">
                Our advanced AI analyzes your content and creates smart, effective flashcards automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all">
              <div className="bg-linear-to-br from-blue-600 to-teal-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-300">
                Generate hundreds of flashcards in seconds from text or PDF files. No manual work required.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all">
              <div className="bg-linear-to-br from-pink-600 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Study Mode</h3>
              <p className="text-gray-300">
                Interactive flashcards with keyboard shortcuts and progress tracking for efficient learning.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="bg-linear-to-br from-purple-600 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Upload Your Content
                </h3>
                <p className="text-gray-300">
                  Paste text or upload a PDF file containing the material you want to study.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="bg-linear-to-br from-blue-600 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Generates Flashcards
                </h3>
                <p className="text-gray-300">
                  Our AI analyzes the content and creates intelligent question-answer pairs.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="bg-linear-to-br from-pink-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study & Master
                </h3>
                <p className="text-gray-300">
                  Review your flashcards with our interactive study mode and track your progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="container mx-auto px-6 py-20">
          <div className="bg-linear-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students learning smarter with AI-powered flashcards.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 text-lg"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-white/10">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 FlashGenius. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;