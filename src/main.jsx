import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const words = [
  { word: 'cat', emoji: '🐱', letters: 'tca' },
  { word: 'sun', emoji: '☀️', letters: 'uns' },
  { word: 'dog', emoji: '🐶', letters: 'gdo' },
  { word: 'fish', emoji: '🐟', letters: 'hsif' },
  { word: 'moon', emoji: '🌙', letters: 'onmo' },
  { word: 'star', emoji: '⭐', letters: 'rtsa' },
  { word: 'apple', emoji: '🍎', letters: 'pealp' },
  { word: 'frog', emoji: '🐸', letters: 'gorf' },
];

const canSpeak = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof window.SpeechSynthesisUtterance === 'function';

function App() {
  const [wordIndex, setWordIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [speechMessage, setSpeechMessage] = useState(
    canSpeak() ? '' : 'Speaking is not available in this browser.',
  );
  const current = words[wordIndex];
  const spelling = selected.map((index) => current.letters[index]).join('');
  const isComplete = selected.length === current.word.length;
  const isCorrect = isComplete && spelling === current.word;

  useEffect(() => () => {
    if (canSpeak()) window.speechSynthesis.cancel();
  }, []);

  function chooseWord(index) {
    if (canSpeak()) window.speechSynthesis.cancel();
    setWordIndex(index);
    setSelected([]);
    setSpeechMessage(canSpeak() ? '' : 'Speaking is not available in this browser.');
  }

  function speakWord() {
    if (!canSpeak()) {
      setSpeechMessage('Speaking is not available in this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(current.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.onerror = (event) => {
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setSpeechMessage('Oops! The word could not be spoken. Please try again.');
        }
      };
      window.speechSynthesis.speak(utterance);
      setSpeechMessage('');
    } catch {
      setSpeechMessage('Oops! The word could not be spoken. Please try again.');
    }
  }

  return (
    <main className="app">
      <header className="top">
        <div className="brand"><span aria-hidden="true">✦</span> little word coach</div>
        <span className="top-note">A little practice, a lot of fun!</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <span className="eyebrow">LET’S LEARN TOGETHER</span>
        <h1 id="page-title">Hello, word explorer! <span aria-hidden="true">👋</span></h1>
        <p>Listen, play, and spell a little word.</p>
      </section>

      <section className="activity" aria-labelledby="word-heading">
        <div className="activity-top">
          <span className="pill">WORD {wordIndex + 1} OF {words.length}</span>
          <span className="sparkle" aria-hidden="true">✦ ✧ ✦</span>
        </div>
        <div className="picture" aria-hidden="true">{current.emoji}</div>
        <p className="word-label" id="word-heading">Today’s word is</p>
        <div className="word">{current.word}</div>
        <button className="speak-button" onClick={speakWord} aria-label={`Hear ${current.word} spoken`}>
          <span aria-hidden="true">🔊</span> Hear the word
        </button>
        <p className="speech-message" role="status">{speechMessage}</p>

        <div className="divider" />

        <div className="practice">
          <span className="pencil" aria-hidden="true">✏️</span>
          <div>
            <h2>Can you spell it?</h2>
            <p>Tap the letters in the right order.</p>
          </div>
        </div>

        <div className="slots" aria-label={`Your spelling: ${spelling || 'empty'}`}>
          {Array.from({ length: current.word.length }, (_, index) => (
            <span className={`slot ${selected[index] !== undefined ? 'filled' : ''}`} key={index} aria-hidden="true">
              {selected[index] !== undefined ? current.letters[selected[index]] : ''}
            </span>
          ))}
        </div>

        <p className={`feedback ${isCorrect ? 'success' : ''}`} role="status" aria-live="polite">
          {isCorrect ? 'Hooray! You spelled it! 🌟' : isComplete ? 'Nice try! Let’s have another go. 💛' : 'You can do it!'}
        </p>

        <div className="letters" aria-label="Letter choices">
          {Array.from(current.letters, (letter, index) => (
            <button
              className="letter-button"
              key={index}
              disabled={selected.includes(index) || isComplete}
              onClick={() => setSelected([...selected, index])}
              aria-label={`Add letter ${letter.toUpperCase()}`}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="practice-actions">
          <button className="text-button" onClick={() => setSelected(selected.slice(0, -1))} disabled={!selected.length || isCorrect}>
            ← Take one back
          </button>
          <button className="text-button" onClick={() => setSelected([])} disabled={!selected.length}>
            ↻ Start again
          </button>
        </div>
      </section>

      <nav className="word-navigation" aria-label="Choose a word">
        <div className="navigation-heading">
          <div>
            <h2>More little words</h2>
            <p>Pick one to play!</p>
          </div>
          <span aria-hidden="true">🌈</span>
        </div>
        <div className="word-list">
          {words.map((item, index) => (
            <button
              key={item.word}
              className={`word-choice ${index === wordIndex ? 'active' : ''}`}
              onClick={() => chooseWord(index)}
              aria-pressed={index === wordIndex}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.word}
            </button>
          ))}
        </div>
      </nav>
      <footer>Made for little learners <span aria-hidden="true">♥</span></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
