import React from 'react';
import './TitleScreen.css';

function TitleScreen({ onStart }) {
  return (
    <div className="title-screen">
      <div className="title-background" style={{ backgroundImage: 'url(/assets/title_bg.png)' }}></div>
      <div className="title-content fade-in">
        <h1 className="game-title">New Future</h1>
        <p className="game-subtitle">~내일을 향한 노래~</p>
        <button className="start-button" onClick={onStart}>게임 시작</button>
      </div>
    </div>
  );
}

export default TitleScreen;
