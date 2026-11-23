import { ConceptItem } from '../types';

export const CONCEPTS_DATA: ConceptItem[] = [
  {
    id: 'token',
    number: 1,
    title: 'Token',
    subtitle: 'The fundamental atomic unit of LLM cognition',
    iconName: 'Boxes',
    definition: 'A token is the smallest chunk of text that an LLM processes at once. Rather than reading raw letters or full sentences, models break text into tokens—which can be whole words, subwords, single characters, punctuation marks, or even single bytes.',
    internalMechanics: [
      'A tokenizer algorithm scans the input string and splits it into predictable fragments using predefined merge rules or statistical tables.',
      'Tokens frequently preserve whitespace markers (such as the "Ġ" symbol in GPT or " " in SentencePiece) to differentiate standalone words from word-internal syllables.',
      'In modern English corpora, 1 token averages approximately 4 characters or roughly 0.75 words.',
      'Byte-level tokenizers encode uncommon characters or emojis as individual UTF-8 bytes (1 to 4 tokens per character).'
    ],
    realWorldExample: 'The word "unbelievable" is sliced into 3 subword tokens: ["un", "belie", "vable"]. The word "ChatGPT" becomes 3 tokens: ["Chat", "G", "PT"]. The emoji 🚀 is broken into 3 byte tokens or a single dedicated emoji token depending on vocab size.',
    whyItMatters: 'Every API query has a token limit (context window) and is billed per token. Token boundaries dictate how well a model can perform arithmetic, spell backwards, rhyme, or process programming languages.',
    misconception: {
      myth: 'One token is always equal to one word.',
      reality: 'Tokens are subwords. Rare words, numbers (e.g. "12849" -> ["12", "849"]), code snippets, and foreign scripts often split into multiple tokens.'
    },
    interactiveWidgetId: 'token-inspector',
    keyTakeaways: [
      'Models never see raw strings—they receive discrete token chunks.',
      'Leading spaces are part of the token itself (e.g., " apple" vs "apple").',
      'Non-English languages often require significantly more tokens per sentence.'
    ]
  },
  {
    id: 'vocabulary',
    number: 2,
    title: 'Vocabulary',
    subtitle: 'The finite dictionary of recognized language elements',
    iconName: 'BookOpen',
    definition: 'The vocabulary is the complete, immutable set of all tokens that a trained model is capable of recognizing. It acts as the bilingual dictionary between human strings and neural network integers.',
    internalMechanics: [
      'Constructed before model training begins using an unsupervised algorithm (e.g., BPE, WordPiece, Unigram) on massive web text.',
      'Stored as a hash map / trie on the CPU host for ultra-fast string-to-integer conversion.',
      'Includes normal language tokens alongside "Special Tokens" that control execution flow (e.g., <|endoftext|>, <pad>, <bos>, <eos>, <|im_start|>).',
      'Once model pretraining starts, the vocabulary is locked permanently because the embedding layer dimensions are fixed.'
    ],
    realWorldExample: 'GPT-2 used a vocabulary of 50,257 tokens. LLaMA 3 expanded to 128,256 tokens. GPT-4o utilizes ~200,000 tokens to vastly improve multilingual speed and coding compression.',
    whyItMatters: 'Vocabulary breadth determines token compression efficiency. A larger vocabulary reduces sequence length, which accelerates attention mechanisms ($O(N^2)$), but swells the embedding matrix parameter footprint.',
    misconception: {
      myth: 'The model can invent new tokens on the fly when it encounters new slang.',
      reality: 'The vocabulary is fixed at training time. New slang is decomposed into smaller existing subwords or byte sequences from the frozen vocabulary.'
    },
    interactiveWidgetId: 'vocab-explorer',
    keyTakeaways: [
      'Vocabularies are fixed during pretraining and cannot be dynamically enlarged.',
      'Special tokens guide conversational roles, system prompts, and sequence boundaries.',
      'Larger vocabularies compress text more efficiently into fewer tokens.'
    ]
  },
  {
    id: 'token-id',
    number: 3,
    title: 'Token ID',
    subtitle: 'Translating human symbols into GPU tensor integers',
    iconName: 'Hash',
    definition: 'A Token ID is a unique non-negative integer assigned to each token in the vocabulary. Neural networks are mathematical engines that can only compute matrix multiplications on numbers—never on string characters.',
    internalMechanics: [
      'Each token in the vocabulary corresponds to a specific row index: $i \\in [0, V - 1]$ where $V$ is vocabulary size.',
      'The tokenizer converts a sentence into an array of integers: e.g., "The cat sat" $\\to [40, 108, 2390]$.',
      'These IDs are batched into a 2D integer tensor of shape `[batch_size, sequence_length]`.',
      'The GPU uses this integer as a direct array index offset to look up the token\'s high-dimensional vector in memory.'
    ],
    realWorldExample: 'In GPT tokenizers, the word "apple" might be assigned ID 17180, while " apple" (with a leading space) has a completely distinct ID: 30545.',
    whyItMatters: 'Token IDs are the exact payloads sent across the PCI Express bus into the GPU VRAM. They are also the raw categorical prediction target of the model\'s final softmax output layer.',
    misconception: {
      myth: 'Higher token IDs mean the word is more important or larger in magnitude.',
      reality: 'Token IDs are arbitrary index positions with zero scalar meaning. ID 5000 is not "ten times greater" than ID 500—they are categorical lookup addresses.'
    },
    interactiveWidgetId: 'token-id-table',
    keyTakeaways: [
      'Token IDs are categorical integer indexes, not continuous scalar values.',
      'Space-prefixed tokens receive entirely different IDs than bare tokens.',
      'The final layer of an LLM outputs logits across all possible Token IDs.'
    ]
  },
  {
    id: 'unk-token',
    number: 4,
    title: 'UNK Token',
    subtitle: 'Out-Of-Vocabulary handling & why modern LLMs eliminated it',
    iconName: 'HelpCircle',
    definition: 'The <UNK> (Unknown) token is a placeholder used when a tokenizer encounters a word or character missing from its vocabulary. While historical NLP relied heavily on <UNK>, modern LLMs use byte-level fallback to virtually eradicate it.',
    internalMechanics: [
      'Early word-level NLP models (Word2Vec, early LSTMs) kept fixed 50k dictionaries of full words. Any typo (e.g. "teh") or rare name was replaced with `<UNK>`.',
      'Replacing a word with `<UNK>` destroys all semantic information—the model sees an empty black box.',
      'Modern Byte-Pair Encoding (BPE) handles unseen text by splitting it into smaller known subwords.',
      'If a character has never been seen before (e.g. rare unicode or emoji), Byte-level BPE breaks it into raw UTF-8 bytes (0x00 to 0xFF), which are all pre-allocated in the vocabulary.'
    ],
    realWorldExample: 'Typing "neurocryptology" into an old word-level model produced `[<UNK>]`. In GPT-4, it cleanly splits into `["neuro", "crypt", "ology"]`, preserving full semantic understanding.',
    whyItMatters: 'Eliminating `<UNK>` tokens was one of the critical breakthroughs enabling LLMs to execute code, comprehend foreign languages, withstand typos, and parse arbitrary binary formats.',
    misconception: {
      myth: 'Modern ChatGPT outputs <UNK> when you invent a nonsense word.',
      reality: 'ChatGPT never produces <UNK> because its tokenizer has byte-level fallback covering all 256 byte values, ensuring 100% tokenization coverage.'
    },
    interactiveWidgetId: 'unk-simulator',
    keyTakeaways: [
      '<UNK> tokens cause catastrophic information loss in language models.',
      'Modern subword tokenizers have 0% out-of-vocabulary rate thanks to byte fallbacks.',
      'Typos and rare words decompose smoothly into syllables rather than failing.'
    ]
  },
  {
    id: 'subword-tokenization',
    number: 5,
    title: 'Subword Tokenization',
    subtitle: 'The sweet spot between character-level and word-level encoding',
    iconName: 'Scissors',
    definition: 'Subword tokenization is a hybrid strategy that keeps frequent words intact as single tokens while decomposing rare or complex words into smaller meaningful subword components (stems, prefixes, suffixes).',
    internalMechanics: [
      'Algorithms like Byte Pair Encoding (BPE) start with an initial alphabet of individual characters.',
      'The algorithm iteratively scans training text to count the most frequently occurring adjacent pair of tokens.',
      'The most frequent pair is merged into a single new subword token (e.g., "e" + "s" $\\to$ "es").',
      'This process repeats for tens of thousands of merge operations until the desired vocabulary size is achieved.'
    ],
    realWorldExample: 'The root word "play" is a single token. Derived words use subwords: "player" $\\to$ ["play", "er"], "unplayable" $\\to$ ["un", "play", "able"]. The model learns the shared semantic root "play" across all variations.',
    whyItMatters: 'Balances vocabulary size against sequence length. Character-level models yield enormous sequences that overwhelm attention layers; word-level models suffer from infinite out-of-vocabulary words.',
    misconception: {
      myth: 'Subword tokenizers understand linguistic grammar and syllable rules.',
      reality: 'BPE and WordPiece are purely statistical frequency mergers. They do not know English phonetics; they just recognize which character strings frequently co-occur.'
    },
    interactiveWidgetId: 'bpe-merge-playground',
    keyTakeaways: [
      'Subwords share morphological roots, improving generalization on unseen words.',
      'BPE is trained statistically by merging the most frequent character pairs.',
      'Solves the trade-off between sequence length explosion and vocabulary explosion.'
    ]
  },
  {
    id: 'vocab-size',
    number: 6,
    title: 'Vocabulary Size',
    subtitle: 'The engineering balance of parameter memory vs sequence length',
    iconName: 'Sliders',
    definition: 'Vocabulary size ($V$) is the total count of distinct tokens supported by the model. Choosing $V$ involves a major engineering trade-off between parameter memory footprint, attention compute latency, and multilingual equity.',
    internalMechanics: [
      'The embedding layer is a matrix $W_e \\in \\mathbb{R}^{V \\times d_{\\text{model}}}$. If $V = 128{,}000$ and $d = 4096$, the embedding table alone consumes $524{,}288{,}000$ parameters (over 1 GB in FP16).',
      'The final unembedding/LM-head layer requires another matrix of identical size $W_u \\in \\mathbb{R}^{d \\times V}$ (unless tied).',
      'Small vocabularies (e.g. 32k in LLaMA 1) produce long token sequences for non-English scripts (Hindi, Japanese, Arabic) because they get split into many small fragments ("Token Tax").',
      'Modern frontier models expand to 100k-256k tokens, compressing code and non-English text by up to 40%.'
    ],
    realWorldExample: 'Writing "hello" in English costs 1 token. In Hindi, "नमस्ते" might cost 1 token in a 256k tokenizer, but 6 tokens in a 32k tokenizer! The Hindi user is effectively charged 6x higher API cost for the same message.',
    whyItMatters: 'Context length is expensive ($O(N^2)$ attention). Compressing prompts into fewer tokens saves GPU inference time and allows users to fit longer documents into the model context.',
    misconception: {
      myth: 'Bigger vocabulary size is always strictly better with no downsides.',
      reality: 'Enormous vocabularies dilute training data across rare tokens and consume massive GPU VRAM on embedding tables, reducing parameters available for reasoning layers.'
    },
    interactiveWidgetId: 'vocab-size-simulator',
    keyTakeaways: [
      'Embedding layer memory scales linearly with vocabulary size ($V \\times d$).',
      'A larger vocabulary reduces token sequence length, speeding up attention compute.',
      'Expanded vocabularies in modern LLMs dramatically reduce the multilingual "Token Tax".'
    ]
  },
  {
    id: 'embeddings',
    number: 7,
    title: 'Vector / Embedding',
    subtitle: 'Projecting discrete symbols into continuous geometric meaning',
    iconName: 'Network',
    definition: 'An embedding is a dense, high-dimensional numerical vector (e.g., 768, 1536, or 4096 real numbers) that represents a token in continuous mathematical space. In this space, geometric distance reflects semantic relationship.',
    internalMechanics: [
      'The token ID acts as an index into the model\'s Embedding Matrix $W_e$, retrieving the corresponding row vector.',
      'Unlike sparse one-hot vectors ($[0, 0, 1, 0, \\dots]$), embeddings are dense arrays of continuous floating-point numbers.',
      'During training, backpropagation adjusts these vector weights so that semantically related concepts gravitate toward similar coordinates.',
      'Dot products and Cosine Similarity $\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$ measure semantic alignment between tokens.'
    ],
    realWorldExample: 'In embedding space, $\\vec{\\text{apple}}$ is geometrically close to $\\vec{\\text{banana}}$ (both fruits), while $\\vec{\\text{apple}}$ is far from $\\vec{\\text{quantum}}$. Famous vector arithmetic: $\\vec{\\text{King}} - \\vec{\\text{Man}} + \\vec{\\text{Woman}} \\approx \\vec{\\text{Queen}}$.',
    whyItMatters: 'Embeddings bridge discrete human text with differential calculus. Without embeddings, neural networks could not compute analogies, cluster ideas, or calculate contextual attention.',
    misconception: {
      myth: 'Individual numbers in an embedding correspond to simple human words like "fluffiness" or "color".',
      reality: 'Dimensions are polysemantic and distributed. Meaning is represented across complex linear combinations of hundreds of dimensions simultaneously.'
    },
    interactiveWidgetId: 'embedding-space-visualizer',
    keyTakeaways: [
      'Embeddings convert categorical token IDs into dense geometric vectors.',
      'Tokens with similar meanings or contexts cluster closely together in space.',
      'High-dimensional vector arithmetic enables structural analogies (King - Man + Woman = Queen).'
    ]
  },
  {
    id: 'spelling-vs-meaning',
    number: 8,
    title: 'Spelling vs Meaning',
    subtitle: 'Surface string edit distance vs latent semantic similarity',
    iconName: 'GitCompare',
    definition: 'Spelling-based similarity measures how many characters two words share (surface syntax via Levenshtein distance), whereas meaning-based similarity measures how closely two concepts relate in semantic concept space (embedding cosine distance).',
    internalMechanics: [
      'Spelling similarity: Evaluates character insertions, deletions, and substitutions (e.g. "horse" vs "house" are 80% spelling-identical).',
      'Semantic similarity: Evaluates directional cosine alignment of vectors trained on billions of sentences (e.g. "horse" vs "stallion" are 95% semantically identical).',
      'Spelling traps occur when words look identical but have unrelated meanings (e.g., "bark" [tree] vs "bark" [dog], "apple" vs "apply").',
      'Synonyms have 0% spelling overlap but 95%+ semantic alignment (e.g., "doctor" vs "physician", "automobile" vs "car").'
    ],
    realWorldExample: 'If you search a medical database for "renal failure", a spelling-based search will completely miss "kidney disease". A vector embedding search instantly understands they are semantically identical.',
    whyItMatters: 'Explains why LLMs excel at semantic synthesis and concept matching, but can stumble on character-level string manipulations like counting the letters "r" in "strawberry".',
    misconception: {
      myth: 'Tokens that share letters are automatically close in embedding space.',
      reality: 'Embeddings do not store letter shapes. "Apply" and "Apple" have entirely distinct embedding vectors positioned in completely different semantic clusters.'
    },
    interactiveWidgetId: 'spelling-meaning-quadrant',
    keyTakeaways: [
      'Surface spelling similarity does not imply semantic conceptual similarity.',
      'Embeddings map semantic intent, enabling semantic search and fuzzy reasoning.',
      'Understanding this distinction clarifies both the strengths and weaknesses of LLMs.'
    ]
  }
];
