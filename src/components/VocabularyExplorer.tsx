import React, { useState, useMemo } from 'react';
import { FULL_VOCABULARY } from '../data/vocabularyData';
import { VocabToken } from '../types';
import { BookOpen, Search, Filter, Hash, Sparkles, Binary } from 'lucide-react';
import { generateDeterministicEmbedding } from '../utils/vectorMath';

export const VocabularyExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedToken, setSelectedToken] = useState<VocabToken | null>(null);

  const filteredTokens = useMemo(() => {
    return FULL_VOCABULARY.filter(t => {
      const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch = 
        t.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.display.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toString().includes(searchTerm);
      return matchesCat && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Tokens' },
    { id: 'common', label: 'Common Words' },
    { id: 'subword', label: 'Subwords & Morphemes' },
    { id: 'code', label: 'Code & Syntax' },
    { id: 'punctuation', label: 'Punctuation & Numbers' },
    { id: 'special', label: 'Special Tokens (<eos>, <pad>)' },
    { id: 'emoji', label: 'Emojis & UTF-8' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Interactive Model Vocabulary Explorer</span>
          </h3>
          <p className="text-xs text-slate-400">
            Browse and search the model&apos;s static vocabulary entries and their underlying token IDs.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tokens or IDs..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === c.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
        {filteredTokens.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500 text-xs rounded-xl bg-slate-950 border border-dashed border-slate-800">
            No tokens match your search filter.
          </div>
        ) : (
          filteredTokens.map((t) => {
            const isSelected = selectedToken?.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedToken(t)}
                className={`p-2.5 rounded-xl border text-left transition-all font-mono text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/80 border-indigo-500 ring-1 ring-indigo-500/40 text-indigo-200'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>ID: {t.id}</span>
                  <span className="capitalize">{t.category}</span>
                </div>
                <div className="font-bold text-sm text-cyan-300 truncate">
                  {t.display}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                  <span>{t.byteLength} B</span>
                  <span>Rank #{t.frequencyRank}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Selected Token Inspector */}
      {selectedToken && (
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-mono font-black text-white px-3 py-1 rounded-lg bg-indigo-950 border border-indigo-800">
              {selectedToken.display}
            </span>
            <div>
              <div className="text-xs text-slate-400">
                Token ID: <strong className="text-cyan-400 font-mono">{selectedToken.id}</strong> • Category:{' '}
                <strong className="text-indigo-400 capitalize">{selectedToken.category}</strong>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                UTF-8 Bytes: {selectedToken.byteLength} bytes • Frequency Rank: #{selectedToken.frequencyRank}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Binary className="w-4 h-4 text-purple-400" />
            <span>Simulated embedding vector initialized in $W_e[{selectedToken.id}]$</span>
          </div>
        </div>
      )}
    </div>
  );
};
