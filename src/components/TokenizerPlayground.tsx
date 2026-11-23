import React, { useState } from 'react';
import { 
  tokenizeBPE, 
  tokenizeWordPiece, 
  tokenizeWordNaive, 
  tokenizeChar 
} from '../utils/tokenizers';
import { Token } from '../types';
import { 
  Sliders, 
  AlertCircle, 
  CheckCircle, 
  FileCode, 
  Globe, 
  Flame, 
  Sparkles,
  Info
} from 'lucide-react';

interface TokenizerPlaygroundProps {
  initialText: string;
}

const PLAYGROUND_PRESETS = [
  {
    name: 'Typo & Slang Stress Test',
    text: 'teh quik bron fox jumpzz over teh layzy doggo frfr no cap',
    desc: 'Shows how Word Tokenizer drops into red <UNK> tokens while BPE handles typos gracefully.'
  },
  {
    name: 'Scientific & Rare Words',
    text: 'Supercalifragilistic cryptozoology and paleoneurology research.',
    desc: 'Watch subwords break complex morphological terms into reusable stems.'
  },
  {
    name: 'Code & Special Syntax',
    text: 'def forward(x: torch.Tensor) -> torch.Tensor:\n    return self.linear(x)',
    desc: 'Notice whitespace indentation tokens, colons, arrows, and function identifiers.'
  },
  {
    name: 'Multilingual & Non-Latin',
    text: 'Hello! नमस्ते दुनिया! こんにちは! مرحباً بالعالم!',
    desc: 'Compare token count inflation across different writing systems.'
  }
];

export const TokenizerPlayground: React.FC<TokenizerPlaygroundProps> = ({ initialText }) => {
  const [text, setText] = useState(initialText);

  const bpeTokens = tokenizeBPE(text);
  const wordPieceTokens = tokenizeWordPiece(text);
  const naiveTokens = tokenizeWordNaive(text);
  const charTokens = tokenizeChar(text);

  const naiveUnkCount = naiveTokens.filter(t => t.isUnk).length;

  const renderTokenBox = (tokens: Token[]) => (
    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 min-h-[90px] content-start">
      {tokens.length === 0 ? (
        <span className="text-xs text-slate-600">Enter text to view tokens</span>
      ) : (
        tokens.map((t, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center px-2 py-1 rounded font-mono text-xs border select-none ${
              t.isUnk
                ? 'bg-red-500/25 text-red-300 border-red-500/70 ring-2 ring-red-500/40 animate-pulse font-bold'
                : t.colorClass
            }`}
            title={`Token ID: ${t.id} | Chars: "${t.rawText}"`}
          >
            <span>{t.text}</span>
            <span className="ml-1 text-[9px] opacity-60 font-mono">#{t.id}</span>
          </span>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800 text-purple-400 text-xs font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>Multi-Tokenizer Comparison Lab</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Side-by-Side Tokenizer Architecture Comparison
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Observe how Byte-Pair Encoding (GPT/LLaMA), WordPiece (BERT), Naïve Word Dictionary, and Character tokenizers divide identical sentences.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {PLAYGROUND_PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => setText(p.text)}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all"
          >
            <div className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{p.name}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.desc}</p>
          </button>
        ))}
      </div>

      {/* Live Textarea */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <label htmlFor="comparison-input" className="font-semibold text-slate-300">Prompt Text to Compare:</label>
          <span className="font-mono">{text.length} characters</span>
        </div>
        <textarea
          id="comparison-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Type or paste sentences here..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 font-sans text-sm resize-y outline-none"
        />
      </div>

      {/* Side-by-Side Tokenizer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. BPE Tokenizer */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-bold text-white">1. Byte-Pair Encoding (BPE)</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              GPT-4 / LLaMA 3 style
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Byte-level BPE preserves leading spaces with &apos;·&apos; (Ġ) and falls back to byte sequences. Has <strong>0% UNK rate</strong>.
          </p>
          <div className="flex space-x-4 text-xs font-mono text-slate-300 pt-1">
            <span>Tokens: <strong className="text-cyan-400 font-bold">{bpeTokens.length}</strong></span>
            <span>Avg Chars/Token: <strong>{bpeTokens.length ? (text.length / bpeTokens.length).toFixed(1) : 0}</strong></span>
            <span>UNK: <strong className="text-emerald-400">0</strong></span>
          </div>
          {renderTokenBox(bpeTokens)}
        </div>

        {/* 2. WordPiece Tokenizer */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <h3 className="text-sm font-bold text-white">2. WordPiece Tokenizer</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              BERT style
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Uses `##` prefix for non-initial subwords. Maximizes language likelihood over frequency.
          </p>
          <div className="flex space-x-4 text-xs font-mono text-slate-300 pt-1">
            <span>Tokens: <strong className="text-indigo-400 font-bold">{wordPieceTokens.length}</strong></span>
            <span>Avg Chars/Token: <strong>{wordPieceTokens.length ? (text.length / wordPieceTokens.length).toFixed(1) : 0}</strong></span>
            <span>UNK: <strong className="text-emerald-400">0</strong></span>
          </div>
          {renderTokenBox(wordPieceTokens)}
        </div>

        {/* 3. Naïve Word Tokenizer (UNK Spotlight) */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-red-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <h3 className="text-sm font-bold text-white">3. Naïve Word Dictionary (Historical)</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono">
              Word2Vec / Early RNNs
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Relies on a fixed dictionary of whole words. Any typo or rare word is permanently lost to <strong className="text-red-400">&lt;UNK&gt;</strong>!
          </p>
          <div className="flex space-x-4 text-xs font-mono text-slate-300 pt-1">
            <span>Tokens: <strong className="text-slate-200 font-bold">{naiveTokens.length}</strong></span>
            <span>UNK Tokens: <strong className={naiveUnkCount > 0 ? "text-red-400 font-bold animate-pulse" : "text-emerald-400"}>{naiveUnkCount}</strong></span>
            <span>Loss Rate: <strong className="text-amber-400">{naiveTokens.length ? ((naiveUnkCount / naiveTokens.length) * 100).toFixed(0) : 0}%</strong></span>
          </div>
          {renderTokenBox(naiveTokens)}
        </div>

        {/* 4. Character-Level Tokenizer */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="text-sm font-bold text-white">4. Character-Level Tokenizer</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              1 Char = 1 Token
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Tiny vocabulary (256 ASCII), but sequence length explodes, causing attention compute $O(N^2)$ to skyrocket.
          </p>
          <div className="flex space-x-4 text-xs font-mono text-slate-300 pt-1">
            <span>Tokens: <strong className="text-amber-400 font-bold">{charTokens.length}</strong></span>
            <span>Seq Explosion: <strong className="text-rose-400">{bpeTokens.length ? (charTokens.length / bpeTokens.length).toFixed(1) : 0}x</strong></span>
            <span>UNK: <strong className="text-emerald-400">0</strong></span>
          </div>
          {renderTokenBox(charTokens)}
        </div>
      </div>

      {/* Educational Callout on Why Modern LLMs Won the Tokenizer Race */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-800/60 space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 text-sm font-bold">
          <Info className="w-4 h-4" />
          <span>Why did Subword BPE dominate modern Large Language Models?</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">1. Zero Out-of-Vocabulary (OOV)</strong>
            By backing up to byte tokens (0x00 to 0xFF), the model can process ANY arbitrary string, typo, novel word, or emoji without failing.
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">2. 4x Faster Attention Compute</strong>
            Compared to character-level models, BPE compresses text by roughly 4:1. Since Transformer self-attention complexity is $O(N^2)$, 4x fewer tokens equals 16x faster attention computation!
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">3. Shared Morphological Roots</strong>
            Related terms like `play`, `player`, `playing`, and `playable` share the same `play` token vector, improving generalization across unobserved inflections.
          </div>
        </div>
      </div>
    </div>
  );
};
