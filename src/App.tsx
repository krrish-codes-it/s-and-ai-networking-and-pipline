import React, { useState, useMemo } from 'react';
import { Navbar, PRESET_EXAMPLES } from './components/Navbar';
import { PipelineSection } from './components/PipelineSection';
import { ConceptExplorer } from './components/ConceptExplorer';
import { TokenizerPlayground } from './components/TokenizerPlayground';
import { BpeMergeLab } from './components/BpeMergeLab';
import { EmbeddingVisualizer } from './components/EmbeddingVisualizer';
import { SpellingVsMeaning } from './components/SpellingVsMeaning';
import { VocabSizeSimulator } from './components/VocabSizeSimulator';
import { VocabularyExplorer } from './components/VocabularyExplorer';
import { QuizSection } from './components/QuizSection';
import { Footer } from './components/Footer';
import { tokenizeBPE } from './utils/tokenizers';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('pipeline');
  const [inputText, setInputText] = useState<string>(
    'The quick brown fox jumps over the lazy dog.'
  );
  const [selectedConceptId, setSelectedConceptId] = useState<string>('token');

  // Real-time BPE tokenization
  const tokens = useMemo(() => {
    return tokenizeBPE(inputText);
  }, [inputText]);

  const handleOpenConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setActiveTab('concepts');
  };

  const handleSelectPreset = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'pipeline' && (
          <PipelineSection
            inputText={inputText}
            setInputText={setInputText}
            tokens={tokens}
            onOpenConcept={handleOpenConcept}
          />
        )}

        {activeTab === 'concepts' && (
          <div className="space-y-12">
            <ConceptExplorer
              initialConceptId={selectedConceptId}
              onNavigateToTab={setActiveTab}
            />
            {/* Embedded Vocabulary Explorer at the bottom of Concepts */}
            <div className="pt-8 border-t border-slate-800">
              <VocabularyExplorer />
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <TokenizerPlayground initialText={inputText} />
        )}

        {activeTab === 'bpe' && (
          <BpeMergeLab />
        )}

        {activeTab === 'embeddings' && (
          <EmbeddingVisualizer />
        )}

        {activeTab === 'spelling' && (
          <SpellingVsMeaning />
        )}

        {activeTab === 'vocab-size' && (
          <VocabSizeSimulator />
        )}

        {activeTab === 'quiz' && (
          <QuizSection />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
