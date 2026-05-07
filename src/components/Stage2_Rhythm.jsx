import React, { useState, useEffect, useRef } from 'react';
import './Stage2.css';

// Simple map of notes for "나의 마음을 담아" (mocked rhythm)
// lane: 0, 1, 2
// time: seconds when it should hit the line
const SONG_NOTES = [
  // Intro beats
  { id: 1, lane: 0, time: 3.0 }, { id: 2, lane: 2, time: 4.5 }, { id: 3, lane: 1, time: 6.0 },
  { id: 4, lane: 0, time: 7.5 }, { id: 5, lane: 2, time: 9.0 }, { id: 6, lane: 1, time: 10.5 },
  { id: 7, lane: 0, time: 12.0 }, { id: 8, lane: 2, time: 13.5 }, { id: 9, lane: 1, time: 15.0 },
  
  // 외로울 때면 (16.0 ~ 18.0)
  { id: 10, lane: 0, time: 16.0 }, { id: 11, lane: 1, time: 16.5 },
  { id: 12, lane: 2, time: 17.0 }, { id: 13, lane: 1, time: 17.5 }, { id: 14, lane: 0, time: 18.0 },
  
  // 누군가 불러 주길 바래 (19.0 ~ 22.0)
  { id: 15, lane: 1, time: 19.0 }, { id: 16, lane: 2, time: 19.4 }, { id: 17, lane: 1, time: 19.8 },
  { id: 18, lane: 0, time: 20.2 }, { id: 19, lane: 1, time: 20.6 }, { id: 20, lane: 2, time: 21.0 },
  { id: 21, lane: 1, time: 21.4 }, { id: 22, lane: 0, time: 21.8 }, { id: 23, lane: 1, time: 22.2 },
  
  // 날 향해 웃어줄 (23.0 ~ 25.0)
  { id: 24, lane: 2, time: 23.0 }, { id: 25, lane: 1, time: 23.5 }, { id: 26, lane: 0, time: 24.0 },
  { id: 27, lane: 1, time: 24.5 }, { id: 28, lane: 2, time: 24.8 }, { id: 29, lane: 1, time: 25.1 },
  
  // 그 누군가를 (26.0 ~ 28.0)
  { id: 30, lane: 0, time: 26.0 }, { id: 31, lane: 1, time: 26.5 }, { id: 32, lane: 2, time: 27.0 },
  { id: 33, lane: 1, time: 27.5 }, { id: 34, lane: 0, time: 28.0 },

  // 부탁해 기억해 줘 (29.0 ~ 31.0)
  { id: 35, lane: 0, time: 29.0 }, { id: 36, lane: 1, time: 29.4 }, { id: 37, lane: 2, time: 29.8 },
  { id: 38, lane: 1, time: 30.2 }, { id: 39, lane: 0, time: 30.6 }, { id: 40, lane: 1, time: 31.0 }, { id: 41, lane: 2, time: 31.4 },
  
  // 오늘 하루도 기대할게 (32.0 ~ 36.5)
  { id: 42, lane: 1, time: 32.0 }, { id: 43, lane: 0, time: 32.5 }, { id: 44, lane: 1, time: 33.0 },
  { id: 45, lane: 2, time: 33.5 }, { id: 46, lane: 1, time: 34.0 },
  { id: 47, lane: 0, time: 35.0 }, { id: 48, lane: 1, time: 35.5 }, { id: 49, lane: 2, time: 36.0 }, { id: 50, lane: 1, time: 36.5 },
  
  // 내일에 (38.0 ~ 39.0)
  { id: 51, lane: 0, time: 38.0 }, { id: 52, lane: 1, time: 38.5 }, { id: 53, lane: 2, time: 39.0 },
  
  // 달빛에 물든 (43.0 ~ 45.0)
  { id: 54, lane: 2, time: 43.0 }, { id: 55, lane: 1, time: 43.5 }, { id: 56, lane: 0, time: 44.0 },
  { id: 57, lane: 1, time: 44.5 }, { id: 58, lane: 2, time: 45.0 },
  
  // 내 모습이 (46.0 ~ 48.0)
  { id: 59, lane: 1, time: 46.0 }, { id: 60, lane: 0, time: 46.5 }, { id: 61, lane: 1, time: 47.0 },
  { id: 62, lane: 2, time: 47.5 }, { id: 63, lane: 1, time: 48.0 },

  // 저 하늘 별빛에 (49.0 ~ 51.5)
  { id: 64, lane: 0, time: 49.0 }, { id: 65, lane: 1, time: 49.5 }, { id: 66, lane: 2, time: 50.0 },
  { id: 67, lane: 1, time: 50.5 }, { id: 68, lane: 0, time: 51.0 }, { id: 69, lane: 1, time: 51.5 },

  // 닿을 때까지 (52.5 ~ 54.5)
  { id: 70, lane: 2, time: 52.5 }, { id: 71, lane: 1, time: 53.0 }, { id: 72, lane: 0, time: 53.5 },
  { id: 73, lane: 1, time: 54.0 }, { id: 74, lane: 2, time: 54.5 },

  // 조금만 더 (55.5 ~ 57.0)
  { id: 75, lane: 0, time: 55.5 }, { id: 76, lane: 1, time: 56.0 },
  { id: 77, lane: 2, time: 56.5 }, { id: 78, lane: 1, time: 57.0 },

  // 기다려줘 (58.0 ~ 59.5)
  { id: 79, lane: 0, time: 58.0 }, { id: 80, lane: 1, time: 58.5 },
  { id: 81, lane: 2, time: 59.0 }, { id: 82, lane: 1, time: 59.5 },

  // 나의 마음을 (60.5 ~ 62.5)
  { id: 83, lane: 0, time: 60.5 }, { id: 84, lane: 1, time: 61.0 }, { id: 85, lane: 2, time: 61.5 },
  { id: 86, lane: 1, time: 62.0 }, { id: 87, lane: 0, time: 62.5 },

  // 담아 (63.5 ~ 64.5)
  { id: 88, lane: 1, time: 63.5 }, { id: 89, lane: 2, time: 64.0 },

  // Outro beats
  { id: 90, lane: 0, time: 66.0 }, { id: 91, lane: 1, time: 66.5 }, { id: 92, lane: 2, time: 67.0 },
  { id: 93, lane: 0, time: 68.0 }, { id: 94, lane: 1, time: 68.5 }, { id: 95, lane: 2, time: 69.0 },
  { id: 96, lane: 1, time: 70.0 }, { id: 97, lane: 0, time: 71.0 }, { id: 98, lane: 2, time: 72.0 },
  { id: 99, lane: 1, time: 73.0 }, { id: 100, lane: 0, time: 74.0 }, { id: 101, lane: 1, time: 74.5 },
  { id: 102, lane: 2, time: 75.0 }, { id: 103, lane: 1, time: 76.0 }, { id: 104, lane: 0, time: 77.0 },
  { id: 105, lane: 1, time: 78.0 }
];

const FALL_SPEED = 200; // pixels per second (how fast notes fall)
const JUDGEMENT_LINE_Y = window.innerHeight * 0.8; // Approximate hit position

function Stage2Rhythm({ onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [judgement, setJudgement] = useState('');
  const [hp, setHp] = useState(100);
  const [comboBump, setComboBump] = useState(false);
  
  const hpRef = useRef(100);
  const audioCtxRef = useRef(null);
  const startTimeRef = useRef(0);
  const reqIdRef = useRef(null);
  const notesRef = useRef(JSON.parse(JSON.stringify(SONG_NOTES))); // Copy
  const activeNotesRef = useRef([]);
  const bgmRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  
  const containerRef = useRef(null);
  const judgementTimeoutRef = useRef(null);

  // Play a simple beep
  const playHitSound = (type = 'perfect') => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'sine';
    if (type === 'perfect') osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
    else if (type === 'good') osc.frequency.setValueAtTime(660, audioCtxRef.current.currentTime);
    else osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime); // miss
    
    gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.1);
  };

  const showJudgement = (text) => {
    setJudgement(text);
    if (judgementTimeoutRef.current) clearTimeout(judgementTimeoutRef.current);
    judgementTimeoutRef.current = setTimeout(() => setJudgement(''), 500);
  };

  const emitParticles = (laneIndex, type) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    // Assuming 3 lanes, 80% width starting at 10%
    const laneWidth = (canvas.width * 0.8) / 3;
    const x = (canvas.width * 0.1) + (laneIndex * laneWidth) + (laneWidth / 2);
    const y = canvas.height * 0.8; // Judgement line

    let color = '255, 255, 255';
    if (type === 'perfect') color = '0, 255, 255';
    else if (type === 'great') color = '255, 255, 0';
    else if (type === 'good') color = '0, 255, 0';

    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 5 + 2,
        life: 1,
        color
      });
    }
  };

  const startGame = () => {
    if (bgmRef.current) {
      bgmRef.current.currentTime = 0;
      bgmRef.current.play().catch(e => console.log('BGM play error', e));
    }
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    setIsPlaying(true);
    startTimeRef.current = audioCtxRef.current.currentTime;
    
    const updateLoop = () => {
      if (hpRef.current <= 0) return; // Stop loop if dead
      const currentTime = bgmRef.current ? bgmRef.current.currentTime : (audioCtxRef.current.currentTime - startTimeRef.current);
      
      // Spawn new notes (spawn them 2 seconds before they hit)
      const lookAhead = 2.0;
      notesRef.current = notesRef.current.filter(note => {
        if (note.time - currentTime <= lookAhead) {
          activeNotesRef.current.push({ ...note, y: 0, hit: false });
          return false; // remove from pending
        }
        return true;
      });

      // Update positions and check misses
      const hitLineOffset = window.innerHeight * 0.8;
      
      activeNotesRef.current = activeNotesRef.current.filter(note => {
        if (note.hit) return false;
        
        // Calculate Y based on time difference
        const timeToHit = note.time - currentTime;
        const currentY = hitLineOffset - (timeToHit * FALL_SPEED);
        note.y = currentY;

        // If it falls way past the line, it's a miss
        if (timeToHit < -0.3) {
          setCombo(0);
          hpRef.current = Math.max(0, hpRef.current - 5);
          setHp(hpRef.current);
          showJudgement('MISS');
          playHitSound('miss');
          if (hpRef.current <= 0) {
            if (bgmRef.current) bgmRef.current.pause();
            setTimeout(() => onComplete(), 2000);
          }
          return false;
        }
        return true;
      });

      // Force a re-render by updating a dummy state if needed, or just let React handle DOM directly
      // For performance in React without complex refs, we'll just force render by calling a state
      // Actually, updating state at 60fps is bad. We should manipulate DOM directly.
      const lanes = [
        document.getElementById('lane-0'),
        document.getElementById('lane-1'),
        document.getElementById('lane-2')
      ];

      // Clear lanes
      lanes.forEach(lane => { if (lane) lane.innerHTML = ''; });

      // Draw active notes
      activeNotesRef.current.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = 'rhythm-note';
        noteEl.style.transform = `translateY(${note.y}px)`;
        const lane = lanes[note.lane];
        if (lane) lane.appendChild(noteEl);
      });

      // Draw particles
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        particlesRef.current = particlesRef.current.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.life)})`;
          ctx.fill();
          return p.life > 0;
        });
      }

      // Check end game
      if (notesRef.current.length === 0 && activeNotesRef.current.length === 0) {
        setTimeout(() => {
          onComplete(); // Move to next stage
        }, 2000);
        return; // Stop loop
      }

      reqIdRef.current = requestAnimationFrame(updateLoop);
    };

    reqIdRef.current = requestAnimationFrame(updateLoop);
  };

  const handleTap = (laneIndex) => {
    if (!isPlaying || hpRef.current <= 0) return;
    
    const currentTime = bgmRef.current ? bgmRef.current.currentTime : (audioCtxRef.current.currentTime - startTimeRef.current);
    
    // Find earliest note in this lane
    const targetNoteIndex = activeNotesRef.current.findIndex(n => n.lane === laneIndex && !n.hit);
    
    if (targetNoteIndex !== -1) {
      const targetNote = activeNotesRef.current[targetNoteIndex];
      const timeDiff = Math.abs(targetNote.time - currentTime);
      
      if (timeDiff <= 0.05) {
        // Perfect
        setScore(prev => prev + 100);
        setCombo(prev => prev + 1);
        hpRef.current = Math.min(100, hpRef.current + 2);
        setHp(hpRef.current);
        showJudgement('PERFECT');
        playHitSound('perfect');
        emitParticles(laneIndex, 'perfect');
        activeNotesRef.current[targetNoteIndex].hit = true;
        flashLane(laneIndex, 'perfect');
        triggerComboBump();
      } else if (timeDiff <= 0.10) {
        // Great
        setScore(prev => prev + 80);
        setCombo(prev => prev + 1);
        hpRef.current = Math.min(100, hpRef.current + 1);
        setHp(hpRef.current);
        showJudgement('GREAT');
        playHitSound('perfect');
        emitParticles(laneIndex, 'great');
        activeNotesRef.current[targetNoteIndex].hit = true;
        flashLane(laneIndex, 'great');
        triggerComboBump();
      } else if (timeDiff <= 0.20) {
        // Good
        setScore(prev => prev + 50);
        setCombo(prev => prev + 1);
        showJudgement('GOOD');
        playHitSound('good');
        emitParticles(laneIndex, 'good');
        activeNotesRef.current[targetNoteIndex].hit = true;
        flashLane(laneIndex, 'good');
        triggerComboBump();
      } else {
        // Too early or miss
        setCombo(0);
        hpRef.current = Math.max(0, hpRef.current - 5);
        setHp(hpRef.current);
        showJudgement('MISS');
        playHitSound('miss');
        flashLane(laneIndex, 'miss');
        if (hpRef.current <= 0) {
          if (bgmRef.current) bgmRef.current.pause();
          setTimeout(() => onComplete(), 2000);
        }
      }
    } else {
      // Tap empty lane
      setCombo(0);
      hpRef.current = Math.max(0, hpRef.current - 1); // slight penalty
      setHp(hpRef.current);
      showJudgement('MISS');
      playHitSound('miss');
      flashLane(laneIndex, 'miss');
    }
  };

  const triggerComboBump = () => {
    setComboBump(true);
    setTimeout(() => setComboBump(false), 100);
  };

  const flashLane = (laneIndex, type) => {
    const pad = document.getElementById(`pad-${laneIndex}`);
    if (pad) {
      pad.className = `hit-pad active ${type}`;
      setTimeout(() => {
        if (pad) pad.className = 'hit-pad';
      }, 150);
    }
  };

  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = 0.5;
    }

    // Resize canvas to match board
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="stage2-rhythm-container fade-in" ref={containerRef}>
      <audio ref={bgmRef} src="/audio/stage2.mp3" preload="auto" />
      {!isPlaying ? (
        <div className="rhythm-intro glass-panel">
          <h2>Stage 2: 박자 연습</h2>
          <p>곡: 나의 마음을 담아</p>
          <p>노트가 하단 라인에 닿을 때 판정 영역을 터치하세요!</p>
          <button className="start-btn" onClick={startGame}>연습 시작</button>
        </div>
      ) : hp <= 0 ? (
        <div className="rhythm-intro glass-panel" style={{ border: '1px solid red' }}>
          <h2 style={{ color: 'red' }}>GAME OVER</h2>
          <p>체력이 모두 소진되었습니다...</p>
        </div>
      ) : (
        <>
          <div className="hud">
            <div className="score">SCORE: {score}</div>
            <div className={`combo ${comboBump ? 'bump' : ''}`}>{combo > 0 ? `${combo} COMBO` : ''}</div>
          </div>

          <div className="hp-bar-container">
            <div className={`hp-bar-fill ${hp <= 20 ? 'danger' : ''}`} style={{ width: `${hp}%` }}></div>
          </div>
          
          <div className="judgement-display fade-in-fast">
            <span className={`judgement-text ${judgement.toLowerCase()}`}>{judgement}</span>
          </div>

          <div className="rhythm-board">
            <canvas ref={canvasRef} className="particles-canvas"></canvas>
            <div className="lane" id="lane-0"></div>
            <div className="lane" id="lane-1"></div>
            <div className="lane" id="lane-2"></div>
            
            <div className="judgement-line"></div>
          </div>

          <div className="hit-pads">
            <div className="hit-pad" id="pad-0" onTouchStart={() => handleTap(0)} onMouseDown={() => handleTap(0)}></div>
            <div className="hit-pad" id="pad-1" onTouchStart={() => handleTap(1)} onMouseDown={() => handleTap(1)}></div>
            <div className="hit-pad" id="pad-2" onTouchStart={() => handleTap(2)} onMouseDown={() => handleTap(2)}></div>
          </div>
        </>
      )}
    </div>
  );
}

export default Stage2Rhythm;
