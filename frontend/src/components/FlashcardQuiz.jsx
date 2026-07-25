// frontend/src/components/FlashcardQuiz.jsx
import { useState, useEffect } from 'react';

export default function FlashcardQuiz({ initialCards }) {
  // Manage the deck currently being tested (swaps to wrong answers on re-test)
  const [currentDeck, setCurrentDeck] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Track incorrect cards to facilitate the re-test requirement
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  // Reset the component state if the user generates an entirely new set of notes
  useEffect(() => {
    setCurrentDeck(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setWrongAnswers([]);
    setCorrectCount(0);
    setIsRoundOver(false);
    setRoundNumber(1);
  }, [initialCards]);

  const currentCard = currentDeck[currentIndex];

  const handleAnswer = (wasCorrect) => {
    if (wasCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      // Save the complete card reference so we can re-test it later
      setWrongAnswers((prev) => [...prev, currentCard]);
    }

    // Advance to next card or end the round
    if (currentIndex + 1 < currentDeck.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsRoundOver(true);
    }
  };

  const handleStartReTest = () => {
    setCurrentDeck(wrongAnswers);
    setCurrentIndex(0);
    setIsFlipped(false);
    setWrongAnswers([]);
    setCorrectCount(0);
    setIsRoundOver(false);
    setRoundNumber((prev) => prev + 1);
  };

  // 1. Completion State View
  if (isRoundOver) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3>🎉 Round {roundNumber} Completed!</h3>
        <p style={{ fontSize: '1.1rem' }}>
          Score: <strong style={{ color: '#10b981' }}>{correctCount}</strong> / {currentDeck.length} correct
        </p>

        {wrongAnswers.length > 0 ? (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ color: '#ef4444' }}>You have {wrongAnswers.length} card(s) that need review.</p>
            <button
              onClick={handleStartReTest}
              style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              🔄 Re-test Wrong Answers
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', color: '#10b981', fontWeight: '600' }}>
            ⭐ Perfect score! You've mastered this topic.
          </div>
        )}
      </div>
    );
  }

  // Fallback if deck becomes empty unexpectedly
  if (!currentCard) return null;

  // 2. Active Quiz State View
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Progress tracker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
        <span>Round {roundNumber}</span>
        <span>Card {currentIndex + 1} of {currentDeck.length}</span>
      </div>

      {/* Interactive Flipping Card Structure */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          minHeight: '200px',
          background: isFlipped ? '#f8fafc' : '#fff',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: '#94a3b8', marginBottom: '1rem', fontWeight: '700' }}>
          {isFlipped ? '💡 ANSWER' : '❓ QUESTION'}
        </span>
        <p style={{ fontSize: '1.25rem', fontWeight: '500', margin: 0 }}>
          {isFlipped ? currentCard.answer : currentCard.question}
        </p>
        <span style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '1.5rem', textDecoration: 'underline' }}>
          Click card to flip
        </span>
      </div>

      {/* Evaluation Controls */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
        <button
          onClick={() => handleAnswer(false)}
          style={{ flex: 1, padding: '12px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          ❌ Got it Wrong
        </button>
        <button
          onClick={() => handleAnswer(true)}
          style={{ flex: 1, padding: '12px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          ✅ Got it Right
        </button>
      </div>
    </div>
  );
}