export interface Token {
  id: number;
  text: string;         // The token string (may include 'Ġ' or '##' or ' ')
  rawText: string;      // The actual slice from user input
  startIndex: number;
  endIndex: number;
  colorClass: string;
  isSpecial?: boolean;
  isSubword?: boolean;
  isUnk?: boolean;
  byteLength?: number;
  vectorSample?: number[]; // e.g. first 8 dimensions of embedding vector
}

export type TokenizerType = 'bpe' | 'wordpiece' | 'word_naive' | 'char';

export type PipelineStageId = 
  | 'input' 
  | 'tokenize' 
  | 'token_id' 
  | 'vocab_lookup' 
  | 'embedding' 
  | 'semantic';

export interface PipelineStageInfo {
  id: PipelineStageId;
  title: string;
  shortDesc: string;
  icon: string;
  technicalSummary: string;
  hardwareRole: string; // e.g. "CPU String parser", "GPU Tensor index buffer", "VRAM Embedding weight table"
}

export interface ConceptItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  iconName: string;
  definition: string;
  internalMechanics: string[];
  realWorldExample: string;
  whyItMatters: string;
  misconception: {
    myth: string;
    reality: string;
  };
  interactiveWidgetId: string;
  keyTakeaways: string[];
}

export interface VectorPoint {
  id: string;
  word: string;
  category: 'animals' | 'royalty' | 'food' | 'tech' | 'geography' | 'emotions' | 'actions' | 'contrast';
  x: number; // 2D projection X (-1 to 1)
  y: number; // 2D projection Y (-1 to 1)
  vector: number[]; // 8-dim or 16-dim representation
  description: string;
}

export interface SpellingVsMeaningPair {
  id: string;
  wordA: string;
  wordB: string;
  spellingSimilarity: number; // 0 to 1 based on 1 - (Levenshtein / maxLen)
  semanticSimilarity: number; // -1 to 1 cosine similarity
  quadrant: 'surface-and-semantic' | 'spelling-trap' | 'semantic-synonym' | 'completely-unrelated';
  explanation: string;
}

export interface BPETokenFreq {
  pair: [string, string];
  pairKey: string;
  freq: number;
}

export interface BPEMergeHistory {
  step: number;
  pair: [string, string];
  merged: string;
  freq: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface VocabToken {
  id: number;
  token: string;
  display: string;
  category: 'common' | 'subword' | 'punctuation' | 'code' | 'special' | 'emoji';
  frequencyRank: number;
  byteLength: number;
}
