import React, { useState, useEffect } from 'react';
import { Token, PipelineStageId } from '../types';
import { TokenDisplay } from './TokenDisplay';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Cpu, 
  Database, 
  FileText, 
  Hash, 
  Layers, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PipelineSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  tokens: Token[];
  onOpenConcept: (conceptId: string) => void;
}

interface StageMeta {
  id: PipelineStageId;
  title: string;
  short: string;
  icon: React.ReactNode;
  hardware: string;
  description: string;
  formula?: string;
}

const STAGES: StageMeta[] = [
  {
    id: 'input',
    title: '1. User Input Text',
    short: 'Raw Text',
    icon: <FileText className="w-4 h-4 text-cyan-400" />,
    hardware: 'Host CPU / Web Client Memory',
    description: 'The raw, unstructured human language string encoded as UTF-8 bytes. Neural networks cannot process characters or letters directly.',
    formula: 'S = (c_1, c_2, ..., c_L) \\in \\Sigma^*'
  },
  {
    id: 'tokenize',
    title: '2. Tokenization',
    short: 'Subwords',
    icon: <Layers className="w-4 h-4 text-indigo-400" />,
    hardware: 'CPU Fast Trie / Regex Pre-tokenizer',
    description: 'Statistical BPE / WordPiece algorithms split the string into discrete atomic units (tokens), preserving whitespace prefixes and splitting rare words.',
    formula: '\\text{Tokenizer}(S) \\to (t_1, t_2, ..., t_N)'
  },
  {
    id: 'token_id',
    title: '3. Token IDs',
    short: 'Integer IDs',
    icon: <Hash className="w-4 h-4 text-purple-400" />,
    hardware: 'CPU-to-GPU PCIe Transfer Buffer',
    description: 'Each discrete token string is mapped to its unique non-negative integer identifier from the pre-trained vocabulary table.',
    formula: '\\mathbf{x} = [id(t_1), id(t_2), ..., id(t_N)] \\in \\mathbb{Z}^N'
  },
  {
    id: 'vocab_lookup',
    title: '4. Vocabulary Lookup',
    short: 'Vocab Index',
    icon: <Database className="w-4 h-4 text-emerald-400" />,
    hardware: 'GPU VRAM Embedding Weight Matrix',
    description: 'The token IDs act as direct integer row indices into the model’s static embedding matrix W_e, which holds V vectors of dimension d.',
    formula: 'W_e \\in \\mathbb{R}^{V \\times d}, \\quad \\mathbf{v}_i = W_e[id(t_i)]'
  },
  {
    id: 'embedding',
    title: '5. Vector Embeddings',
    short: 'Dense Vectors',
    icon: <Cpu className="w-4 h-4 text-amber-400" />,
    hardware: 'Tensor Cores / Transformer Input Layer',
    description: 'The extracted rows form a continuous dense tensor of shape [batch, sequence_length, hidden_dim]. Positional encodings are added here.',
    formula: 'E = [\\mathbf{v}_1, \\mathbf{v}_2, ..., \\mathbf{v}_N] + P \\in \\mathbb{R}^{N \\times d}'
  },
  {
    id: 'semantic',
    title: '6. Semantic Space',
    short: 'Geometry',
    icon: <Compass className="w-4 h-4 text-rose-400" />,
    hardware: 'Multi-Head Self-Attention Engine',
    description: 'Tokens are positioned in high-dimensional geometric space where dot products and cosine distance encode contextual semantic meaning and analogies.',
    formula: '\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}'
  }
];

export const PipelineSection: React.FC<PipelineSectionProps> = ({
  inputText,
  setInputText,
  tokens,
  onOpenConcept
}) => {
  const [activeStage, setActiveStage] = useState<PipelineStageId>('tokenize');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Auto-play stepper through stages
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStage(prev => {
          const idx = STAGES.findIndex(s => s.id === prev);
          const nextIdx = (idx + 1) % STAGES.length;
          return STAGES[nextIdx].id;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeStageMeta = STAGES.find(s => s.id === activeStage) || STAGES[1];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>End-to-End LLM Language Ingestion Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How Text Becomes <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Meaning</span> in an AI Model
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            LLMs do not read words like humans do. Step inside the pipeline to see how raw characters split into subword tokens, map to integer IDs, pull from billion-parameter embedding tables, and form continuous geometric thoughts.
          </p>
        </div>

        {/* Live Text Input Box */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <label htmlFor="pipeline-input" className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <span>Interactive Prompt Input:</span>
            </label>
            <div className="flex items-center space-x-3 font-mono">
              <span>{inputText.length} characters</span>
              <span>•</span>
              <span className="text-cyan-400 font-bold">{tokens.length} tokens</span>
              {inputText.length > 0 && (
                <button
                  onClick={() => setInputText('')}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="pipeline-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type any sentence, programming code, emojis, or multilingual text..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-500 font-sans text-sm resize-y outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Interactive Pipeline Stepper */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Pipeline Flow Architecture</span>
            </h2>
            <p className="text-xs text-slate-400">Click any stage to inspect its mathematical and hardware transformations.</p>
          </div>

          {/* Player controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-all shadow-md shadow-cyan-600/30"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Auto-Play Pipeline'}</span>
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setActiveStage('input');
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset to Input"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 6 Interactive Pipeline Stages Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {STAGES.map((stage, idx) => {
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStage(stage.id);
                }}
                className={`group relative p-3 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-cyan-500/80 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20' : 'bg-slate-900'}`}>
                    {stage.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {stage.short}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {stage.hardware.split('/')[0]}
                  </div>
                </div>

                {/* Connecting arrow for desktop */}
                {idx < STAGES.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep-Dive Card */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                {activeStageMeta.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{activeStageMeta.title}</h3>
                <span className="text-xs text-cyan-400 font-mono">Hardware: {activeStageMeta.hardware}</span>
              </div>
            </div>

            {activeStageMeta.formula && (
              <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300">
                {activeStageMeta.formula}
              </div>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {activeStageMeta.description}
          </p>

          {/* Stage-specific dynamic visualization preview */}
          <div className="pt-2">
            {activeStage === 'input' && (
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium block">Raw Character Stream (Hex / Char Boundaries):</span>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
                  {inputText || '(Empty text)'}
                </div>
              </div>
            )}

            {activeStage === 'tokenize' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Subword Boundary Visualizer (Hover tokens to highlight text):</span>
                  <button
                    onClick={() => onOpenConcept('subword-tokenization')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center space-x-1"
                  >
                    <span>Learn BPE Subwords</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <TokenDisplay
                  tokens={tokens}
                  hoveredTokenIndex={hoveredTokenIndex}
                  onHoverToken={setHoveredTokenIndex}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
              </div>
            )}

            {activeStage === 'token_id' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>GPU Tensor Payload ([batch_size, sequence_length]):</span>
                  <button
                    onClick={() => onOpenConcept('token-id')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center space-x-1"
                  >
                    <span>Why Numbers Matter</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
                  <div className="text-purple-400">
                    input_ids = torch.tensor([[
                    {tokens.map((t, idx) => (
                      <span key={idx} className="hover:text-cyan-300 transition-colors">
                        {t.id}{idx < tokens.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    ]], dtype=torch.long, device=&apos;cuda:0&apos;)
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Tensor Shape: [1, {tokens.length}] • Data Type: INT64 (8 bytes per ID) • Memory on GPU:{' '}
                    {(tokens.length * 8)} bytes
                  </div>
                </div>
              </div>
            )}

            {activeStage === 'vocab_lookup' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Embedding Matrix Row Slicing: W_e[ID]</span>
                  <button
                    onClick={() => onOpenConcept('vocabulary')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center space-x-1"
                  >
                    <span>Explore Vocabulary</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {tokens.slice(0, 6).map((t, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Row Index {t.id}</span>
                        <span className="text-emerald-400">VRAM Address</span>
                      </div>
                      <div className="text-slate-200 font-bold truncate">
                        Token: &quot;{t.text}&quot;
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Slices W_e[{t.id}, :] &rarr; vector in &reals;<sup>d</sup>
                      </div>
                    </div>
                  ))}
                  {tokens.length > 6 && (
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-xs flex items-center justify-center">
                      + {tokens.length - 6} more rows sliced in parallel
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeStage === 'embedding' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>High-Dimensional Hidden Representation Tensor:</span>
                  <button
                    onClick={() => onOpenConcept('embeddings')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center space-x-1"
                  >
                    <span>Vector Mechanics</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-300 font-mono">
                    Output Shape: [1, {tokens.length}, 4096] (FP16 Floats)
                  </div>
                  <div className="text-xs text-slate-400">
                    Each token is now represented by an array of 4,096 floating-point coordinates. Position embeddings ($P_i$) are added so the transformer knows word order.
                  </div>
                </div>
              </div>
            )}

            {activeStage === 'semantic' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Contextual Meaning & Semantic Coordinate Space:</span>
                  <button
                    onClick={() => onOpenConcept('spelling-vs-meaning')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center space-x-1"
                  >
                    <span>Spelling vs Meaning</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="text-xs text-slate-300">
                    In this final geometric space, semantic relationships emerge naturally. Words with similar meanings or shared contexts have high cosine similarity ($\\approx 1.0$), while unrelated concepts are orthogonal ($\\approx 0.0$).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
