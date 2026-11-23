import { SpellingVsMeaningPair } from '../types';
import { calculateSpellingSimilarity, cosineSimilarity, generateDeterministicEmbedding } from '../utils/vectorMath';
import { EMBEDDINGS_DATA } from './embeddingsData';

const embeddingsLookup = new Map<string, number[]>();
EMBEDDINGS_DATA.forEach(p => embeddingsLookup.set(p.word.toLowerCase(), p.vector));

function getWordVector(word: string): number[] {
  const clean = word.toLowerCase().trim();
  if (embeddingsLookup.has(clean)) {
    return embeddingsLookup.get(clean)!;
  }
  return generateDeterministicEmbedding(clean, 8);
}

export function computeWordPairStats(w1: string, w2: string, customExplanation?: string): SpellingVsMeaningPair {
  const s1 = w1.trim();
  const s2 = w2.trim();
  const spellingSim = calculateSpellingSimilarity(s1, s2);
  const v1 = getWordVector(s1);
  const v2 = getWordVector(s2);
  const semanticSim = Number(cosineSimilarity(v1, v2).toFixed(3));

  let quadrant: 'surface-and-semantic' | 'spelling-trap' | 'semantic-synonym' | 'completely-unrelated';
  if (spellingSim >= 0.55 && semanticSim >= 0.45) {
    quadrant = 'surface-and-semantic';
  } else if (spellingSim >= 0.55 && semanticSim < 0.45) {
    quadrant = 'spelling-trap';
  } else if (spellingSim < 0.55 && semanticSim >= 0.45) {
    quadrant = 'semantic-synonym';
  } else {
    quadrant = 'completely-unrelated';
  }

  return {
    id: `${s1}_${s2}`,
    wordA: s1,
    wordB: s2,
    spellingSimilarity: Number(spellingSim.toFixed(3)),
    semanticSimilarity: semanticSim,
    quadrant,
    explanation: customExplanation || `Spelling similarity: ${(spellingSim * 100).toFixed(0)}%, Semantic similarity: ${(semanticSim * 100).toFixed(0)}%.`
  };
}

export const CURATED_PAIRS: SpellingVsMeaningPair[] = [
  // High Spelling, Low Meaning (Spelling Traps)
  computeWordPairStats('apple', 'apply', 'High character overlap ("appl-"), but apple is a fruit while apply is an action. Massive spelling trap!'),
  computeWordPairStats('horse', 'house', 'Only 1 character difference ("r" vs "u"), but one is an animal and one is human shelter.'),
  computeWordPairStats('plane', 'planet', 'Shares 5 letters, but a plane is a vehicle while a planet is an astronomical body.'),
  computeWordPairStats('cat', 'cot', '1 letter difference, but cat is a living animal while cot is furniture.'),

  // Low Spelling, High Meaning (Semantic Synonyms)
  computeWordPairStats('doctor', 'physician', 'Near-zero spelling overlap, but conceptually identical medical profession. Embeddings capture this effortlessly!'),
  computeWordPairStats('automobile', 'car', 'Completely different character strings, yet virtually synonymous in semantic space.'),
  computeWordPairStats('sofa', 'couch', 'Zero shared root, but identical living room furniture objects.'),
  computeWordPairStats('tiny', 'miniature', 'Different word lengths and origins, yet both describe small physical scale.'),

  // High Spelling, High Meaning (Surface & Semantic)
  computeWordPairStats('happy', 'happiness', 'Shared morphological root with related emotional meaning.'),
  computeWordPairStats('run', 'running', 'Verbal inflection sharing direct semantic and morphological structure.'),
  computeWordPairStats('compute', 'computer', 'Direct stem derivation relating to data calculation.'),

  // Low Spelling, Low Meaning (Completely Unrelated)
  computeWordPairStats('banana', 'quantum', 'Totally unrelated in both spelling structure and physical domain.'),
  computeWordPairStats('guitar', 'refrigerator', 'Distinct acoustic instrument vs household cooling appliance.')
];
