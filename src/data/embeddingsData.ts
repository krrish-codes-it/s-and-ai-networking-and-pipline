import { VectorPoint } from '../types';
import { normalizeVector } from '../utils/vectorMath';

// Helper to define 8-dimensional calibrated vectors
// Dimensions conceptually correspond to:
// [0: Royalty/Status, 1: Female/Gender, 2: Living/Animal, 3: Domestic/Pet, 4: Technology/Abstract, 5: Food/Edible, 6: Geography/Capital, 7: Emotional Valence]
function v(coords: number[]): number[] {
  return normalizeVector(coords);
}

export const EMBEDDINGS_DATA: VectorPoint[] = [
  // --- Royalty & Gender Cluster ---
  {
    id: 'king',
    word: 'king',
    category: 'royalty',
    x: 0.65,
    y: 0.70,
    vector: v([0.92, -0.65, 0.40, 0.05, 0.10, -0.10, 0.35, 0.30]),
    description: 'Male monarch, ruler of kingdom.'
  },
  {
    id: 'queen',
    word: 'queen',
    category: 'royalty',
    x: 0.62,
    y: 0.88,
    vector: v([0.91, 0.70, 0.40, 0.05, 0.10, -0.10, 0.35, 0.35]),
    description: 'Female monarch, ruler of kingdom.'
  },
  {
    id: 'man',
    word: 'man',
    category: 'royalty',
    x: 0.42,
    y: 0.35,
    vector: v([0.15, -0.70, 0.45, 0.10, 0.12, -0.05, 0.10, 0.20]),
    description: 'Adult human male.'
  },
  {
    id: 'woman',
    word: 'woman',
    category: 'royalty',
    x: 0.38,
    y: 0.55,
    vector: v([0.16, 0.68, 0.45, 0.10, 0.12, -0.05, 0.10, 0.25]),
    description: 'Adult human female.'
  },
  {
    id: 'prince',
    word: 'prince',
    category: 'royalty',
    x: 0.75,
    y: 0.58,
    vector: v([0.80, -0.55, 0.40, 0.05, 0.10, -0.08, 0.25, 0.40]),
    description: 'Son of a monarch.'
  },
  {
    id: 'princess',
    word: 'princess',
    category: 'royalty',
    x: 0.72,
    y: 0.78,
    vector: v([0.79, 0.60, 0.40, 0.05, 0.10, -0.08, 0.25, 0.45]),
    description: 'Daughter of a monarch.'
  },

  // --- Animals Cluster ---
  {
    id: 'dog',
    word: 'dog',
    category: 'animals',
    x: -0.65,
    y: 0.45,
    vector: v([-0.10, 0.0, 0.92, 0.88, -0.40, -0.20, -0.10, 0.60]),
    description: 'Canine companion animal.'
  },
  {
    id: 'puppy',
    word: 'puppy',
    category: 'animals',
    x: -0.60,
    y: 0.58,
    vector: v([-0.10, 0.0, 0.90, 0.95, -0.40, -0.20, -0.10, 0.85]),
    description: 'Young juvenile dog.'
  },
  {
    id: 'cat',
    word: 'cat',
    category: 'animals',
    x: -0.75,
    y: 0.38,
    vector: v([-0.05, 0.10, 0.91, 0.85, -0.38, -0.20, -0.10, 0.55]),
    description: 'Feline companion animal.'
  },
  {
    id: 'kitten',
    word: 'kitten',
    category: 'animals',
    x: -0.70,
    y: 0.52,
    vector: v([-0.05, 0.10, 0.89, 0.92, -0.38, -0.20, -0.10, 0.80]),
    description: 'Young juvenile cat.'
  },
  {
    id: 'wolf',
    word: 'wolf',
    category: 'animals',
    x: -0.80,
    y: 0.65,
    vector: v([0.20, -0.10, 0.94, -0.60, -0.30, -0.10, -0.15, -0.10]),
    description: 'Wild apex canine predator.'
  },
  {
    id: 'lion',
    word: 'lion',
    category: 'animals',
    x: -0.72,
    y: 0.75,
    vector: v([0.45, -0.20, 0.95, -0.55, -0.30, -0.10, -0.10, 0.10]),
    description: 'Wild apex feline predator, king of the jungle.'
  },
  {
    id: 'elephant',
    word: 'elephant',
    category: 'animals',
    x: -0.85,
    y: 0.25,
    vector: v([0.10, 0.0, 0.90, -0.20, -0.40, 0.20, -0.10, 0.40]),
    description: 'Large land mammal with trunk.'
  },

  // --- Food & Fruits Cluster ---
  {
    id: 'apple',
    word: 'apple',
    category: 'food',
    x: -0.55,
    y: -0.65,
    vector: v([-0.10, 0.05, -0.30, 0.10, -0.20, 0.94, -0.10, 0.45]),
    description: 'Round edible pomaceous fruit.'
  },
  {
    id: 'banana',
    word: 'banana',
    category: 'food',
    x: -0.62,
    y: -0.72,
    vector: v([-0.10, 0.0, -0.30, 0.08, -0.20, 0.93, -0.10, 0.42]),
    description: 'Curved yellow tropical fruit.'
  },
  {
    id: 'orange',
    word: 'orange',
    category: 'food',
    x: -0.48,
    y: -0.68,
    vector: v([-0.10, 0.02, -0.30, 0.09, -0.20, 0.92, -0.10, 0.44]),
    description: 'Citrus fruit with sweet/tart flavor.'
  },
  {
    id: 'pizza',
    word: 'pizza',
    category: 'food',
    x: -0.38,
    y: -0.80,
    vector: v([-0.05, 0.0, -0.20, 0.30, -0.10, 0.96, 0.10, 0.70]),
    description: 'Baked flat dough with cheese and sauce.'
  },
  {
    id: 'burger',
    word: 'burger',
    category: 'food',
    x: -0.30,
    y: -0.82,
    vector: v([-0.05, 0.0, -0.15, 0.25, -0.10, 0.95, 0.05, 0.65]),
    description: 'Patty served inside a sliced bun.'
  },

  // --- Tech & AI Cluster ---
  {
    id: 'computer',
    word: 'computer',
    category: 'tech',
    x: 0.55,
    y: -0.45,
    vector: v([0.05, 0.0, -0.80, -0.40, 0.94, -0.30, 0.10, 0.20]),
    description: 'Electronic device for processing data.'
  },
  {
    id: 'python',
    word: 'python',
    category: 'tech',
    x: 0.68,
    y: -0.38,
    vector: v([0.05, 0.0, -0.40, -0.20, 0.92, -0.25, 0.05, 0.35]),
    description: 'Popular programming language in AI & data science.'
  },
  {
    id: 'neural',
    word: 'neural',
    category: 'tech',
    x: 0.72,
    y: -0.52,
    vector: v([0.08, 0.0, -0.20, -0.30, 0.95, -0.20, 0.05, 0.25]),
    description: 'Relating to biological or artificial neurons.'
  },
  {
    id: 'network',
    word: 'network',
    category: 'tech',
    x: 0.60,
    y: -0.58,
    vector: v([0.05, 0.0, -0.30, -0.30, 0.91, -0.20, 0.15, 0.15]),
    description: 'Interconnected system of computing nodes.'
  },
  {
    id: 'algorithm',
    word: 'algorithm',
    category: 'tech',
    x: 0.78,
    y: -0.42,
    vector: v([0.10, 0.0, -0.60, -0.35, 0.96, -0.25, 0.10, 0.30]),
    description: 'Step-by-step mathematical recipe to solve a task.'
  },
  {
    id: 'transformer',
    word: 'transformer',
    category: 'tech',
    x: 0.82,
    y: -0.55,
    vector: v([0.12, 0.0, -0.50, -0.30, 0.97, -0.20, 0.05, 0.40]),
    description: 'Attention-based neural architecture powering modern LLMs.'
  },

  // --- Geography / Capitals Cluster (Vector Analogies) ---
  {
    id: 'paris',
    word: 'paris',
    category: 'geography',
    x: 0.15,
    y: -0.60,
    vector: v([0.35, 0.10, -0.20, 0.10, 0.15, 0.30, 0.95, 0.50]),
    description: 'Capital and largest city of France.'
  },
  {
    id: 'france',
    word: 'france',
    category: 'geography',
    x: 0.05,
    y: -0.72,
    vector: v([0.20, 0.05, -0.15, 0.05, 0.10, 0.25, 0.80, 0.40]),
    description: 'Western European nation.'
  },
  {
    id: 'tokyo',
    word: 'tokyo',
    category: 'geography',
    x: 0.28,
    y: -0.70,
    vector: v([0.35, 0.10, -0.20, 0.10, 0.50, 0.30, 0.92, 0.55]),
    description: 'Bustling capital of Japan.'
  },
  {
    id: 'japan',
    word: 'japan',
    category: 'geography',
    x: 0.18,
    y: -0.82,
    vector: v([0.20, 0.05, -0.15, 0.05, 0.45, 0.25, 0.78, 0.45]),
    description: 'Island nation in East Asia.'
  },
  {
    id: 'london',
    word: 'london',
    category: 'geography',
    x: 0.08,
    y: -0.52,
    vector: v([0.38, 0.05, -0.20, 0.10, 0.20, 0.25, 0.94, 0.45]),
    description: 'Capital of England and the United Kingdom.'
  },
  {
    id: 'england',
    word: 'england',
    category: 'geography',
    x: -0.02,
    y: -0.64,
    vector: v([0.25, 0.02, -0.15, 0.05, 0.15, 0.20, 0.82, 0.35]),
    description: 'Country that is part of the United Kingdom.'
  },

  // --- Emotions Cluster ---
  {
    id: 'joy',
    word: 'joy',
    category: 'emotions',
    x: -0.20,
    y: 0.72,
    vector: v([0.05, 0.15, 0.20, 0.20, -0.10, 0.10, 0.05, 0.96]),
    description: 'Feeling of great pleasure and happiness.'
  },
  {
    id: 'happy',
    word: 'happy',
    category: 'emotions',
    x: -0.12,
    y: 0.68,
    vector: v([0.05, 0.10, 0.20, 0.20, -0.10, 0.10, 0.05, 0.94]),
    description: 'Feeling or showing contentment.'
  },
  {
    id: 'sad',
    word: 'sad',
    category: 'emotions',
    x: -0.25,
    y: 0.15,
    vector: v([-0.05, -0.10, 0.15, 0.10, -0.10, -0.10, -0.05, -0.92]),
    description: 'Feeling or showing sorrow or unhappiness.'
  },
  {
    id: 'grief',
    word: 'grief',
    category: 'emotions',
    x: -0.32,
    y: 0.08,
    vector: v([-0.08, -0.12, 0.12, 0.05, -0.10, -0.15, -0.05, -0.95]),
    description: 'Deep sorrow, especially caused by someone’s death.'
  },

  // --- Spelling Trap / Contrast Words ---
  {
    id: 'apply',
    word: 'apply',
    category: 'contrast',
    x: 0.35,
    y: -0.15,
    vector: v([0.0, 0.0, -0.20, -0.10, 0.60, -0.50, 0.0, 0.10]),
    description: 'To submit an application or put into operation.'
  },
  {
    id: 'application',
    word: 'application',
    category: 'contrast',
    x: 0.42,
    y: -0.20,
    vector: v([0.0, 0.0, -0.25, -0.10, 0.75, -0.45, 0.0, 0.15]),
    description: 'Formal request or computer software program.'
  },
  {
    id: 'house',
    word: 'house',
    category: 'contrast',
    x: -0.15,
    y: -0.25,
    vector: v([0.05, 0.0, -0.40, 0.30, 0.10, 0.10, 0.25, 0.30]),
    description: 'Building for human habitation.'
  },
  {
    id: 'horse',
    word: 'horse',
    category: 'contrast',
    x: -0.68,
    y: 0.22,
    vector: v([0.15, 0.0, 0.93, 0.40, -0.40, -0.10, 0.0, 0.35]),
    description: 'Solid-hoofed herbivorous quadruped mammal.'
  }
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  royalty: { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-600/40', glow: 'rgba(168, 85, 247, 0.5)' },
  animals: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-600/40', glow: 'rgba(16, 185, 129, 0.5)' },
  food: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-600/40', glow: 'rgba(245, 158, 11, 0.5)' },
  tech: { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-600/40', glow: 'rgba(6, 182, 212, 0.5)' },
  geography: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-600/40', glow: 'rgba(59, 130, 246, 0.5)' },
  emotions: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-600/40', glow: 'rgba(244, 63, 94, 0.5)' },
  contrast: { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-700', glow: 'rgba(148, 163, 184, 0.3)' }
};
