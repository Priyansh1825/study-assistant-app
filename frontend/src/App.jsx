// frontend/src/App.jsx
import { useState } from 'react';
import { generateFlashcards } from './services/api';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const cards = await generateFlashcards(inputValue);
      
      // If cards is null, it means the request was intentionally aborted by a newer action
      if (cards !== null) {
        if (cards.length === 0) {
          setStatus('idle'); // Empty state fallback
          setFlashcards([]);
        } else {
          setFlashcards(cards);
          setStatus('success');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };

  return (
    <main style={{ padding: '1rem' }}>
      <h1>⚡ AI Study Assistant</h1>
      
      {/* Free-form text input container */}
      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label htmlFor="notes-input" style={{ fontWeight: '600' }}>
          Paste your study notes or a topic below:
        </label>
        <textarea
          id="notes-input"
          rows="6"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., Explain the difference between REST APIs and GraphQL..."
          disabled={status === 'loading'}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          disabled={status === 'loading' || !inputValue.trim()}
          style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {status === 'loading' ? 'Generating Flashcards...' : 'Generate Flashcards'}
        </button>
      </form>

      <hr style={{ margin: '2rem 0', borderColor: '#e5e7eb' }} />

      {/* Stateful UI Views */}
      {status === 'loading' && (
        <div style={{ textAlign: 'center', color: '#4b5563', padding: '1rem' }}>
          ⏳ Parsing text and constructing your interactive study set...
        </div>
      )}

      {status === 'error' && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '6px', border: '1px solid #fca5a5' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>⚠️ Generation Failed</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{errorMsg}</p>
          <button 
            onClick={handleGenerate} 
            style={{ marginTop: '10px', background: '#991b1b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Retry Generation
          </button>
        </div>
      )}

      {status === 'success' && flashcards.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>✨ Interactive Flashcards Ready ({flashcards.length})</h2>
          {/* We will build the physical interactive Flashcard Component next */}
          <div style={{ padding: '20px', background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '6px', textAlign: 'center' }}>
            [Interactive Component Container Placeholder]
          </div>
        </div>
      )}
    </main>
  );
}

export default App;