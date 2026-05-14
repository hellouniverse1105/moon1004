import { useState } from 'react'
import TitleScreen from './components/TitleScreen'
import Stage1Escape from './components/Stage1_Stealth'
import Stage2Rhythm from './components/Stage2_Rhythm'
import Stage3LyricRhythm from './components/Stage3LyricRhythm'
import Stage4Concert from './components/Stage4_Concert'
import MelodyEditor from './components/MelodyEditor'

function App() {
  const [currentStage, setCurrentStage] = useState('title')

  return (
    <div className="game-container fade-in">
      {currentStage === 'title' && <TitleScreen onStart={() => setCurrentStage('stage1')} onEditor={() => setCurrentStage('editor')} />}
      
      {currentStage === 'stage1' && <Stage1Escape onComplete={() => setCurrentStage('stage2')} />}
      
      {currentStage === 'stage2' && <Stage2Rhythm onComplete={() => setCurrentStage('stage3')} />}
      
      {currentStage === 'stage3' && <Stage3LyricRhythm onComplete={() => setCurrentStage('stage4')} />}
      
      {currentStage === 'stage4' && <Stage4Concert />}

      {currentStage === 'editor' && <MelodyEditor onBack={() => setCurrentStage('title')} />}
    </div>
  )
}

export default App
