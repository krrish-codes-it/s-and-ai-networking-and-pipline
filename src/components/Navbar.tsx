import React from 'react';
import { 
  Cpu, 
  Workflow, 
  BookOpen, 
  Sliders, 
  Compass, 
  GitCompare, 
  GraduationCap, 
  Sparkles,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectPreset: (presetText: string) => void;
}

export const PRESET_EXAMPLES = [
  {
    label: '🦊 Quick Brown Fox',
    text: 'The quick brown fox jumps over the lazy dog.',
    category: 'Standard English'
  },
  {
    label: '✨ Subwords & Morphemes',
    text: 'Unbelievable transformations in artificial intelligence.',
    category: 'Subword Breakdown'
  },
  {
    label: '🐍 Python Code',
    text: 'def calculate_embedding(token_id: int) -> list[float]:\n    return embedding_table[token_id]',
    category: 'Code Syntax'
  },
  {
    label: '🌐 Multilingual Token Tax',
    text: 'Hello world! नमस्ते दुनिया! こんにちは世界！ مرحبا بالعالم!',
    category: 'Multilingual'
  },
  {
    label: '⚠️ Spelling Traps',
    text: 'The horse jumped near the house. Please apply for the apple project.',
    category: 'Spelling vs Meaning'
  },
  {
    label: '🚀 Emojis & Bytes',
    text: 'Launching LLM lab 🚀🔥🧠 with multi-byte UTF-8 tokens!',
    category: 'UTF-8 & Bytes'
  }
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onSelectPreset }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('pipeline')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  TokenLab
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold tracking-wide">
                  LLM Internals
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Interactive Tokenization & Embedding Explorer</p>
            </div>
          </div>

          {/* Preset quick switcher */}
          <div className="hidden lg:flex items-center space-x-1.5">
            <span className="text-xs text-slate-400 flex items-center mr-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" />
              Presets:
            </span>
            {PRESET_EXAMPLES.slice(0, 3).map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  onSelectPreset(preset.text);
                  setActiveTab('pipeline');
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
                title={preset.text}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 overflow-x-auto max-w-full py-1">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'concepts'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>8 Concepts</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'playground'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline">Tokenizers</span>
              <span className="md:hidden">Tokens</span>
            </button>

            <button
              onClick={() => setActiveTab('bpe')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'bpe'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">BPE Merge</span>
              <span className="md:hidden">BPE</span>
            </button>

            <button
              onClick={() => setActiveTab('embeddings')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'embeddings'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">2D Vectors</span>
              <span className="md:hidden">Vectors</span>
            </button>

            <button
              onClick={() => setActiveTab('spelling')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'spelling'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden lg:inline">Spelling vs Meaning</span>
              <span className="lg:hidden">Meaning</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab-size')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'vocab-size'
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline">Vocab Size</span>
              <span className="md:hidden">Scale</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Quiz</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
