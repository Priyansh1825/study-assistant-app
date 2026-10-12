import { useState, useEffect, useCallback } from 'react';

export default function FlashcardQuiz({ initialCards, onReset }) {
  const [currentDeck, setCurrentDeck] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  const currentCard = currentDeck[currentIndex];

  const handleAnswer = useCallback((wasCorrect) => {
    if (isRoundOver || !currentCard) return;

    if (wasCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [...prev, currentCard]);
    }

    if (currentIndex + 1 < currentDeck.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsRoundOver(true);
    }
  }, [isRoundOver, currentCard, currentIndex, currentDeck.length]);

  const handleStartReTest = useCallback(() => {
    setCurrentDeck(wrongAnswers);
    setCurrentIndex(0);
    setIsFlipped(false);
    setWrongAnswers([]);
    setCorrectCount(0);
    setIsRoundOver(false);
    setRoundNumber((prev) => prev + 1);
  }, [wrongAnswers]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if focus is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (isRoundOver) {
        if ((e.key === 'r' || e.key === 'R') && wrongAnswers.length > 0) {
          e.preventDefault();
          handleStartReTest();
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowLeft' || e.key === '1') {
        e.preventDefault();
        handleAnswer(false);
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        e.preventDefault();
        handleAnswer(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoundOver, wrongAnswers.length, isFlipped, handleAnswer, handleStartReTest]);

  // 1. Completion State View
  if (isRoundOver) {
    const accuracy = Math.round((correctCount / currentDeck.length) * 100) || 0;
    return (
      <div className="quiz-card fade-in" style={{ textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>🎉 Round {roundNumber} Completed!</h3>
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
          Score: <strong style={{ color: '#10b981' }}>{correctCount}</strong> / {currentDeck.length} correct ({accuracy}%)
        </p>

        {wrongAnswers.length > 0 ? (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <p style={{ color: '#ef4444', margin: 0 }}>You have {wrongAnswers.length} card(s) that need review.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleStartReTest}
                style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >
                🔄 Re-test Wrong Answers (Key: R)
              </button>
              {onReset && (
                <button
                  onClick={onReset}
                  style={{ padding: '10px 16px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Restart Original Deck
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <p style={{ color: '#10b981', fontWeight: '600', margin: 0 }}>
              ⭐ Perfect score! You have mastered this deck!
            </p>
            {onReset && (
              <button
                onClick={onReset}
                style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >
                Practice Again
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback if deck becomes empty unexpectedly
  if (!currentCard) return null;

  const progressPercent = Math.round(((currentIndex) / currentDeck.length) * 100);

  // 2. Active Quiz State View
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Progress tracker */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280', marginBottom: '6px' }}>
          <span>Round {roundNumber}</span>
          <span>Card {currentIndex + 1} of {currentDeck.length}</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              background: '#2563eb', 
              transition: 'width 0.3s ease' 
            }} 
          />
        </div>
      </div>

      {/* Interactive Flipping Card Structure */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        aria-label="Flashcard. Click or press space to flip"
        style={{
          minHeight: '220px',
          background: isFlipped ? '#f0fdf4' : '#ffffff',
          border: isFlipped ? '2px solid #86efac' : '2px solid #e2e8f0',
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
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: isFlipped ? '#16a34a' : '#64748b', marginBottom: '1rem', fontWeight: '700' }}>
          {isFlipped ? '💡 ANSWER' : '❓ QUESTION'}
        </span>
        <p style={{ fontSize: '1.25rem', fontWeight: '500', margin: 0, color: '#0f172a', lineHeight: '1.5' }}>
          {isFlipped ? currentCard.answer : currentCard.question}
        </p>
        <span style={{ fontSize: '0.8rem', color: '#2563eb', marginTop: '1.5rem' }}>
          👆 Click or press <kbd style={{ padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', fontSize: '0.75rem' }}>Space</kbd> to flip
        </span>
      </div>

      {/* Evaluation Controls */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => handleAnswer(false)}
          title="Press Left Arrow or 1"
          style={{ flex: 1, padding: '12px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          ❌ Needs Review (← / 1)
        </button>
        <button
          onClick={() => handleAnswer(true)}
          title="Press Right Arrow or 2"
          style={{ flex: 1, padding: '12px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          ✅ Mastered (→ / 2)
        </button>
      </div>

      {/* Keyboard Hint */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
        Shortcuts: <kbd>Space</kbd> Flip &bull; <kbd>←</kbd> Incorrect &bull; <kbd>→</kbd> Correct
      </div>
    </div>
  );
}