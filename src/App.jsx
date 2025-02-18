import React, { useState } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import StartScreen from './components/StartScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('pvp');
  const [theme, setTheme] = useState('classic');
  const [difficulty, setDifficulty] = useState('easy');

  const handleStartGame = (mode, selectedTheme, selectedDifficulty) => {
    setGameMode(mode);
    setTheme(selectedTheme);
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleReturnToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="app">
      {!gameStarted ? (
        <StartScreen 
          onStartGame={handleStartGame}
          onThemeChange={handleThemeChange}
        />
      ) : (
        <ChessBoard 
          gameMode={gameMode}
          theme={theme}
          difficulty={difficulty}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}

export default App
