import React, { useState, useEffect, useMemo } from 'react';
import { BPETrainerEngine } from '../utils/bpeTrainer';
import { Layers, Play, Pause, RotateCcw, Plus, Sparkles, Check, ArrowRight } from 'lucide-react';

const BPE_PRESETS = [
  {
    title: 'Classic Sennrich Corpus',
    text: 'low lower lowest newest wider',
    desc: 'The original example from Sennrich et al. (2016) introducing BPE to NLP.'
  },
  {
    title: 'Morphological Prefixes',
    text: 'unhappy uncommon unlock unable redo restart replay review',
    desc: 'Watch the prefixes "un" and "re" merge into standalone subword tokens.'
  },
  {
    title: 'Suffix & Gerunds',
    text: 'playing walking jumping talking player walker jumper talker',
    desc: 'Observe how the frequent suffixes "ing" and "er" emerge automatically.'
  }
];

export const BpeMergeLab: React.FC = () => {
  const [corpusText, setCorpusText] = useState('low lower lowest newest wider');
  const [trainer, setTrainer] = useState(() => new BPETrainerEngine('low lower lowest newest wider'));
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [, setTick] = useState(0);

  const forceUpdate = () => setTick(t => t + 1);

  const resetTrainer = (text: string) => {
    setIsAutoPlaying(false);
    const newTrainer = new BPETrainerEngine(text);
    setTrainer(newTrainer);
    forceUpdate();
  };

  const handleStepMerge = () => {
    const res = trainer.stepMerge();
    if (!res) {
      setIsAutoPlaying(false);
    }
    forceUpdate();
  };

  // Auto-play timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        const res = trainer.stepMerge();
        if (!res) {
          setIsAutoPlaying(false);
        }
        forceUpdate();
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, trainer]);

  const corpus = trainer.getCorpus();
  const merges = trainer.getMerges();
  const vocab = trainer.getVocabulary();
  const candidatePairs = useMemo(() => trainer.getPairFrequencies(), [trainer, merges.length]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive BPE Algorithm Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Byte-Pair Encoding (BPE) Training Lab
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Experience how language models train their vocabularies. Start with raw characters, count adjacent pairs, and merge the highest-frequency pairs step by step!
        </p>
      </div>

      {/* Preset Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {BPE_PRESETS.map((p) => (
          <button
            key={p.title}
            onClick={() => {
              setCorpusText(p.text);
              resetTrainer(p.text);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              corpusText === p.text
                ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{p.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.desc}</p>
          </button>
        ))}
      </div>

      {/* Custom Corpus Input */}
      <div className="space-y-2">
        <label htmlFor="bpe-corpus-input" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Training Corpus:</span>
          <span className="text-slate-500 font-normal">Words split by whitespace</span>
        </label>
        <div className="flex gap-2">
          <input
            id="bpe-corpus-input"
            type="text"
            value={corpusText}
            onChange={(e) => setCorpusText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 font-mono text-sm outline-none"
            placeholder="Enter training words..."
          />
          <button
            onClick={() => resetTrainer(corpusText)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Apply Corpus
          </button>
        </div>
      </div>

      {/* Control Bar & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleStepMerge}
            disabled={candidatePairs.length === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Merge Top Pair</span>
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={candidatePairs.length === 0}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium transition-colors"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? 'Pause' : 'Auto-Train'}</span>
          </button>

          <button
            onClick={() => resetTrainer(corpusText)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to Characters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
          <span>Merges Applied: <strong className="text-emerald-400 font-bold">{merges.length}</strong></span>
          <span>•</span>
          <span>Vocabulary Size: <strong className="text-cyan-400 font-bold">{vocab.length}</strong> tokens</span>
        </div>
      </div>

      {/* Main Interactive Stage: Corpus Breakdown + Pair Frequencies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Current Corpus Tokenization */}
        <div className="lg:col-span-2 space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Current Corpus State (Segmented Tokens)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              &lt;/w&gt; denotes end-of-word marker
            </span>
          </div>

          <div className="space-y-2.5">
            {corpus.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {entry.tokens.map((token, tIdx) => {
                    const isNewest = merges.length > 0 && token === merges[merges.length - 1].merged;
                    return (
                      <span
                        key={tIdx}
                        className={`px-2 py-1 rounded font-mono text-xs border select-none transition-all duration-300 ${
                          isNewest
                            ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/40 font-bold scale-105'
                            : token === '</w>'
                            ? 'bg-slate-900 text-slate-500 border-slate-800 text-[10px]'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        {token}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs font-mono text-slate-500 ml-4 flex-shrink-0">
                  freq: {entry.freq}
                </span>
              </div>
            ))}
          </div>

          {/* Merge History Log */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Learned Merge Rules:</span>
            {merges.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No merges performed yet. Click &quot;Merge Top Pair&quot; above!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {merges.map((m) => (
                  <div
                    key={m.step}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs font-mono text-emerald-300"
                  >
                    <span className="text-slate-500 mr-1.5">#{m.step}</span>
                    <span>&apos;{m.pair[0]}&apos; + &apos;{m.pair[1]}&apos;</span>
                    <ArrowRight className="w-3 h-3 mx-1 text-emerald-400" />
                    <strong className="text-white">&apos;{m.merged}&apos;</strong>
                    <span className="text-[10px] text-slate-400 ml-1.5">({m.freq}x)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 col: Candidate Adjacent Pairs Frequency Ranking */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Top Candidate Pairs</h3>
            <span className="text-xs text-emerald-400 font-mono">By Frequency</span>
          </div>

          {candidatePairs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-950/60 border border-dashed border-slate-800">
              Corpus has converged into full word tokens! No further adjacent pairs available.
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {candidatePairs.slice(0, 8).map((pairData, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={pairData.pairKey}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                      isTop
                        ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-200 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] w-4 text-center font-bold ${isTop ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {idx + 1}
                      </span>
                      <span>({pairData.pair[0]}, {pairData.pair[1]})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-black/40 text-[11px] font-bold">
                        {pairData.freq} matches
                      </span>
                      {isTop && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                          Next
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-white block mb-1">How BPE Decides:</strong>
            At each iteration, the tokenizer algorithm greedily selects the pair with the highest frequency across the entire training dataset and replaces all occurrences with a single merged token.
          </div>
        </div>
      </div>
    </div>
  );
};
