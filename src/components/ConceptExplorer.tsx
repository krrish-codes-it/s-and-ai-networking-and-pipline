import React, { useState } from 'react';
import { CONCEPTS_DATA } from '../data/conceptsData';
import { 
  Boxes, 
  BookOpen, 
  Hash, 
  HelpCircle, 
  Scissors, 
  Sliders, 
  Network, 
  GitCompare,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface ConceptExplorerProps {
  initialConceptId?: string;
  onNavigateToTab: (tab: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Boxes: <Boxes className="w-5 h-5 text-cyan-400" />,
  BookOpen: <BookOpen className="w-5 h-5 text-indigo-400" />,
  Hash: <Hash className="w-5 h-5 text-purple-400" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-red-400" />,
  Scissors: <Scissors className="w-5 h-5 text-emerald-400" />,
  Sliders: <Sliders className="w-5 h-5 text-amber-400" />,
  Network: <Network className="w-5 h-5 text-blue-400" />,
  GitCompare: <GitCompare className="w-5 h-5 text-rose-400" />,
};

export const ConceptExplorer: React.FC<ConceptExplorerProps> = ({
  initialConceptId,
  onNavigateToTab
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    initialConceptId || 'token'
  );

  const concept = CONCEPTS_DATA.find(c => c.id === selectedConceptId) || CONCEPTS_DATA[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800 text-indigo-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Complete Curriculum Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          The 8 Fundamental Pillars of LLM Language Processing
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Master each concept through simple definitions, internal mechanics, real-world examples, and common misconceptions.
        </p>
      </div>

      {/* Concept Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {CONCEPTS_DATA.map((item) => {
          const isSelected = item.id === selectedConceptId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedConceptId(item.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500/80 ring-2 ring-indigo-500/30 shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-500">0{item.number}</span>
                <div className="p-1 rounded bg-slate-900">
                  {ICON_MAP[item.iconName]}
                </div>
              </div>
              <div className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                {item.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Concept Dossier Card */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 space-y-6">
        {/* Title Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-800 shadow-md">
              {ICON_MAP[concept.iconName]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase text-indigo-400 font-semibold">
                  Module 0{concept.number}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{concept.subtitle}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{concept.title}</h3>
            </div>
          </div>

          {/* Jump to interactive playground button */}
          <button
            onClick={() => {
              if (concept.id === 'subword-tokenization') onNavigateToTab('bpe');
              else if (concept.id === 'unk-token') onNavigateToTab('playground');
              else if (concept.id === 'vocab-size') onNavigateToTab('vocab-size');
              else if (concept.id === 'embeddings') onNavigateToTab('embeddings');
              else if (concept.id === 'spelling-vs-meaning') onNavigateToTab('spelling');
              else onNavigateToTab('pipeline');
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/30"
          >
            <span>Open Interactive Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Simple Definition */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
            <Lightbulb className="w-4 h-4" />
            <span>1. Simple Definition</span>
          </h4>
          <p className="text-base text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {concept.definition}
          </p>
        </div>

        {/* 2. How it works internally */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
            <Zap className="w-4 h-4" />
            <span>2. How It Works Internally (Algorithm & Hardware Mechanics)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {concept.internalMechanics.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Real-World Example & Why it matters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Real-World Example</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {concept.realWorldExample}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <Sliders className="w-4 h-4" />
              <span>4. Why It Matters in an LLM</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {concept.whyItMatters}
            </p>
          </div>
        </div>

        {/* 5. Common Misconception (Myth vs Reality) */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>5. Common Misconception</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-rose-900/30">
              <span className="text-rose-400 font-bold block mb-1">❌ Common Myth:</span>
              <p className="text-slate-400">{concept.misconception.myth}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/30">
              <span className="text-emerald-400 font-bold block mb-1">✅ Technical Reality:</span>
              <p className="text-slate-300">{concept.misconception.reality}</p>
            </div>
          </div>
        </div>

        {/* 6. Key Takeaways */}
        <div className="pt-2">
          <span className="text-xs text-slate-400 font-semibold block mb-2">Key Takeaways:</span>
          <div className="flex flex-wrap gap-2">
            {concept.keyTakeaways.map((point, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
