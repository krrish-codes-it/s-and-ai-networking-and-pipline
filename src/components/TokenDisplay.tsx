import React, { useState } from 'react';
import { Token } from '../types';
import { Copy, Check, Info, Binary, Cpu } from 'lucide-react';

interface TokenDisplayProps {
  tokens: Token[];
  hoveredTokenIndex: number | null;
  onHoverToken: (index: number | null) => void;
  selectedToken: Token | null;
  onSelectToken: (token: Token | null) => void;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  tokens,
  hoveredTokenIndex,
  onHoverToken,
  selectedToken,
  onSelectToken
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyIds = () => {
    const ids = tokens.map(t => t.id).join(', ');
    navigator.clipboard.writeText(`[${ids}]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (tokens.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 rounded-xl border border-dashed border-slate-800 bg-slate-900/40">
        Type something in the input box above to see the token breakdown.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <span>
            Total Tokens: <strong className="text-cyan-400 font-mono text-sm">{tokens.length}</strong>
          </span>
          <span>
            Avg Chars/Token:{' '}
            <strong className="text-slate-200 font-mono">
              {(tokens.reduce((acc, t) => acc + t.rawText.length, 0) / tokens.length).toFixed(1)}
            </strong>
          </span>
          <span className="hidden sm:inline-flex items-center text-slate-500">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5 animate-pulse"></span>
            Leading space represented as &apos;·&apos;
          </span>
        </div>

        <button
          onClick={handleCopyIds}
          className="flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Token IDs!' : 'Copy Token IDs'}</span>
        </button>
      </div>

      {/* Token Chips Cloud */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 min-h-[110px] flex flex-wrap gap-2 items-center content-start">
        {tokens.map((token, idx) => {
          const isHovered = hoveredTokenIndex === idx;
          const isSelected = selectedToken?.id === token.id && selectedToken?.startIndex === token.startIndex;

          return (
            <button
              key={`${token.id}-${token.startIndex}-${idx}`}
              onMouseEnter={() => onHoverToken(idx)}
              onMouseLeave={() => onHoverToken(null)}
              onClick={() => onSelectToken(isSelected ? null : token)}
              className={`group relative inline-flex items-center px-2.5 py-1.5 rounded-lg font-mono text-xs border transition-all duration-150 cursor-pointer select-none token-chip ${
                token.colorClass
              } ${
                isHovered || isSelected
                  ? 'ring-2 ring-cyan-400 scale-105 z-10 shadow-lg shadow-cyan-500/20'
                  : 'opacity-90 hover:opacity-100'
              } ${token.isUnk ? 'animate-pulse' : ''}`}
            >
              <span className="font-semibold">{token.text}</span>
              <span className="ml-1.5 px-1 py-0.2 rounded bg-black/40 text-[10px] opacity-75 font-mono text-slate-300">
                {token.id}
              </span>

              {token.isUnk && (
                <span className="ml-1 text-[9px] px-1 rounded bg-red-900/80 text-red-200 uppercase font-bold">
                  OOV
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Token Inspector Card */}
      {selectedToken && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900/90 to-slate-900/50 border border-cyan-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-slate-200">
                Token Inspector:{' '}
                <span className="font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                  {selectedToken.text}
                </span>
              </h4>
            </div>
            <button
              onClick={() => onSelectToken(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Token ID (Index)</span>
              <span className="text-cyan-400 text-base font-bold">{selectedToken.id}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Character Span</span>
              <span className="text-slate-200 text-sm">
                [{selectedToken.startIndex} : {selectedToken.endIndex}] ({selectedToken.rawText.length} chars)
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Type</span>
              <span className="text-indigo-400 text-sm">
                {selectedToken.isUnk ? 'Unknown (OOV)' : selectedToken.isSubword ? 'Subword Morpheme' : 'Word / Symbol'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">UTF-8 Byte Length</span>
              <span className="text-emerald-400 text-sm">
                {new TextEncoder().encode(selectedToken.rawText).length} Bytes
              </span>
            </div>
          </div>

          {/* Vector Sample Heatmap */}
          {selectedToken.vectorSample && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center">
                  <Binary className="w-3.5 h-3.5 text-purple-400 mr-1" />
                  Embedding Vector Slice ($d_{'{0..7}'}$ of high-dim space):
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Normalized L2 = 1.0</span>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {selectedToken.vectorSample.map((val, dimIdx) => {
                  const isPositive = val >= 0;
                  const intensity = Math.min(100, Math.round(Math.abs(val) * 100));
                  return (
                    <div
                      key={dimIdx}
                      className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center"
                      title={`Dimension ${dimIdx}: ${val}`}
                    >
                      <div
                        className={`h-1.5 rounded-full mb-1 ${
                          isPositive ? 'bg-cyan-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${intensity}%`, margin: '0 auto' }}
                      />
                      <span className="text-[10px] font-mono text-slate-300">
                        {val.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
