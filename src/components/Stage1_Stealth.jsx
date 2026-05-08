import React, { useState } from 'react';
import './Stage1.css';

function Stage1Escape({ onComplete }) {
  const [showHint, setShowHint] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const CORRECT_PASSWORD = '30021004';

  const handleKeypadPress = (num) => {
    if (password.length < 8) {
      setPassword(prev => prev + num);
    }
  };

  const handleClear = () => {
    setPassword('');
  };

  const handleSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsUnlocked(true);
      setTimeout(() => {
        onComplete();
      }, 3000); // Wait 3 seconds to show unlocked animation
    } else {
      alert('비밀번호가 틀렸습니다!');
      setPassword('');
    }
  };

  return (
    <div className="stage1-escape-container fade-in">
      <div className="escape-bg" style={{ backgroundImage: 'url(/assets/room_escape_bg.png)' }}></div>
      
      {/* Clickable Areas */}
      <div className="clickable-area picture-frame" onClick={() => setShowHint(true)}>
        <div className="glow-indicator"></div>
      </div>
      
      <div className="clickable-area treasure-chest" onClick={() => setShowKeypad(true)}>
        <div className="glow-indicator"></div>
      </div>

      {/* Header Info */}
      <div className="escape-header glass-panel">
        <h2>Stage 1: 건토의 보물상자</h2>
        <p>방 안의 단서를 찾아 상자의 봉인을 푸세요.</p>
      </div>

      {/* Hint Modal */}
      {showHint && (
        <div className="modal-overlay fade-in-fast" onClick={() => setShowHint(false)}>
          <div className="hint-modal" onClick={e => e.stopPropagation()}>
            <h3>액자 속 단서</h3>
            <p className="hint-text">MOON 천사</p>
            <p className="hint-desc">(숫자로 어떻게 표현할 수 있을까?)</p>
            <button className="close-btn" onClick={() => setShowHint(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* Keypad Modal */}
      {showKeypad && !isUnlocked && (
        <div className="modal-overlay fade-in-fast" onClick={() => setShowKeypad(false)}>
          <div className="keypad-modal" onClick={e => e.stopPropagation()}>
            <h3>자물쇠 다이얼</h3>
            <div className="password-display">
              {password.padEnd(8, '_').split('').map((char, idx) => (
                <span key={idx} className="pwd-char">{char}</span>
              ))}
            </div>
            <div className="keypad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} className="key-btn" onClick={() => handleKeypadPress(num.toString())}>{num}</button>
              ))}
              <button className="key-btn action-btn" onClick={handleClear}>C</button>
              <button className="key-btn" onClick={() => handleKeypadPress('0')}>0</button>
              <button className="key-btn action-btn submit" onClick={handleSubmit}>E</button>
            </div>
            <button className="close-btn mt-10" onClick={() => setShowKeypad(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* Unlocked Overlay */}
      {isUnlocked && (
        <div className="unlocked-overlay fade-in-slow">
          <div className="unlocked-content">
            <h1 className="glowing-text">봉인 해제!</h1>
            <p>건토의 힘을 되찾아 풀문으로 변신할 수 있게 되었습니다!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stage1Escape;
