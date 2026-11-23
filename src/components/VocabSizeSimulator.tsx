import React, { useState } from 'react';
import { Sliders, Cpu, HardDrive, Globe, DollarSign, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface LanguageSample {
  language: string;
  flag: string;
  nativeText: string;
  charCount: number;
  tokensSmallVocab: number; // e.g. 32k vocab
  tokensLargeVocab: number; // e.g. 128k vocab
  tokensUltraVocab: number; // e.g. 256k vocab
}

const MULTILINGUAL_BENCHMARKS: LanguageSample[] = [
  {
    language: 'English',
    flag: '🇺🇸',
    nativeText: 'Artificial intelligence transforms human knowledge and communication.',
    charCount: 68,
    tokensSmallVocab: 9,
    tokensLargeVocab: 8,
    tokensUltraVocab: 8
  },
  {
    language: 'Spanish',
    flag: '🇪🇸',
    nativeText: 'La inteligencia artificial transforma el conocimiento y la comunicación humana.',
    charCount: 79,
    tokensSmallVocab: 14,
    tokensLargeVocab: 11,
    tokensUltraVocab: 10
  },
  {
    language: 'Hindi (Devanagari)',
    flag: '🇮🇳',
    nativeText: 'कृत्रिम बुद्धिमत्ता मानव ज्ञान और संचार को रूपांतरित करती है।',
    charCount: 61,
    tokensSmallVocab: 29,
    tokensLargeVocab: 13,
    tokensUltraVocab: 9
  },
  {
    language: 'Japanese (Kanji/Kana)',
    flag: '🇯🇵',
    nativeText: '人工知能は人間の知識とコミュニケーションを変革します。',
    charCount: 29,
    tokensSmallVocab: 23,
    tokensLargeVocab: 12,
    tokensUltraVocab: 8
  },
  {
    language: 'Arabic',
    flag: '🇸🇦',
    nativeText: 'الذكاء الاصطناعي يحول المعرفة الإنسانية والتواصل البشري.',
    charCount: 55,
    tokensSmallVocab: 27,
    tokensLargeVocab: 14,
    tokensUltraVocab: 10
  },
  {
    language: 'Russian (Cyrillic)',
    flag: '🇷🇺',
    nativeText: 'Искусственный интеллект трансформирует человеческие знания и общение.',
    charCount: 68,
    tokensSmallVocab: 20,
    tokensLargeVocab: 11,
    tokensUltraVocab: 9
  }
];

export const VocabSizeSimulator: React.FC = () => {
  const [vocabSize, setVocabSize] = useState<number>(128000);
  const [dModel, setDModel] = useState<number>(4096);
  const [precision, setPrecision] = useState<'fp16' | 'fp32' | 'int8'>('fp16');

  // Calculations
  const embeddingParams = vocabSize * dModel;
  const bytesPerParam = precision === 'fp32' ? 4 : precision === 'fp16' ? 2 : 1;
  const embeddingMemoryBytes = embeddingParams * bytesPerParam;
  const embeddingMemoryMB = (embeddingMemoryBytes / (1024 * 1024)).toFixed(1);
  const embeddingMemoryGB = (embeddingMemoryBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Model Presets
  const VOCAB_PRESETS = [
    { name: 'Raw Byte Level', size: 256, desc: 'Zero OOV, but huge sequence lengths' },
    { name: 'BERT / RoBERTa', size: 30522, desc: 'Traditional early transformer' },
    { name: 'LLaMA 1 & 2', size: 32000, desc: 'Early open-source foundation models' },
    { name: 'GPT-2 / GPT-3', size: 50257, desc: 'OpenAI classic BPE vocabulary' },
    { name: 'Claude / GPT-4', size: 100000, desc: 'Modern balanced enterprise LLM' },
    { name: 'LLaMA 3', size: 128256, desc: 'Meta 4x vocab expansion for efficiency' },
    { name: 'GPT-4o / Gemini', size: 256000, desc: 'Ultra-compressed multilingual vocab' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800 text-rose-400 text-xs font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5 text-rose-400" />
          <span>Model Architecture Scaling Trade-Offs</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Vocabulary Size, Memory Footprint & The Multilingual Token Tax
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Adjust the vocabulary size <em>V</em> and hidden dimension <em>d</em><sub>model</sub> to visualize the engineering trade-offs between GPU VRAM consumption, sequence compression, and multilingual fairness.
        </p>
      </div>

      {/* Interactive Sliders & Presets */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        {/* Model Presets Quick Bar */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">Standard Model Architectural Baselines:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {VOCAB_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setVocabSize(p.size)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  vocabSize === p.size
                    ? 'bg-rose-950/60 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{p.name}</div>
                <div className="text-xs font-mono font-bold text-rose-400 mt-0.5">{p.size.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dual Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Vocab Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Vocabulary Size ($V$):</span>
              <span className="font-mono text-cyan-400 font-bold text-sm">{vocabSize.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="256"
              max="256000"
              step="1000"
              value={vocabSize}
              onChange={(e) => setVocabSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>256 (Bytes)</span>
              <span>32k (LLaMA 1)</span>
              <span>128k (LLaMA 3)</span>
              <span>256k (GPT-4o)</span>
            </div>
          </div>

          {/* Model Hidden Dimension Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Hidden Dimension (<em>d</em><sub>model</sub>):</span>
              <span className="font-mono text-purple-400 font-bold text-sm">{dModel.toLocaleString()} dims</span>
            </div>
            <input
              type="range"
              min="768"
              max="8192"
              step="256"
              value={dModel}
              onChange={(e) => setDModel(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>768 (Small/BERT)</span>
              <span>2048 (7B)</span>
              <span>4096 (13B/70B)</span>
              <span>8192 (Frontier 405B)</span>
            </div>
          </div>
        </div>

        {/* Precision Selector */}
        <div className="flex items-center space-x-3 text-xs pt-1 border-t border-slate-800/80">
          <span className="text-slate-400 font-medium">Weights Precision:</span>
          {(['fp16', 'fp32', 'int8'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPrecision(p)}
              className={`px-3 py-1 rounded-lg uppercase font-mono font-bold transition-all ${
                precision === p
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p} ({p === 'fp32' ? '4 bytes' : p === 'fp16' ? '2 bytes' : '1 byte'})
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Hardware Footprint Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Embedding Table Parameters ($V \times d$)</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {(embeddingParams / 1_000_000).toFixed(1)} <span className="text-sm font-normal text-cyan-400">Million</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Exact count: {embeddingParams.toLocaleString()} scalar weights stored in the lookup table.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/30 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>GPU VRAM Consumption</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {Number(embeddingMemoryGB) >= 1 ? `${embeddingMemoryGB} GB` : `${embeddingMemoryMB} MB`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Must be permanently resident in GPU high-bandwidth memory (HBM) before any query is run.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Average Sequence Compression</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {vocabSize >= 100000 ? '~4.2' : vocabSize >= 32000 ? '~3.5' : '~1.4'}{' '}
            <span className="text-sm font-normal text-emerald-400">chars / token</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Higher compression means shorter sequences and quadratically faster self-attention ($O(N^2)$).
          </p>
        </div>
      </div>

      {/* The Multilingual Token Tax Comparison Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>The Multilingual &quot;Token Tax&quot; In Action</span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparing token counts for the exact same sentence across languages as vocabulary scales from 32,000 to 256,000 tokens.
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono text-xs">
            Semantic equivalence benchmark
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3">Original Sentence</th>
                <th className="py-2.5 px-3 text-center">Small Vocab (32k)</th>
                <th className="py-2.5 px-3 text-center">Modern Vocab (128k)</th>
                <th className="py-2.5 px-3 text-center">Ultra Vocab (256k)</th>
                <th className="py-2.5 px-3 text-right">Tax Inflation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {MULTILINGUAL_BENCHMARKS.map((item) => {
                const inflationMultiplier = (item.tokensSmallVocab / MULTILINGUAL_BENCHMARKS[0].tokensSmallVocab).toFixed(1);
                const modernMultiplier = (item.tokensUltraVocab / MULTILINGUAL_BENCHMARKS[0].tokensUltraVocab).toFixed(1);

                return (
                  <tr key={item.language} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      <span className="mr-2 text-base">{item.flag}</span>
                      {item.language}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px] max-w-xs truncate" title={item.nativeText}>
                      {item.nativeText}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        item.tokensSmallVocab > 20 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-900 text-slate-300'
                      }`}>
                        {item.tokensSmallVocab} tokens
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                        {item.tokensLargeVocab} tokens
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        {item.tokensUltraVocab} tokens
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span className={`font-bold ${Number(inflationMultiplier) > 1.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {inflationMultiplier}x → <span className="text-cyan-400">{modernMultiplier}x</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
          <DollarSign className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white block">Economic & Fairness Implications:</strong>
            <p>
              In a 32,000-vocabulary model, a Hindi speaker paying standard per-token API pricing was charged <strong>3.2x more money</strong> than an English speaker for communicating the exact same thought! Furthermore, the Hindi user&apos;s effective context window was shrunk to less than one-third. Expanding the vocabulary to 128k–256k tokens drastically closes this disparity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
