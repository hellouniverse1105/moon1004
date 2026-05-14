import React from 'react';
import './TitleScreen.css';

function TitleScreen({ onStart, onEditor }) {
  return (
    <div className="title-screen">
      <div className="title-background" style={{ backgroundImage: 'url(/assets/title_bg.png)' }}></div>
      <div className="title-content fade-in">
        <h1 className="game-title">New Future</h1>
        <p className="game-subtitle">~내일을 향한 노래~</p>
        <button className="start-button" onClick={onStart}>게임 시작</button>
      </div>
      <button 
        onClick={onEditor} 
        style={{
          position: 'absolute', bottom: '10px', right: '10px', 
          background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', 
          color: 'rgba(255,255,255,0.5)', padding: '5px 10px', 
          fontSize: '12px', cursor: 'pointer', borderRadius: '4px'
        }}
      >
        에디터 (Stage 4)
      </button>
    </div>
  );
}

export default TitleScreen;
