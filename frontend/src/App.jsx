// frontend/src/App.jsx
import { useState } from 'react';
import { generateFlashcards } from './services/api';
import FlashcardQuiz from './components/FlashcardQuiz';

const STORAGE_KEY = 'study_assistant_saved_deck';

const SAMPLE_PROMPTS = [
  'Differences between REST and GraphQL APIs',
  'JavaScript Event Loop & Microtask Queue',
  'Photosynthesis light and dark reactions',
  'OSI 7-Layer Model overview'
];

function App() {
  const [inputValue, setInputValue] = useState('');
  
  // Lazy state initializers load saved deck synchronously on mount without useEffect cascading render
  const [flashcards, setFlashcards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
    return [];
  });

  const [deckId, setDeckId] = useState(() => (flashcards && flashcards.length > 0 ? 1 : 0));
  const [status, setStatus] = useState(() => (flashcards && flashcards.length > 0 ? 'success' : 'idle'));
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const cards = await generateFlashcards(inputValue);
      
      if (cards !== null) {
        if (cards.length === 0) {
          setStatus('idle');
          setFlashcards([]);
          localStorage.removeItem(STORAGE_KEY);
        } else {
          setFlashcards(cards);
          setDeckId(Date.now());
          setStatus('success');
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
          } catch {
            // Ignore storage write issues
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };

  const handleClearDeck = () => {
    setFlashcards([]);
    setDeckId(0);
    setStatus('idle');
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSampleClick = (prompt) => {
    setInputValue(prompt);
  };

  return (
    <main style={{ padding: '1.5rem', maxWidth: '640px', margin: '0 auto' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          ⚡ AI Study Assistant
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
          Turn your notes and topics into an interactive flashcard quiz in seconds.
        </p>
      </header>
      
      {/* Free-form text input container */}
      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label htmlFor="notes-input" style={{ fontWeight: '600', color: '#1f2937' }}>
          Paste your study notes or enter a topic:
        </label>
        <textarea
          id="notes-input"
          rows="5"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., Explain the difference between REST APIs and GraphQL with key benefits and drawbacks..."
          disabled={status === 'loading'}
          style={{ 
            width: '100%', 
            padding: '12px', 
            boxSizing: 'border-box', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            resize: 'vertical'
          }}
        />

        {/* Quick prompt ideas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Ideas:</span>
          {SAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSampleClick(prompt)}
              style={{
                fontSize: '0.75rem',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '3px 8px',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={status === 'loading' || !inputValue.trim()}
            style={{ 
              flex: 1,
              padding: '12px', 
              background: '#2563eb', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: status === 'loading' || !inputValue.trim() ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: status === 'loading' || !inputValue.trim() ? 0.6 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {status === 'loading' ? '⏳ Generating Flashcards...' : '🚀 Generate Flashcards'}
          </button>
          {flashcards.length > 0 && (
            <button
              type="button"
              onClick={handleClearDeck}
              style={{
                padding: '12px 16px',
                background: '#f3f4f6',
                color: '#4b5563',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Clear Deck
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: '1.5rem 0', borderColor: '#e5e7eb', borderTop: 'none' }} />

      {/* Stateful UI Views */}
      {status === 'loading' && (
        <div className="fade-in" style={{ textAlign: 'center', color: '#4b5563', padding: '2rem', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🤖</div>
          <strong>Parsing text & generating flashcards...</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
            Gemini AI is structuring your concepts into question and answer cards.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="fade-in" style={{ background: '#fef2f2', color: '#991b1b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <p style={{ margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>⚠️ Generation Failed</p>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', lineHeight: '1.4' }}>{errorMsg}</p>
          <button 
            onClick={handleGenerate} 
            style={{ marginTop: '12px', background: '#991b1b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
          >
            Retry Generation
          </button>
        </div>
      )}

      {status === 'success' && flashcards.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <FlashcardQuiz 
            key={deckId} 
            initialCards={flashcards} 
            onReset={() => setDeckId(Date.now())}
          />
        </div>
      )}
    </main>
  );
}

export default App;