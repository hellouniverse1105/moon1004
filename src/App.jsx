import { useState } from 'react'
import TitleScreen from './components/TitleScreen'
import Stage4Concert from './components/Stage4_Concert'

function App() {
  const [currentStage, setCurrentStage] = useState('title')

  const startGame = () => {
    setCurrentStage('stage4')
  }

  return (
    <div className="game-container fade-in">
      {currentStage === 'title' && <TitleScreen onStart={startGame} />}
      {currentStage === 'stage4' && <Stage4Concert />}
    </div>
  )
}

export default App
