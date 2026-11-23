import React from 'react';
import { Cpu, BookOpen, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">TokenLab</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              An interactive visual laboratory created to explain how human language transforms into tokens, tensor IDs, and high-dimensional semantic vector spaces inside Large Language Models.
            </p>
          </div>

          {/* Academic References */}
          <div className="space-y-2">
            <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">
              Academic & Technical Foundations
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <span className="text-slate-300 font-medium">BPE for NLP:</span> Sennrich et al. (2016) - <em>Subword Units</em>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Transformer Architecture:</span> Vaswani et al. (2017) - <em>Attention Is All You Need</em>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Word Embeddings:</span> Mikolov et al. (2013) - <em>Word2Vec Vector Space</em>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Fast Tokenizer:</span> OpenAI <em>tiktoken</em> (Byte-level BPE)
              </li>
            </ul>
          </div>

          {/* Transparency & Disclaimer */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Technical Accuracy & Data Disclosure</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tokenization is performed client-side using accurate Byte-Pair Encoding (GPT/LLaMA regex rules), WordPiece, and dictionary tokenizers. 2D vector coordinate spaces and analogies are calibrated for educational clarity and intuition rather than querying proprietary 1536-dim production model endpoints.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            Built for AI students, researchers, and engineers exploring LLM internals.
          </div>
          <div className="flex items-center space-x-1">
            <span>Designed with precision</span>
            <span>• 100% Client-Side Interactive AI Lab</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
