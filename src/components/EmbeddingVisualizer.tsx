import React, { useState, useMemo } from 'react';
import { EMBEDDINGS_DATA, CATEGORY_COLORS } from '../data/embeddingsData';
import { VectorPoint } from '../types';
import { 
  cosineSimilarity, 
  vectorSubtract, 
  vectorAdd, 
  normalizeVector,
  generateDeterministicEmbedding,
  dotProduct,
  vectorMagnitude
} from '../utils/vectorMath';
import { Compass, Calculator, Plus, Minus, Equal, Search, Sparkles, Info, RefreshCw } from 'lucide-react';

interface VectorArithmeticPreset {
  label: string;
  a: string;
  b: string;
  c: string;
  expected: string;
  explanation: string;
}

const ARITHMETIC_PRESETS: VectorArithmeticPreset[] = [
  {
    label: '👑 Royalty / Gender Analogy',
    a: 'king',
    b: 'man',
    c: 'woman',
    expected: 'queen',
    explanation: 'Subtracting "man" removes masculine gender from royalty; adding "woman" yields "queen".'
  },
  {
    label: '🗼 Capital / Country Analogy',
    a: 'paris',
    b: 'france',
    c: 'japan',
    expected: 'tokyo',
    explanation: 'Subtracting France isolates the concept of "capital city"; adding Japan yields Tokyo.'
  },
  {
    label: '🐾 Juvenile Animal Analogy',
    a: 'puppy',
    b: 'dog',
    c: 'cat',
    expected: 'kitten',
    explanation: 'Subtracting dog isolates the "young animal" feature; adding cat yields kitten.'
  }
];

export const EmbeddingVisualizer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<VectorPoint | null>(null);
  
  // Cosine comparison state
  const [wordA, setWordA] = useState<string>('king');
  const [wordB, setWordB] = useState<string>('queen');

  // Vector Arithmetic state
  const [arithA, setArithA] = useState<string>('king');
  const [arithB, setArithB] = useState<string>('man');
  const [arithC, setArithC] = useState<string>('woman');

  // Custom word state
  const [customWord, setCustomWord] = useState('');
  const [customPoints, setCustomPoints] = useState<VectorPoint[]>([]);

  // All points combined
  const allPoints = useMemo(() => {
    return [...EMBEDDINGS_DATA, ...customPoints];
  }, [customPoints]);

  const filteredPoints = useMemo(() => {
    return allPoints.filter(p => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.word.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [allPoints, selectedCategory, searchQuery]);

  // Compute Vector Arithmetic result
  const arithmeticResult = useMemo(() => {
    const pA = allPoints.find(p => p.word === arithA.toLowerCase());
    const pB = allPoints.find(p => p.word === arithB.toLowerCase());
    const pC = allPoints.find(p => p.word === arithC.toLowerCase());

    if (!pA || !pB || !pC) return null;

    // resultVector = A - B + C
    const diff = vectorSubtract(pA.vector, pB.vector);
    const combined = vectorAdd(diff, pC.vector);
    const normalized = normalizeVector(combined);

    // 2D position approximation
    const resX = pA.x - pB.x + pC.x;
    const resY = pA.y - pB.y + pC.y;

    // Find nearest neighbor excluding inputs
    const candidates = allPoints.filter(p => ![pA.word, pB.word, pC.word].includes(p.word));

    const ranked = candidates.map(cand => {
      const sim = cosineSimilarity(normalized, cand.vector);
      return { point: cand, sim };
    }).sort((a, b) => b.sim - a.sim);

    const bestMatch: VectorPoint | null = ranked.length > 0 ? ranked[0].point : null;
    const bestSim: number = ranked.length > 0 ? ranked[0].sim : 0;

    return {
      vector: normalized,
      x: resX,
      y: resY,
      bestMatch,
      bestSim,
      topMatches: ranked.slice(0, 4)
    };
  }, [allPoints, arithA, arithB, arithC]);

  // Compute Cosine similarity between WordA and WordB
  const pairCosineStats = useMemo(() => {
    const pA = allPoints.find(p => p.word === wordA.toLowerCase());
    const pB = allPoints.find(p => p.word === wordB.toLowerCase());

    if (!pA || !pB) return null;

    const dot = dotProduct(pA.vector, pB.vector);
    const magA = vectorMagnitude(pA.vector);
    const magB = vectorMagnitude(pB.vector);
    const sim = cosineSimilarity(pA.vector, pB.vector);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, sim)));
    const angleDeg = (angleRad * 180) / Math.PI;

    return {
      pointA: pA,
      pointB: pB,
      dotProduct: dot,
      magnitudeA: magA,
      magnitudeB: magB,
      cosine: sim,
      angleDeg
    };
  }, [allPoints, wordA, wordB]);

  const handleAddCustomWord = () => {
    if (!customWord.trim()) return;
    const clean = customWord.toLowerCase().trim();
    if (allPoints.some(p => p.word === clean)) return;

    const vec = generateDeterministicEmbedding(clean, 8);
    // Project into 2D based on first 2 PCA-like components
    const newPt: VectorPoint = {
      id: clean,
      word: clean,
      category: 'contrast',
      x: Number((vec[0] * 0.8).toFixed(2)),
      y: Number((vec[1] * 0.8).toFixed(2)),
      vector: vec,
      description: 'Custom user-entered token.'
    };
    setCustomPoints(prev => [...prev, newPt]);
    setCustomWord('');
  };

  // SVG coordinate transformation: range [-1, 1] to [40, 560]
  const svgWidth = 600;
  const svgHeight = 440;
  const mapX = (val: number) => ((val + 1.2) / 2.4) * (svgWidth - 60) + 30;
  const mapY = (val: number) => svgHeight - (((val + 1.2) / 2.4) * (svgHeight - 60) + 30);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800 text-blue-400 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Continuous Geometric Meaning Space</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          2D Vector Space & Semantic Analogies
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore how words map to dense geometric coordinates. Words with similar meanings cluster together, and directional arrows encode conceptual analogies.
        </p>
      </div>

      {/* Main 2D Canvas & Controls Card */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 font-semibold">Clusters:</span>
            {['all', 'royalty', 'animals', 'food', 'tech', 'geography', 'emotions'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words..."
                className="pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2D Coordinate SVG Plane */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden flex justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-[700px] h-auto select-none"
            style={{ maxHeight: '480px' }}
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Axes */}
            <line x1="30" y1={svgHeight / 2} x2={svgWidth - 30} y2={svgHeight / 2} stroke="#334155" strokeWidth="1.2" strokeDasharray="4 4" />
            <line x1={svgWidth / 2} y1="30" x2={svgWidth / 2} y2={svgHeight - 30} stroke="#334155" strokeWidth="1.2" strokeDasharray="4 4" />

            {/* Arithmetic vector line visualization if active */}
            {arithmeticResult && (
              <g opacity="0.85">
                {/* Arrow from B to A */}
                {(() => {
                  const pA = allPoints.find(p => p.word === arithA.toLowerCase());
                  const pB = allPoints.find(p => p.word === arithB.toLowerCase());
                  const pC = allPoints.find(p => p.word === arithC.toLowerCase());
                  if (pA && pB && pC && arithmeticResult.bestMatch) {
                    const ax = mapX(pA.x);
                    const ay = mapY(pA.y);
                    const bx = mapX(pB.x);
                    const by = mapY(pB.y);
                    const cx = mapX(pC.x);
                    const cy = mapY(pC.y);
                    const targetX = mapX(arithmeticResult.bestMatch.x);
                    const targetY = mapY(arithmeticResult.bestMatch.y);

                    return (
                      <>
                        {/* Line from Man to King */}
                        <line x1={bx} y1={by} x2={ax} y2={ay} stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                        {/* Line from Woman to Target (Queen) */}
                        <line x1={cx} y1={cy} x2={targetX} y2={targetY} stroke="#38bdf8" strokeWidth="2.5" />
                        {/* Target pulse circle */}
                        <circle cx={targetX} cy={targetY} r="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" opacity="0.4" />
                      </>
                    );
                  }
                  return null;
                })()}
              </g>
            )}

            {/* Render Points */}
            {filteredPoints.map((pt) => {
              const cx = mapX(pt.x);
              const cy = mapY(pt.y);
              const isHovered = hoveredPoint?.id === pt.id;
              const isA = pt.word === wordA.toLowerCase() || pt.word === arithA.toLowerCase();
              const isB = pt.word === wordB.toLowerCase() || pt.word === arithB.toLowerCase();
              const isC = pt.word === arithC.toLowerCase();
              const isTargetMatch = arithmeticResult?.bestMatch?.id === pt.id;

              let fillColor = '#38bdf8';
              if (pt.category === 'royalty') fillColor = '#a855f7';
              else if (pt.category === 'animals') fillColor = '#10b981';
              else if (pt.category === 'food') fillColor = '#f59e0b';
              else if (pt.category === 'tech') fillColor = '#06b6d4';
              else if (pt.category === 'geography') fillColor = '#3b82f6';
              else if (pt.category === 'emotions') fillColor = '#f43f5e';

              return (
                <g
                  key={pt.id}
                  className="cursor-pointer transition-transform duration-150"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => {
                    setWordA(pt.word);
                  }}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isTargetMatch ? 8 : isA || isB || isC || isHovered ? 7 : 5}
                    fill={fillColor}
                    stroke={isTargetMatch ? '#ffffff' : isHovered ? '#38bdf8' : '#0f172a'}
                    strokeWidth={isTargetMatch ? 2.5 : 1.5}
                    opacity={isHovered || isA || isB || isC || isTargetMatch ? 1 : 0.85}
                  />
                  <text
                    x={cx}
                    y={cy - 9}
                    textAnchor="middle"
                    fill={isTargetMatch ? '#38bdf8' : isHovered ? '#ffffff' : '#cbd5e1'}
                    fontSize={isTargetMatch ? '12px' : isHovered ? '11px' : '9.5px'}
                    fontWeight={isTargetMatch || isHovered ? 'bold' : 'normal'}
                    className="pointer-events-none drop-shadow"
                  >
                    {pt.word}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hovered Tooltip Overlay */}
          {hoveredPoint && (
            <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-xs shadow-2xl max-w-xs space-y-1 z-20 pointer-events-none backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{hoveredPoint.word}</span>
                <span className="text-[10px] font-mono capitalize px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                  {hoveredPoint.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">{hoveredPoint.description}</p>
              <div className="text-[10px] font-mono text-slate-500">
                Coords: [{hoveredPoint.x}, {hoveredPoint.y}] • 8-dim unit vector
              </div>
            </div>
          )}
        </div>

        {/* Custom Word Input */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomWord()}
            placeholder="Type any custom word to project into space..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddCustomWord}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Map</span>
          </button>
        </div>
      </div>

      {/* Two Interactive Sub-tools: Vector Arithmetic & Cosine Similarity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Vector Arithmetic Sandbox */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <span>Vector Arithmetic Sandbox</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              A - B + C = ?
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Vector subtraction removes an attribute, while addition injects one. Select a preset or pick custom words:
          </p>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {ARITHMETIC_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setArithA(p.a);
                  setArithB(p.b);
                  setArithC(p.c);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Equation Selectors */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-sm">
            <select
              value={arithA}
              onChange={(e) => setArithA(e.target.value)}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold outline-none"
            >
              {allPoints.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
            </select>

            <Minus className="w-4 h-4 text-rose-400" />

            <select
              value={arithB}
              onChange={(e) => setArithB(e.target.value)}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-rose-300 font-bold outline-none"
            >
              {allPoints.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
            </select>

            <Plus className="w-4 h-4 text-emerald-400" />

            <select
              value={arithC}
              onChange={(e) => setArithC(e.target.value)}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-300 font-bold outline-none"
            >
              {allPoints.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
            </select>

            <Equal className="w-4 h-4 text-slate-400" />

            <span className="px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-black text-base shadow-sm">
              {arithmeticResult?.bestMatch?.word || '???'}
            </span>
          </div>

          {/* Results Analysis */}
          {arithmeticResult && (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Closest Nearest Neighbor:</span>
                  <span className="text-white font-bold text-sm">
                    {arithmeticResult.bestMatch?.word}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Cosine Alignment:</span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">
                    {(arithmeticResult.bestSim * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="text-slate-400 text-[11px]">
                Top 4 Candidate Projections:{' '}
                {arithmeticResult.topMatches.map((m, i) => (
                  <span key={i} className="text-slate-300 font-mono mr-2">
                    {m.point.word} ({(m.sim * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tool 2: Cosine Similarity Calculator */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Cosine Similarity Gauge</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              cos(θ) ∈ [-1, 1]
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Measures the cosine of the angle between two embedding vectors. 1.0 means identical directional meaning; 0.0 means unrelated (orthogonal).
          </p>

          {/* Pair Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="word-a-select" className="text-[10px] uppercase text-slate-500 font-mono block mb-1">Vector A</label>
              <select
                id="word-a-select"
                value={wordA}
                onChange={(e) => setWordA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 font-bold outline-none"
              >
                {allPoints.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="word-b-select" className="text-[10px] uppercase text-slate-500 font-mono block mb-1">Vector B</label>
              <select
                id="word-b-select"
                value={wordB}
                onChange={(e) => setWordB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 font-bold outline-none"
              >
                {allPoints.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
              </select>
            </div>
          </div>

          {/* Gauge Display */}
          {pairCosineStats && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Semantic Alignment:</span>
                <span className={`text-lg font-mono font-black ${
                  pairCosineStats.cosine >= 0.7 ? 'text-emerald-400' :
                  pairCosineStats.cosine >= 0.3 ? 'text-cyan-400' :
                  pairCosineStats.cosine >= 0.0 ? 'text-slate-300' : 'text-rose-400'
                }`}>
                  {pairCosineStats.cosine >= 0 ? '+' : ''}{pairCosineStats.cosine.toFixed(3)}
                </span>
              </div>

              {/* Progress bar gauge */}
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
                {/* 0.0 marker line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 z-10" />
                <div
                  className={`h-full transition-all duration-300 ${
                    pairCosineStats.cosine >= 0.7 ? 'bg-emerald-500' :
                    pairCosineStats.cosine >= 0.3 ? 'bg-cyan-500' :
                    pairCosineStats.cosine >= 0 ? 'bg-indigo-500' : 'bg-rose-500'
                  }`}
                  style={{
                    width: `${Math.abs(pairCosineStats.cosine) * 50}%`,
                    marginLeft: pairCosineStats.cosine >= 0 ? '50%' : `${50 - Math.abs(pairCosineStats.cosine) * 50}%`
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[9px]">ANGLE θ</span>
                  <span className="text-slate-200">{pairCosineStats.angleDeg.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">DOT PRODUCT</span>
                  <span className="text-slate-200">{pairCosineStats.dotProduct.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">RELATIONSHIP</span>
                  <span className="text-indigo-400 font-sans text-[10px]">
                    {pairCosineStats.cosine >= 0.75 ? 'Strong Synonym' :
                     pairCosineStats.cosine >= 0.40 ? 'Related Domain' :
                     pairCosineStats.cosine >= 0.05 ? 'Weakly Related' : 'Orthogonal / Opp.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
