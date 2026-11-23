import { BPETokenFreq, BPEMergeHistory } from '../types';

export interface BPEWordEntry {
  tokens: string[];
  freq: number;
}

export class BPETrainerEngine {
  private initialWords: { word: string; freq: number }[];
  private currentCorpus: BPEWordEntry[];
  private merges: BPEMergeHistory[];
  private baseVocabulary: Set<string>;

  constructor(sampleText?: string) {
    this.initialWords = [];
    this.currentCorpus = [];
    this.merges = [];
    this.baseVocabulary = new Set();
    this.init(sampleText || 'low lower lowest newest wider');
  }

  public init(text: string) {
    this.merges = [];
    this.baseVocabulary = new Set();

    // Split words and count frequencies
    const wordCounts = new Map<string, number>();
    const words = text.trim().toLowerCase().split(/\s+/).filter(Boolean);
    for (const w of words) {
      wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
    }

    this.initialWords = Array.from(wordCounts.entries()).map(([word, freq]) => ({ word, freq }));

    // Prepare corpus: each word is split into individual characters with '</w>' end marker
    this.currentCorpus = this.initialWords.map(({ word, freq }) => {
      const chars = word.split('');
      chars.push('</w>');
      chars.forEach(ch => this.baseVocabulary.add(ch));
      return {
        tokens: chars,
        freq
      };
    });
  }

  public getPairFrequencies(): BPETokenFreq[] {
    const pairMap = new Map<string, { pair: [string, string]; freq: number }>();

    for (const entry of this.currentCorpus) {
      const tokens = entry.tokens;
      for (let i = 0; i < tokens.length - 1; i++) {
        const p: [string, string] = [tokens[i], tokens[i + 1]];
        const key = `${p[0]}|||${p[1]}`;
        const existing = pairMap.get(key);
        if (existing) {
          existing.freq += entry.freq;
        } else {
          pairMap.set(key, { pair: p, freq: entry.freq });
        }
      }
    }

    const list: BPETokenFreq[] = Array.from(pairMap.entries()).map(([key, data]) => ({
      pairKey: key,
      pair: data.pair,
      freq: data.freq
    }));

    // Sort descending by frequency
    return list.sort((a, b) => b.freq - a.freq);
  }

  public stepMerge(): BPEMergeHistory | null {
    const pairs = this.getPairFrequencies();
    if (pairs.length === 0) return null;

    const topPair = pairs[0];
    if (topPair.freq <= 0) return null;

    const [a, b] = topPair.pair;
    const merged = a + b;

    // Apply merge across corpus
    for (const entry of this.currentCorpus) {
      const newTokens: string[] = [];
      let i = 0;
      while (i < entry.tokens.length) {
        if (
          i < entry.tokens.length - 1 &&
          entry.tokens[i] === a &&
          entry.tokens[i + 1] === b
        ) {
          newTokens.push(merged);
          i += 2;
        } else {
          newTokens.push(entry.tokens[i]);
          i += 1;
        }
      }
      entry.tokens = newTokens;
    }

    const mergeRecord: BPEMergeHistory = {
      step: this.merges.length + 1,
      pair: [a, b],
      merged,
      freq: topPair.freq
    };

    this.merges.push(mergeRecord);
    return mergeRecord;
  }

  public getCorpus(): BPEWordEntry[] {
    return this.currentCorpus;
  }

  public getMerges(): BPEMergeHistory[] {
    return this.merges;
  }

  public getVocabulary(): string[] {
    const vocab = new Set<string>(this.baseVocabulary);
    for (const m of this.merges) {
      vocab.add(m.merged);
    }
    return Array.from(vocab);
  }
}
