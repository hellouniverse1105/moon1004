import React, { useState, useEffect, useRef } from 'react';
import './Stage2.css';

// ✅ 달빛천사 나의 마음을 담아 (BPM 115) — 악보 기반 데이터
const BPM = 115;
const START_TIME_SEC = 6.3; // 악보상 3마디 전주 (115 BPM 기준 약 6.26초) 후 시작
const BEAT_DURATION = 60 / BPM;

const sheetMusic = [
  // --- Intro Melody ---
  { text: "외", note: 0.5, rest: 0 }, { text: "로", note: 0.5, rest: 0 }, { text: "운", note: 0.5, rest: 0.5 },
  { text: "사", note: 0.5, rest: 0 }, { text: "람", note: 0.5, rest: 0 }, { text: "들", note: 0.5, rest: 0 }, { text: "의", note: 1.0, rest: 0 },

  { text: "마", note: 0.5, rest: 0 }, { text: "음", note: 0.5, rest: 0 }, { text: "을", note: 0.5, rest: 0.5 },
  { text: "열", note: 0.5, rest: 0 }, { text: "어", note: 0.5, rest: 0 }, { text: "줄", note: 0.5, rest: 0 }, { text: "거", note: 0.5, rest: 0 }, { text: "야", note: 1.0, rest: 1.0 },

  { text: "메", note: 0.5, rest: 0 }, { text: "마", note: 0.5, rest: 0 }, { text: "른", note: 0.5, rest: 0.5 },
  { text: "가", note: 0.5, rest: 0 }, { text: "슴", note: 0.5, rest: 0 }, { text: "속", note: 0.5, rest: 0 }, { text: "을", note: 1.0, rest: 0 },

  { text: "적", note: 0.5, rest: 0 }, { text: "셔", note: 0.5, rest: 0 }, { text: "줄", note: 0.5, rest: 0.5 },
  { text: "멜", note: 0.5, rest: 0 }, { text: "로", note: 0.5, rest: 0 }, { text: "디", note: 2.0, rest: 1.0 },

  // --- Verse 1 ---
  { text: "슬", note: 0.5, rest: 0 }, { text: "픔", note: 0.5, rest: 0 }, { text: "의", note: 0.5, rest: 0.5 },
  { text: "기", note: 0.5, rest: 0 }, { text: "억", note: 0.5, rest: 0 }, { text: "들", note: 0.5, rest: 0 }, { text: "에", note: 1.0, rest: 0 },

  { text: "기", note: 0.5, rest: 0 }, { text: "쁨", note: 0.5, rest: 0 }, { text: "을", note: 0.5, rest: 0.5 },
  { text: "채", note: 0.5, rest: 0 }, { text: "워", note: 0.5, rest: 0 }, { text: "줄", note: 0.5, rest: 0 }, { text: "거", note: 0.5, rest: 0 }, { text: "야", note: 1.0, rest: 1.0 },

  { text: "넘", note: 0.5, rest: 0 }, { text: "치", note: 0.5, rest: 0 }, { text: "는", note: 0.5, rest: 0.5 },
  { text: "음", note: 0.5, rest: 0 }, { text: "악", note: 0.5, rest: 0 }, { text: "속", note: 0.5, rest: 0 }, { text: "의", note: 1.0, rest: 0 },

  { text: "리", note: 0.5, rest: 0 }, { text: "듬", note: 0.5, rest: 0 }, { text: "을", note: 2.0, rest: 1.0 },

  // --- Scat/Chorus ---
  { text: "스", note: 1.0, rest: 0 }, { text: "다", note: 0.5, rest: 0 }, { text: "리", note: 0.5, rest: 0 }, { text: "라", note: 0.5, rest: 0 }, { text: "리", note: 0.5, rest: 0 }, { text: "라", note: 1.0, rest: 1.0 },
  { text: "라", note: 0.5, rest: 0 }, { text: "라", note: 0.5, rest: 0 }, { text: "라", note: 0.5, rest: 0 }, { text: "라", note: 0.5, rest: 0 }, { text: "라", note: 0.5, rest: 0 }, { text: "라", note: 1.0, rest: 1.0 },

  // --- Final Part ---
  { text: "내", note: 0.5, rest: 0 }, { text: "마", note: 0.5, rest: 0 }, { text: "음", note: 0.5, rest: 0 }, { text: "을", note: 0.5, rest: 0 },
  { text: "담", note: 1.0, rest: 0 }, { text: "아", note: 1.0, rest: 0 },
  { text: "노", note: 0.5, rest: 0 }, { text: "래", note: 0.5, rest: 0 }, { text: "할", note: 0.5, rest: 0 }, { text: "거", note: 0.5, rest: 0 }, { text: "야", note: 2.0, rest: 2.0 },
];

const SONG_NOTES_CALCULATED = [];
let calculationTime = START_TIME_SEC;

sheetMusic.forEach((item, index) => {
  SONG_NOTES_CALCULATED.push({
    id: index + 1,
    lane: Math.floor(Math.random() * 3), // 랜덤 레인
    time: Number(calculationTime.toFixed(2)),
    text: item.text
  });
  calculationTime += (item.note + item.rest) * BEAT_DURATION;
});

const SONG_NOTES = SONG_NOTES_CALCULATED;

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
      const hitLineOffset = (containerRef.current?.clientHeight ?? window.innerHeight) * 0.8;
      
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
        noteEl.innerText = note.text || '';
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
      if (notesRef.current.length === 0 && activeNotesRef.current.length === 0 && currentTime > calculationTime) {
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
      } else if (timeDiff <= 0.12) {
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
      } else if (timeDiff <= 0.25) {
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
