/**
 * Levenshtein distance computation for spelling similarity
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Normalized spelling similarity from 0.0 (totally different) to 1.0 (identical)
 */
export function calculateSpellingSimilarity(w1: string, w2: string): number {
  const s1 = w1.trim().toLowerCase();
  const s2 = w2.trim().toLowerCase();
  if (s1 === s2) return 1.0;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Dot product of two vectors
 */
export function dotProduct(v1: number[], v2: number[]): number {
  const minLen = Math.min(v1.length, v2.length);
  let sum = 0;
  for (let i = 0; i < minLen; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
}

/**
 * Euclidean magnitude / L2 norm of a vector
 */
export function vectorMagnitude(v: number[]): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

/**
 * Cosine similarity between two vectors (-1.0 to 1.0)
 */
export function cosineSimilarity(v1: number[], v2: number[]): number {
  const mag1 = vectorMagnitude(v1);
  const mag2 = vectorMagnitude(v2);
  if (mag1 === 0 || mag2 === 0) return 0;
  const sim = dotProduct(v1, v2) / (mag1 * mag2);
  // Clamp to [-1, 1] to avoid float precision anomalies
  return Math.max(-1, Math.min(1, sim));
}

/**
 * Vector addition: v1 + v2
 */
export function vectorAdd(v1: number[], v2: number[]): number[] {
  const len = Math.min(v1.length, v2.length);
  const result: number[] = new Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = v1[i] + v2[i];
  }
  return result;
}

/**
 * Vector subtraction: v1 - v2
 */
export function vectorSubtract(v1: number[], v2: number[]): number[] {
  const len = Math.min(v1.length, v2.length);
  const result: number[] = new Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = v1[i] - v2[i];
  }
  return result;
}

/**
 * Normalize vector to unit length
 */
export function normalizeVector(v: number[]): number[] {
  const mag = vectorMagnitude(v);
  if (mag === 0) return v.slice();
  return v.map(x => x / mag);
}

/**
 * Generates a deterministic unit vector for any arbitrary word
 * Uses a string hash to seed a pseudo-random distribution
 */
export function generateDeterministicEmbedding(word: string, dims = 8): number[] {
  let hash = 2166136261;
  const str = word.toLowerCase().trim();
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  const vec: number[] = [];
  let current = Math.abs(hash);
  for (let i = 0; i < dims; i++) {
    // Simple LCG PRNG
    current = (current * 1664525 + 1013904223) % 4294967296;
    const val = (current / 4294967296) * 2 - 1; // -1 to 1
    vec.push(Number(val.toFixed(4)));
  }

  return normalizeVector(vec);
}
