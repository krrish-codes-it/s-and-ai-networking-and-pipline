import React, { useState } from 'react';
import { CURATED_PAIRS, computeWordPairStats } from '../data/spellingVsMeaningData';
import { SpellingVsMeaningPair } from '../types';
import { GitCompare, Sparkles, AlertTriangle, CheckCircle, ArrowRight, Info } from 'lucide-react';

export const SpellingVsMeaning: React.FC = () => {
  const [pairs, setPairs] = useState<SpellingVsMeaningPair[]>(CURATED_PAIRS);
  const [customWord1, setCustomWord1] = useState('apple');
  const [customWord2, setCustomWord2] = useState('apply');
  const [selectedPair, setSelectedPair] = useState<SpellingVsMeaningPair>(CURATED_PAIRS[0]);

  const handleTestCustomPair = (w1: string, w2: string) => {
    if (!w1.trim() || !w2.trim()) return;
    const computed = computeWordPairStats(w1, w2);
    setSelectedPair(computed);
    if (!pairs.some(p => p.id === computed.id)) {
      setPairs(prev => [computed, ...prev]);
    }
  };

  // SVG dimensions
  const svgWidth = 540;
  const svgHeight = 440;
  const pad = 45;

  // Map 0..1 to coordinate space
  const mapX = (val: number) => pad + val * (svgWidth - 2 * pad);
  const mapY = (val: number) => (svgHeight - pad) - val * (svgHeight - 2 * pad);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800 text-amber-400 text-xs font-semibold mb-2">
          <GitCompare className="w-3.5 h-3.5 text-amber-400" />
          <span>Surface Syntax vs Deep Semantics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Spelling-Based vs. Meaning-Based Embeddings
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Why can an LLM understand that &quot;doctor&quot; and &quot;physician&quot; are identical, yet treat &quot;apple&quot; and &quot;apply&quot; as completely unrelated concepts?
        </p>
      </div>

      {/* Interactive Word Pair Tester */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Test Any Two Words in Real-Time</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={customWord1}
            onChange={(e) => setCustomWord1(e.target.value)}
            placeholder="Word A (e.g. apple)"
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm font-mono text-slate-100 outline-none w-36"
          />

          <span className="text-xs text-slate-500 font-bold uppercase">vs</span>

          <input
            type="text"
            value={customWord2}
            onChange={(e) => setCustomWord2(e.target.value)}
            placeholder="Word B (e.g. apply)"
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm font-mono text-slate-100 outline-none w-36"
          />

          <button
            onClick={() => handleTestCustomPair(customWord1, customWord2)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all shadow-md shadow-amber-600/30"
          >
            Compute Comparison
          </button>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 ml-auto text-xs">
            <span className="text-slate-500">Try:</span>
            {[
              ['apple', 'apply'],
              ['doctor', 'physician'],
              ['horse', 'house'],
              ['happy', 'happiness'],
              ['banana', 'quantum']
            ].map(([w1, w2]) => (
              <button
                key={`${w1}-${w2}`}
                onClick={() => {
                  setCustomWord1(w1);
                  setCustomWord2(w2);
                  handleTestCustomPair(w1, w2);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors font-mono"
              >
                {w1} / {w2}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Pair Metric Banner */}
        {selectedPair && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-mono block">Comparing Pair</span>
              <span className="text-white font-mono font-bold text-base">
                &quot;{selectedPair.wordA}&quot; ↔ &quot;{selectedPair.wordB}&quot;
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 font-mono block">Spelling Similarity (Levenshtein)</span>
              <span className="text-amber-400 font-mono font-bold text-base">
                {(selectedPair.spellingSimilarity * 100).toFixed(0)}%
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 font-mono block">Semantic Meaning (Cosine)</span>
              <span className="text-cyan-400 font-mono font-bold text-base">
                {(selectedPair.semanticSimilarity * 100).toFixed(0)}%
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 font-mono block">Quadrant Verdict</span>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded inline-block mt-0.5 ${
                selectedPair.quadrant === 'spelling-trap' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                selectedPair.quadrant === 'semantic-synonym' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                selectedPair.quadrant === 'surface-and-semantic' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                'bg-slate-800 text-slate-400'
              }`}>
                {selectedPair.quadrant.replace(/-/g, ' ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2D Quadrant Scatter Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-white">The Spelling vs Meaning Quadrant Map</h4>
            <span className="text-xs text-slate-400 font-mono">X: Spelling • Y: Meaning</span>
          </div>

          <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 p-2 w-full max-w-[560px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
              {/* Quadrant Tint Backgrounds */}
              {/* Top-Left: Low Spelling, High Meaning (Synonyms) */}
              <rect x={pad} y={pad} width={(svgWidth - 2 * pad) / 2} height={(svgHeight - 2 * pad) / 2} fill="#06b6d4" fillOpacity="0.04" />
              {/* Top-Right: High Spelling, High Meaning */}
              <rect x={svgWidth / 2} y={pad} width={(svgWidth - 2 * pad) / 2} height={(svgHeight - 2 * pad) / 2} fill="#10b981" fillOpacity="0.04" />
              {/* Bottom-Right: High Spelling, Low Meaning (Spelling Traps) */}
              <rect x={svgWidth / 2} y={svgHeight / 2} width={(svgWidth - 2 * pad) / 2} height={(svgHeight - 2 * pad) / 2} fill="#f43f5e" fillOpacity="0.05" />
              {/* Bottom-Left: Low Spelling, Low Meaning (Unrelated) */}
              <rect x={pad} y={svgHeight / 2} width={(svgWidth - 2 * pad) / 2} height={(svgHeight - 2 * pad) / 2} fill="#64748b" fillOpacity="0.03" />

              {/* Quadrant Watermark Labels */}
              <text x={pad + 15} y={pad + 25} fill="#06b6d4" opacity="0.4" fontSize="11px" fontWeight="bold">
                SEMANTIC SYNONYMS (car / auto)
              </text>
              <text x={svgWidth / 2 + 15} y={pad + 25} fill="#10b981" opacity="0.4" fontSize="11px" fontWeight="bold">
                HIGH SPELL + HIGH MEANING
              </text>
              <text x={svgWidth / 2 + 15} y={svgHeight - pad - 15} fill="#f43f5e" opacity="0.5" fontSize="11px" fontWeight="bold">
                ⚠️ SPELLING TRAPS (apple / apply)
              </text>
              <text x={pad + 15} y={svgHeight - pad - 15} fill="#64748b" opacity="0.4" fontSize="11px" fontWeight="bold">
                COMPLETELY UNRELATED
              </text>

              {/* Axis Dividers */}
              <line x1={svgWidth / 2} y1={pad} x2={svgWidth / 2} y2={svgHeight - pad} stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={pad} y1={svgHeight / 2} x2={svgWidth - pad} y2={svgHeight / 2} stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Axis Bounds */}
              <line x1={pad} y1={svgHeight - pad} x2={svgWidth - pad} y2={svgHeight - pad} stroke="#475569" strokeWidth="1.5" />
              <line x1={pad} y1={pad} x2={pad} y2={svgHeight - pad} stroke="#475569" strokeWidth="1.5" />

              {/* Labels */}
              <text x={svgWidth / 2} y={svgHeight - 12} textAnchor="middle" fill="#94a3b8" fontSize="11px" fontWeight="bold">
                Spelling Similarity (1 - Levenshtein Distance Ratio) →
              </text>
              <text x={18} y={svgHeight / 2} textAnchor="middle" fill="#94a3b8" fontSize="11px" fontWeight="bold" transform={`rotate(-90 18 ${svgHeight / 2})`}>
                Semantic Cosine Similarity →
              </text>

              {/* Render Points */}
              {pairs.map((p) => {
                const cx = mapX(p.spellingSimilarity);
                const cy = mapY(Math.max(0, p.semanticSimilarity));
                const isSelected = selectedPair?.id === p.id;

                let color = '#94a3b8';
                if (p.quadrant === 'spelling-trap') color = '#f43f5e';
                else if (p.quadrant === 'semantic-synonym') color = '#06b6d4';
                else if (p.quadrant === 'surface-and-semantic') color = '#10b981';

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedPair(p)}
                  >
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="14" fill="none" stroke={color} strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 7 : 5}
                      fill={color}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                    <text
                      x={cx}
                      y={cy - 8}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : color}
                      fontSize={isSelected ? '11px' : '9px'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none drop-shadow"
                    >
                      {p.wordA} • {p.wordB}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right 1 col: Educational Deep Dive into Why This Matters */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Why LLMs Fall Into Spelling Traps</span>
          </h4>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <strong className="text-amber-400 block">The Strawberry Problem Explained:</strong>
            Users often wonder why frontier AI can write brilliant essays on quantum physics, but fails when asked:
            <em className="text-white block my-1">&quot;How many letter &apos;r&apos;s are in strawberry?&quot;</em>
            Because the model receives the token ID for <span className="font-mono text-cyan-300">strawberry</span> (or subwords <span className="font-mono text-cyan-300">straw</span> + <span className="font-mono text-cyan-300">berry</span>). It does NOT examine the letters &apos;s-t-r-a-w-b-e-r-r-y&apos; one by one!
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <strong className="text-cyan-400 block">The Power of Semantic Space:</strong>
            Traditional regex search completely fails when query terms don&apos;t share characters. Embedding search bridges this gap completely: searching for &quot;cheap lodging&quot; retrieves &quot;budget motel&quot; even with 0% letter overlap.
          </div>

          {selectedPair && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-slate-300">
              <strong className="text-amber-300 block mb-1">Pair Analysis:</strong>
              {selectedPair.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
