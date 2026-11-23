import { Token, TokenizerType } from '../types';
import { generateDeterministicEmbedding } from './vectorMath';

const TOKEN_COLORS = [
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/40 hover:bg-pink-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30',
  'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30',
  'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30',
];

// Dictionary of known subword splits for realistic BPE demonstration
const BPE_DECOMPOSITIONS: Record<string, string[]> = {
  'unbelievable': ['un', 'belie', 'vable'],
  'unbelievably': ['un', 'belie', 'vably'],
  'transformation': ['transform', 'ation'],
  'transformations': ['transform', 'ation', 's'],
  'transformer': ['transform', 'er'],
  'transformers': ['transform', 'er', 's'],
  'tokenization': ['token', 'ization'],
  'tokenizing': ['token', 'izing'],
  'tokenizers': ['token', 'izers'],
  'embeddings': ['embed', 'dings'],
  'embedding': ['embed', 'ding'],
  'dimensional': ['diment', 'ional'],
  'multidimensional': ['multi', 'diment', 'ional'],
  'understanding': ['under', 'standing'],
  'intelligence': ['intel', 'ligence'],
  'artificial': ['art', 'ific', 'ial'],
  'subword': ['sub', 'word'],
  'subwords': ['sub', 'words'],
  'vocabulary': ['vocab', 'ulary'],
  'misconception': ['mis', 'conception'],
  'misconceptions': ['mis', 'conception', 's'],
  'representation': ['represent', 'ation'],
  'representations': ['represent', 'ation', 's'],
  'supercalifragilistic': ['super', 'cali', 'frag', 'il', 'istic'],
  'cryptozoology': ['crypto', 'zoo', 'logy'],
  'antigravity': ['anti', 'grav', 'ity'],
  'chatgpt': ['Chat', 'G', 'PT'],
  'llm': ['LL', 'M'],
};

// Fixed small vocabulary for the Naïve Word Tokenizer to demo UNK
const NAIVE_DICTIONARY = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'cat', 'king', 'queen', 'man', 'woman',
  'apple', 'banana', 'orange', 'computer', 'python', 'code', 'paris', 'france', 'tokyo', 'japan',
  'happy', 'sad', 'joy', 'run', 'walk', 'jump', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'this', 'that', 'hello', 'world', 'ai', 'model', 'data', 'text', 'word', 'vector'
]);

/**
 * Deterministic hash ID generator for tokens
 */
function hashTokenToId(str: string, baseOffset = 1000): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return baseOffset + (Math.abs(hash) % 49000);
}

/**
 * BPE Tokenizer (GPT-4 / Llama style)
 * Preserves leading whitespace with '·' or 'Ġ', splits rare words into subwords,
 * falls back to characters or bytes, NEVER drops into UNK.
 */
export function tokenizeBPE(text: string): Token[] {
  if (!text) return [];

  // GPT-style regex segmenter: captures contractions, words, numbers, punctuation, whitespace
  const segmentRegex = /'s|'t|'re|'ve|'m|'ll|'d|[^\S\r\n]+|\p{L}+|\p{N}+|[^\s\p{L}\p{N}]+|\n+/gu;
  const segments: { chunk: string; start: number; end: number }[] = [];
  let match;

  while ((match = segmentRegex.exec(text)) !== null) {
    segments.push({
      chunk: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  const tokens: Token[] = [];
  let colorIdx = 0;

  for (let sIdx = 0; sIdx < segments.length; sIdx++) {
    const { chunk, start, end } = segments[sIdx];

    // If it is just whitespace (e.g. leading space before a word or spaces between words)
    if (/^\s+$/.test(chunk)) {
      // If next segment exists and is a word, BPE typically attaches space to following word (e.g. " word")
      if (sIdx + 1 < segments.length && !/^\s+$/.test(segments[sIdx + 1].chunk)) {
        // Lookahead and attach
        const nextSeg = segments[sIdx + 1];
        const combined = chunk + nextSeg.chunk;
        const subTokens = decomposeBPEWord(nextSeg.chunk, true, chunk.length);
        
        let localOffset = start;
        for (const sub of subTokens) {
          tokens.push({
            id: hashTokenToId(sub.token),
            text: sub.token,
            rawText: text.substring(localOffset, localOffset + sub.length),
            startIndex: localOffset,
            endIndex: localOffset + sub.length,
            colorClass: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
            isSubword: sub.isSubword,
            byteLength: new TextEncoder().encode(sub.token).length,
            vectorSample: generateDeterministicEmbedding(sub.token, 8)
          });
          localOffset += sub.length;
          colorIdx++;
        }
        sIdx++; // Skip next segment since we consumed it
        continue;
      } else {
        // Standalone whitespace
        tokens.push({
          id: 220 + chunk.length,
          text: chunk.replace(/ /g, '·').replace(/\t/g, '→').replace(/\n/g, '↵'),
          rawText: chunk,
          startIndex: start,
          endIndex: end,
          colorClass: 'bg-slate-800 text-slate-400 border-slate-700',
          byteLength: chunk.length,
          vectorSample: generateDeterministicEmbedding('space', 8)
        });
        continue;
      }
    }

    // Normal non-whitespace segment
    const subTokens = decomposeBPEWord(chunk, false, 0);
    let localOffset = start;
    for (const sub of subTokens) {
      tokens.push({
        id: hashTokenToId(sub.token),
        text: sub.token,
        rawText: text.substring(localOffset, localOffset + sub.length),
        startIndex: localOffset,
        endIndex: localOffset + sub.length,
        colorClass: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
        isSubword: sub.isSubword,
        byteLength: new TextEncoder().encode(sub.token).length,
        vectorSample: generateDeterministicEmbedding(sub.token, 8)
      });
      localOffset += sub.length;
      colorIdx++;
    }
  }

  return tokens;
}

function decomposeBPEWord(word: string, hasLeadingSpace: boolean, spaceLen: number): { token: string; isSubword: boolean; length: number }[] {
  const lower = word.toLowerCase();
  const prefix = hasLeadingSpace ? 'Ġ' : '';
  const displayPrefix = hasLeadingSpace ? '·' : '';

  // 1. Check if word has explicit subword rule
  if (BPE_DECOMPOSITIONS[lower]) {
    const parts = BPE_DECOMPOSITIONS[lower];
    let cursor = 0;
    return parts.map((p, idx) => {
      const matchLen = p.length;
      const originalSlice = word.substring(cursor, cursor + matchLen);
      cursor += matchLen;
      const isFirst = idx === 0;
      return {
        token: (isFirst ? displayPrefix : '') + originalSlice,
        isSubword: !isFirst,
        length: matchLen + (isFirst ? spaceLen : 0)
      };
    });
  }

  // 2. Common prefixes/suffixes heuristic
  if (word.length > 7) {
    if (lower.startsWith('un') && lower.length > 5) {
      return [
        { token: displayPrefix + word.substring(0, 2), isSubword: false, length: 2 + spaceLen },
        { token: word.substring(2), isSubword: true, length: word.length - 2 }
      ];
    }
    if (lower.endsWith('ing') && lower.length > 6) {
      return [
        { token: displayPrefix + word.substring(0, word.length - 3), isSubword: false, length: word.length - 3 + spaceLen },
        { token: word.substring(word.length - 3), isSubword: true, length: 3 }
      ];
    }
    if (lower.endsWith('tion') && lower.length > 7) {
      return [
        { token: displayPrefix + word.substring(0, word.length - 4), isSubword: false, length: word.length - 4 + spaceLen },
        { token: word.substring(word.length - 4), isSubword: true, length: 4 }
      ];
    }
  }

  // 3. Single token (common word or symbol)
  return [{
    token: displayPrefix + word,
    isSubword: false,
    length: word.length + spaceLen
  }];
}

/**
 * WordPiece Tokenizer (BERT style with '##' prefix)
 */
export function tokenizeWordPiece(text: string): Token[] {
  if (!text) return [];
  const words = text.match(/\S+|\s+/g) || [];
  const tokens: Token[] = [];
  let colorIdx = 0;
  let charCursor = 0;

  for (const w of words) {
    if (/^\s+$/.test(w)) {
      charCursor += w.length;
      continue;
    }

    const cleanWord = w.replace(/[^\w]/g, '');
    const punctMatches = w.match(/^([^\w]*)([\w]*)([^\w]*)$/);
    const leadingPunct = punctMatches ? punctMatches[1] : '';
    const core = punctMatches ? punctMatches[2] : w;
    const trailingPunct = punctMatches ? punctMatches[3] : '';

    if (leadingPunct) {
      for (const p of leadingPunct) {
        tokens.push({
          id: hashTokenToId(p, 500),
          text: p,
          rawText: p,
          startIndex: charCursor,
          endIndex: charCursor + 1,
          colorClass: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
          vectorSample: generateDeterministicEmbedding(p)
        });
        charCursor++;
        colorIdx++;
      }
    }

    if (core) {
      const lower = core.toLowerCase();
      if (BPE_DECOMPOSITIONS[lower]) {
        const parts = BPE_DECOMPOSITIONS[lower];
        let localOffset = 0;
        parts.forEach((part, idx) => {
          const slice = core.substring(localOffset, localOffset + part.length);
          const isSub = idx > 0;
          tokens.push({
            id: hashTokenToId((isSub ? '##' : '') + slice, 1200),
            text: (isSub ? '##' : '') + slice,
            rawText: slice,
            startIndex: charCursor,
            endIndex: charCursor + slice.length,
            colorClass: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
            isSubword: isSub,
            vectorSample: generateDeterministicEmbedding(slice)
          });
          localOffset += slice.length;
          charCursor += slice.length;
          colorIdx++;
        });
      } else {
        tokens.push({
          id: hashTokenToId(core, 1200),
          text: core,
          rawText: core,
          startIndex: charCursor,
          endIndex: charCursor + core.length,
          colorClass: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
          vectorSample: generateDeterministicEmbedding(core)
        });
        charCursor += core.length;
        colorIdx++;
      }
    }

    if (trailingPunct) {
      for (const p of trailingPunct) {
        tokens.push({
          id: hashTokenToId(p, 500),
          text: p,
          rawText: p,
          startIndex: charCursor,
          endIndex: charCursor + 1,
          colorClass: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
          vectorSample: generateDeterministicEmbedding(p)
        });
        charCursor++;
        colorIdx++;
      }
    }
  }

  return tokens;
}

/**
 * Naive Word Tokenizer (Dictionary-based, showing explicit <UNK> for unknown words)
 */
export function tokenizeWordNaive(text: string): Token[] {
  if (!text) return [];
  const words = text.match(/\S+|\s+/g) || [];
  const tokens: Token[] = [];
  let colorIdx = 0;
  let charCursor = 0;

  for (const w of words) {
    if (/^\s+$/.test(w)) {
      charCursor += w.length;
      continue;
    }

    const clean = w.replace(/[^\w]/g, '').toLowerCase();
    const isKnown = NAIVE_DICTIONARY.has(clean);

    if (isKnown) {
      tokens.push({
        id: hashTokenToId(clean, 100),
        text: w,
        rawText: w,
        startIndex: charCursor,
        endIndex: charCursor + w.length,
        colorClass: TOKEN_COLORS[colorIdx % TOKEN_COLORS.length],
        isUnk: false,
        vectorSample: generateDeterministicEmbedding(clean)
      });
      colorIdx++;
    } else {
      // Unknown word -> <UNK>
      tokens.push({
        id: 1, // Traditional UNK ID
        text: '<UNK>',
        rawText: w,
        startIndex: charCursor,
        endIndex: charCursor + w.length,
        colorClass: 'bg-red-500/20 text-red-300 border-red-500/60 ring-1 ring-red-500/30',
        isUnk: true,
        vectorSample: [0, 0, 0, 0, 0, 0, 0, 0] // Zero or random uninformative vector
      });
    }
    charCursor += w.length;
  }

  return tokens;
}

/**
 * Character-level Tokenizer (1 char = 1 token)
 */
export function tokenizeChar(text: string): Token[] {
  if (!text) return [];
  const chars = Array.from(text);
  let offset = 0;
  return chars.map((ch, idx) => {
    const isSpace = ch === ' ';
    const isNewline = ch === '\n';
    const display = isSpace ? '·' : isNewline ? '↵' : ch;
    const token: Token = {
      id: ch.charCodeAt(0),
      text: display,
      rawText: ch,
      startIndex: offset,
      endIndex: offset + ch.length,
      colorClass: TOKEN_COLORS[idx % TOKEN_COLORS.length],
      vectorSample: generateDeterministicEmbedding(ch)
    };
    offset += ch.length;
    return token;
  });
}

/**
 * Master dispatcher
 */
export function tokenizeByStrategy(text: string, strategy: TokenizerType): Token[] {
  switch (strategy) {
    case 'bpe': return tokenizeBPE(text);
    case 'wordpiece': return tokenizeWordPiece(text);
    case 'word_naive': return tokenizeWordNaive(text);
    case 'char': return tokenizeChar(text);
  }
}
