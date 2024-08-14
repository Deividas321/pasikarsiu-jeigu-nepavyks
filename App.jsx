import React, { useState, useEffect } from 'react';
import './App.css';

const words = ['react', 'hangman', 'javascript', 'programming'];

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [word, setWord] = useState(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const maxLives = 6;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/^[a-zA-Z]$/.test(key) && status === 'playing') {
        handleGuess(key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, guessedLetters]);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter)) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (word.includes(letter)) {
      const allGuessed = word.split('').every((char) => guessedLetters.includes(char) || char === letter);
      if (allGuessed) {
        setStatus('won');
        setWins(wins + 1);
      }
    } else {
      const newIncorrectGuesses = incorrectGuesses + 1;
      setIncorrectGuesses(newIncorrectGuesses);
      if (newIncorrectGuesses >= maxLives) {
        setStatus('lost');
        setLosses(losses + 1);
      }
    }
  };

  const handleRestart = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setStatus('playing');
  };

  const parts = [
    'head',
    'body',
    'left-arm',
    'right-arm',
    'left-leg',
    'right-leg'
  ];

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="hangman-game">
      <div className="status-bar">
        <p>Wins: {wins} | Losses: {losses}</p>
      </div>
      <div className="hangman-drawing">
        {parts.map((part, idx) => (
          <div key={part} className={`hangman-part ${incorrectGuesses > idx ? part : ''}`}></div>
        ))}
      </div>
      <div className="word">
        {word.split('').map((char, idx) => (
          <span key={idx} className="letter">
            {guessedLetters.includes(char) ? char : '_'}
          </span>
        ))}
      </div>
      <div className="keyboard">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            className={`key ${guessedLetters.includes(letter) ? (word.includes(letter) ? 'correct' : 'incorrect') : ''}`}
            disabled={guessedLetters.includes(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      {status !== 'playing' && (
        <div className="game-over">
          <p>{status === 'won' ? 'You won!' : 'You lost!'}</p>
          <button onClick={handleRestart}>Restart Game</button>
        </div>
      )}
    </div>
  );
}

export default App;
