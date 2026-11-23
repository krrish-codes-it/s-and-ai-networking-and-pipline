import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'How do modern LLMs (like GPT-4 and LLaMA 3) handle a completely novel nonsense word or typo like "zxcvbnm123"?',
    options: [
      'They replace the entire word with an <UNK> token.',
      'They crash and throw an out-of-bounds CUDA exception.',
      'They decompose the word into smaller subwords or raw UTF-8 byte tokens.',
      'They silently delete the word from the prompt.'
    ],
    correctIndex: 2,
    explanation: 'Modern models use Byte-Pair Encoding (BPE) with byte-level fallback. If a word or sequence has never been seen, it decomposes smoothly into syllables or individual UTF-8 bytes (0x00 to 0xFF), completely eliminating <UNK> tokens!',
    conceptTag: 'Subword & UNK'
  },
  {
    id: 2,
    question: 'Why does " apple" (with a leading space) receive a different Token ID than "apple" (without a space)?',
    options: [
      'Spaces are always deleted before tokenization.',
      'Because spaces are preserved as part of the token itself (e.g. "Ġapple") to maintain precise text reconstruction without ambiguity.',
      'It is a bug in the BPE tokenizer algorithm.',
      'The model only recognizes words that start with a capital letter.'
    ],
    correctIndex: 1,
    explanation: 'In LLM tokenizers (like GPT\'s byte-level BPE), whitespace is preserved directly inside tokens (using symbols like "Ġ" or "·"). This allows the model to differentiate words beginning a sentence from words inside a sentence, and enables exact lossless detokenization.',
    conceptTag: 'Tokens & IDs'
  },
  {
    id: 3,
    question: 'If a model has a vocabulary size of V = 128,000 and hidden dimension d = 4,096, how many parameters are stored in the token embedding matrix alone?',
    options: [
      '128,000 parameters',
      '524,288,000 parameters (~524 Million)',
      '4,096 parameters',
      '31.25 parameters'
    ],
    correctIndex: 1,
    explanation: 'The embedding matrix has dimensions V × d. Multiplying 128,000 × 4,096 = 524,288,000 parameters! In 16-bit precision (FP16), this single table consumes over 1.05 GB of GPU VRAM before any attention layers are loaded.',
    conceptTag: 'Vocabulary Size'
  },
  {
    id: 4,
    question: 'What is the fundamental difference between spelling similarity and embedding cosine similarity?',
    options: [
      'There is no difference; spelling similarity directly determines embedding vectors.',
      'Spelling measures character-level edit distance, while embedding similarity measures alignment in semantic meaning space.',
      'Spelling similarity applies only to nouns, while embeddings apply to verbs.',
      'Cosine similarity is always negative for words with identical letters.'
    ],
    correctIndex: 1,
    explanation: 'Words like "horse" and "house" have high spelling similarity (80%) but virtually zero semantic overlap. Words like "automobile" and "car" have 0% spelling similarity but near 100% semantic similarity in embedding space.',
    conceptTag: 'Spelling vs Meaning'
  },
  {
    id: 5,
    question: 'What is the purpose of vector arithmetic in embedding space, such as King - Man + Woman?',
    options: [
      'To calculate the average letter count of the three words.',
      'To demonstrate that linear geometric directions in vector space correspond to semantic relations (like gender and royalty), yielding Queen.',
      'To compress the text into fewer tokens.',
      'To check for grammatical typos in user input.'
    ],
    correctIndex: 1,
    explanation: 'Embeddings map semantic attributes along linear dimensional directions. Subtracting the male vector from King removes masculine connotations, and adding Woman yields a vector closest to Queen!',
    conceptTag: 'Vector Embeddings'
  },
  {
    id: 6,
    question: 'What is the "Multilingual Token Tax"?',
    options: [
      'A literal government fee charged on non-English internet connections.',
      'The phenomenon where non-Latin scripts (e.g. Hindi, Japanese, Arabic) are split into more subwords/bytes than English, causing higher API costs and shorter effective context lengths.',
      'The rule that all non-English words must be translated into English before tokenization.',
      'A memory leak that occurs when processing emojis.'
    ],
    correctIndex: 1,
    explanation: 'Because earlier vocabularies were trained predominantly on English web text, non-Latin words get fragmented into many subwords or bytes. The same sentence in Hindi or Arabic could take 2-4x as many tokens as English, costing users more money and consuming context window space.',
    conceptTag: 'Vocabulary & Multilingual'
  }
];
