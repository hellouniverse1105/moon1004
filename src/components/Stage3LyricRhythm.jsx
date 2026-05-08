import React, { useState, useEffect, useRef } from 'react';
import './Stage2.css';

// ✅ 달빛천사 Myself 전체 가사 (105초) — librosa onset 분석 기반
// 1. 설정값 (영상의 실제 속도나 시작점에 맞춰 미세 조절 가능)
const BPM = 74; // 곡의 템포 (빠르면 숫자를 높이고, 느리면 낮추세요)
const START_TIME_SEC = 0.0; // 첫 가사 '다'가 시작되는 시간 (초)
const BEAT_DURATION = 60 / BPM; // 1박자(4분음표)가 차지하는 시간(초)

// 2. 악보 데이터
// note: 음표 길이 (0.5 = 8분음표, 1.0 = 4분음표, 2.0 = 2분음표, 3.0 = 점2분음표)
// rest: 해당 글자를 부르고 나서 간주나 숨을 쉬기 위해 비우는 '박자' 길이
const sheetMusic = [
  // --- Intro ---
  { text: "다", note: 0.5, rest: 0 }, { text: "신", note: 0.5, rest: 0 },
  { text: "울", note: 1.0, rest: 0 }, { text: "지", note: 1.0, rest: 0 },
  { text: "않", note: 0.5, rest: 0 }, { text: "을", note: 0.5, rest: 0 },
  { text: "래", note: 2.0, rest: 1.0 }, // 2박자 부르고 1박자 쉼

  { text: "모", note: 0.5, rest: 0 }, { text: "진", note: 0.5, rest: 0 },
  { text: "시", note: 1.0, rest: 0 }, { text: "련", note: 1.0, rest: 0 },
  { text: "앞", note: 0.5, rest: 0 }, { text: "에", note: 0.5, rest: 0 },
  { text: "도", note: 2.0, rest: 1.0 },

  { text: "나", note: 0.5, rest: 0 }, { text: "언", note: 0.5, rest: 0 },
  { text: "제", note: 0.5, rest: 0 }, { text: "나", note: 0.5, rest: 0 },
  { text: "당", note: 0.5, rest: 0 }, { text: "당", note: 0.5, rest: 0 },
  { text: "히", note: 1.0, rest: 0 }, { text: "웃", note: 0.5, rest: 0 },
  { text: "을", note: 0.5, rest: 0 }, { text: "수", note: 0.5, rest: 0 },
  { text: "있", note: 0.5, rest: 0 }, 
  { text: "게", note: 2.0, rest: 32.0 }, // 1절 시작 전 긴 간주 (약 8마디 대기)

  // --- Verse 1 ---
  { text: "아", note: 1.0, rest: 0 }, { text: "픈", note: 0.5, rest: 0 },
  { text: "이", note: 0.5, rest: 0 }, { text: "별", note: 0.5, rest: 0 },
  { text: "의", note: 0.5, rest: 0 }, { text: "눈", note: 1.0, rest: 0 },
  { text: "물", note: 1.0, rest: 0 }, { text: "에", note: 2.0, rest: 1.0 },

  { text: "아", note: 1.0, rest: 0 }, { text: "무", note: 0.5, rest: 0 },
  { text: "런", note: 0.5, rest: 0 }, { text: "말", note: 0.5, rest: 0 },
  { text: "도", note: 0.5, rest: 0 }, { text: "못", note: 1.0, rest: 0 },
  { text: "하", note: 1.0, rest: 0 }, { text: "고", note: 2.0, rest: 1.0 },

  { text: "떠", note: 1.0, rest: 0 }, { text: "나", note: 0.5, rest: 0 },
  { text: "는", note: 0.5, rest: 0 }, { text: "뒷", note: 0.5, rest: 0 },
  { text: "모", note: 0.5, rest: 0 }, { text: "습", note: 1.0, rest: 0 },
  { text: "만", note: 1.0, rest: 0 }, { text: "새", note: 1.0, rest: 0 },
  { text: "겼", note: 1.0, rest: 0 }, { text: "죠", note: 2.0, rest: 1.0 },

  { text: "어", note: 1.0, rest: 0 }, { text: "렸", note: 0.5, rest: 0 },
  { text: "던", note: 0.5, rest: 0 }, { text: "그", note: 0.5, rest: 0 },
  { text: "때", note: 0.5, rest: 0 }, { text: "의", note: 0.5, rest: 0 },
  { text: "나", note: 0.5, rest: 0 }, { text: "에", note: 1.0, rest: 0 },
  { text: "겐", note: 3.0, rest: 1.0 },

  // --- Pre-Chorus ---
  { text: "세", note: 0.5, rest: 0 }, { text: "상", note: 0.5, rest: 0 },
  { text: "이", note: 0.5, rest: 0 }, { text: "무", note: 0.5, rest: 0 },
  { text: "너", note: 1.0, rest: 0 }, { text: "지", note: 1.0, rest: 0 },
  { text: "듯", note: 2.0, rest: 1.0 },
  
  { text: "어", note: 0.5, rest: 0 }, { text: "쩔", note: 0.5, rest: 0 },
  { text: "줄", note: 1.0, rest: 0 }, { text: "몰", note: 1.0, rest: 0 },
  { text: "랐", note: 2.0, rest: 0 }, { text: "죠", note: 2.0, rest: 1.0 },

  { text: "아", note: 0.5, rest: 0 }, { text: "물", note: 0.5, rest: 0 },
  { text: "어", note: 0.5, rest: 0 }, { text: "갈", note: 0.5, rest: 0 },
  { text: "시", note: 1.0, rest: 0 }, { text: "간", note: 1.0, rest: 0 },
  { text: "이", note: 2.0, rest: 1.0 },
  
  { text: "지", note: 0.5, rest: 0 }, { text: "나", note: 0.5, rest: 0 },
  { text: "알", note: 1.0, rest: 0 }, { text: "았", note: 2.0, rest: 0 },
  { text: "죠", note: 2.0, rest: 1.0 },

  { text: "마", note: 0.5, rest: 0 }, { text: "음", note: 0.5, rest: 0 },
  { text: "속", note: 0.5, rest: 0 }, { text: "에", note: 0.5, rest: 0 },
  { text: "남", note: 0.5, rest: 0 }, { text: "은", note: 0.5, rest: 0 },
  { text: "그", note: 1.0, rest: 0 }, { text: "대", note: 1.0, rest: 0 },
  { text: "를", note: 2.0, rest: 1.0 },

  { text: "서", note: 0.5, rest: 0 }, { text: "로", note: 0.5, rest: 0 },
  { text: "몰", note: 0.5, rest: 0 }, { text: "래", note: 0.5, rest: 0 },
  { text: "닮", note: 0.5, rest: 0 }, { text: "아", note: 0.5, rest: 0 },
  { text: "간", note: 1.0, rest: 0 }, { text: "나", note: 1.0, rest: 0 },
  { text: "와", note: 1.0, rest: 0 }, { text: "그", note: 1.0, rest: 0 },
  { text: "대", note: 2.0, rest: 1.0 },

  { text: "나", note: 1.0, rest: 0 }, { text: "를", note: 1.0, rest: 0 },
  { text: "지", note: 1.0, rest: 0 }, { text: "켜", note: 1.0, rest: 0 },
  { text: "주", note: 1.0, rest: 0 }, { text: "었", note: 1.0, rest: 0 },
  { text: "던", note: 2.0, rest: 1.0 },

  // --- Chorus ---
  { text: "다", note: 0.5, rest: 0 }, { text: "신", note: 0.5, rest: 0 },
  { text: "울", note: 1.0, rest: 0 }, { text: "지", note: 1.0, rest: 0 },
  { text: "않", note: 0.5, rest: 0 }, { text: "을", note: 0.5, rest: 0 },
  { text: "래", note: 2.0, rest: 1.0 },

  { text: "모", note: 0.5, rest: 0 }, { text: "진", note: 0.5, rest: 0 },
  { text: "시", note: 1.0, rest: 0 }, { text: "련", note: 1.0, rest: 0 },
  { text: "앞", note: 0.5, rest: 0 }, { text: "에", note: 0.5, rest: 0 },
  { text: "도", note: 2.0, rest: 1.0 },

  // --- Bridge ---
  { text: "다", note: 0.5, rest: 0 }, { text: "시", note: 0.5, rest: 0 },
  { text: "만", note: 1.0, rest: 0 }, { text: "날", note: 1.0, rest: 0 },
  { text: "운", note: 0.5, rest: 0 }, { text: "명", note: 0.5, rest: 0 },
  { text: "을", note: 2.0, rest: 1.0 },

  { text: "내", note: 1.0, rest: 0 }, { text: "가", note: 0.5, rest: 0 },
  { text: "슴", note: 0.5, rest: 0 }, { text: "속", note: 0.5, rest: 0 },
  { text: "에", note: 0.5, rest: 0 }, { text: "새", note: 1.0, rest: 0 },
  { text: "겼", note: 1.0, rest: 0 }, { text: "죠", note: 3.0, rest: 1.0 },

  { text: "시", note: 0.5, rest: 0 }, { text: "간", note: 0.5, rest: 0 },
  { text: "이", note: 0.5, rest: 0 }, { text: "지", note: 0.5, rest: 0 },
  { text: "나", note: 1.0, rest: 0 }, { text: "도", note: 1.0, rest: 0 },
  { text: "꼭", note: 2.0, rest: 0 },
];

// 3. 타임라인(BEATS) 자동 계산 로직
const BEATS_CALCULATED = [];
let calculationTime = START_TIME_SEC;

sheetMusic.forEach(item => {
  BEATS_CALCULATED.push({
    time: Number(calculationTime.toFixed(2)),
    text: item.text
  });
  calculationTime += (item.note + item.rest) * BEAT_DURATION;
});

const BEATS = BEATS_CALCULATED;

// 노래 전체 길이 (간주 구간에서 game over 방지용)
const SONG_DURATION = 105.0;

const DUMMY_WORDS = ["돈","맘","나","너","별","꿈","달","빛","노","래","천","사","만","월","풀","문","왜","안","돼","요"];
const FALL_SPEED = 200; // 박자감을 위해 약간 상향
const SONG_OFFSET = 0; // 싱크가 안 맞을 경우 이 값을 조절 (예: 0.2 또는 -0.2)

function Stage3LyricRhythm({ onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [judgement, setJudgement] = useState('');
  const [collectedLyrics, setCollectedLyrics] = useState([]);
  const [hp, setHp] = useState(100);
  const [comboBump, setComboBump] = useState(false);

  const hpRef = useRef(100);
  const audioCtxRef = useRef(null);
  const reqIdRef = useRef(null);
  const notesRef = useRef([]);
  const activeNotesRef = useRef([]);
  const judgementTimeoutRef = useRef(null);
  const bgmRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const containerRef = useRef(null);
  const missedTimesRef = useRef(new Set());
  // ✅ 간주 구간 종료 감지용: 마지막으로 처리된 beat index
  const lastBeatIndexRef = useRef(0);
  const gameFinishedRef = useRef(false);

  const generateNotes = () => {
    const generated = [];
    let idCounter = 1;
    BEATS.forEach(beat => {
      const correctLane = Math.floor(Math.random() * 3);
      for (let i = 0; i < 3; i++) {
        const text = i === correctLane
          ? beat.text
          : DUMMY_WORDS[Math.floor(Math.random() * DUMMY_WORDS.length)];
        generated.push({ id: idCounter++, lane: i, time: beat.time + SONG_OFFSET, text, isCorrect: i === correctLane });
      }
    });
    notesRef.current = generated;
    missedTimesRef.current = new Set();
    lastBeatIndexRef.current = 0;
    gameFinishedRef.current = false;
  };

  const playHitSound = (type = 'perfect') => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = type === 'miss' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(
      type === 'perfect' ? 1046.50 : type === 'good' ? 783.99 : 150.63,
      audioCtxRef.current.currentTime
    );
    gain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.2);
  };

  const showJudgement = (text) => {
    setJudgement(text);
    if (judgementTimeoutRef.current) clearTimeout(judgementTimeoutRef.current);
    judgementTimeoutRef.current = setTimeout(() => setJudgement(''), 500);
  };

  const emitParticles = (laneIndex, type) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const laneWidth = (canvas.width * 0.8) / 3;
    const x = (canvas.width * 0.1) + (laneIndex * laneWidth) + (laneWidth / 2);
    const y = canvas.height * 0.8;
    const color = type === 'perfect' ? '0,255,255' : type === 'great' ? '255,255,0' : '0,255,0';
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 5 + 2,
        life: 1, color,
      });
    }
  };

  const startGame = () => {
    generateNotes();
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (bgmRef.current) {
      bgmRef.current.currentTime = 0;
      bgmRef.current.play().catch(e => console.log('BGM error', e));
    }
    setIsPlaying(true);

    const updateLoop = () => {
      if (hpRef.current <= 0 || gameFinishedRef.current) return;

      const currentTime = bgmRef.current ? bgmRef.current.currentTime : 0;
      const lookAhead = 3.0;

      // 노트 활성화
      notesRef.current = notesRef.current.filter(note => {
        if (note.time - currentTime <= lookAhead) {
          activeNotesRef.current.push({ ...note, hit: false, missed: false });
          return false;
        }
        return true;
      });

      const hitLineY = (containerRef.current?.clientHeight ?? window.innerHeight) * 0.8;

      // miss 처리 — beat당 1회만
      activeNotesRef.current.forEach(note => {
        if (!note.hit && !note.missed && (currentTime - note.time) > 0.35) {
          const timeKey = note.time.toFixed(2);
          if (note.isCorrect && !missedTimesRef.current.has(timeKey)) {
            missedTimesRef.current.add(timeKey);
            setCombo(0);
            hpRef.current = Math.max(0, hpRef.current - 5);
            setHp(hpRef.current);
            showJudgement('MISS');
            playHitSound('miss');
            if (hpRef.current <= 0) {
              if (bgmRef.current) bgmRef.current.pause();
              gameFinishedRef.current = true;
              setTimeout(() => onComplete(), 2000);
              return;
            }
          }
          note.missed = true;
        }
      });

      activeNotesRef.current = activeNotesRef.current.filter(n => !n.hit && !n.missed);

      // DOM 렌더링
      const lanes = [0, 1, 2].map(i => document.getElementById(`stage3-lane-${i}`));
      lanes.forEach(lane => { if (lane) lane.innerHTML = ''; });
      activeNotesRef.current.forEach(note => {
        const timeToHit = note.time - currentTime;
        const noteY = hitLineY - (timeToHit * FALL_SPEED);
        const noteEl = document.createElement('div');
        noteEl.className = 'rhythm-note lyric-note';
        noteEl.innerText = note.text;
        noteEl.style.transform = `translateY(${noteY}px)`;
        if (lanes[note.lane]) lanes[note.lane].appendChild(noteEl);
      });

      // 파티클
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        particlesRef.current = particlesRef.current.filter(p => {
          p.x += p.vx; p.y += p.vy; p.life -= 0.05;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color},${Math.max(0, p.life)})`;
          ctx.fill();
          return p.life > 0;
        });
      }

      // ✅ 종료 판정: 노래가 끝났을 때만 (간주 구간 오탐 방지)
      const allNotesSpawned = notesRef.current.length === 0;
      const noActiveNotes = activeNotesRef.current.length === 0;
      const songEnded = currentTime >= SONG_DURATION - 1.0;

      if (allNotesSpawned && noActiveNotes && songEnded && !gameFinishedRef.current) {
        gameFinishedRef.current = true;
        setTimeout(() => onComplete(), 2000);
        return;
      }

      reqIdRef.current = requestAnimationFrame(updateLoop);
    };

    reqIdRef.current = requestAnimationFrame(updateLoop);
  };

  const handleTap = (laneIndex) => {
    if (!isPlaying || hpRef.current <= 0) return;
    const currentTime = bgmRef.current ? bgmRef.current.currentTime : 0;
    const threshold = 0.35;

    const notesInWindow = activeNotesRef.current.filter(
      n => !n.hit && !n.missed && Math.abs(n.time - currentTime) <= threshold
    );
    if (notesInWindow.length === 0) return;

    const targetTime = notesInWindow[0].time;
    const group = activeNotesRef.current.filter(n => Math.abs(n.time - targetTime) < 0.1);
    const tappedNote = group.find(n => n.lane === laneIndex);
    if (!tappedNote) return;

    // 그룹 전체 hit 처리 먼저
    group.forEach(n => { n.hit = true; });

    if (tappedNote.isCorrect) {
      const timeDiff = Math.abs(tappedNote.time - currentTime);
      if (timeDiff <= 0.05) {
        setScore(p => p + 100); setCombo(p => p + 1);
        hpRef.current = Math.min(100, hpRef.current + 2); setHp(hpRef.current);
        showJudgement('PERFECT'); playHitSound('perfect');
        emitParticles(laneIndex, 'perfect'); flashLane(laneIndex, 'perfect');
      } else if (timeDiff <= 0.12) {
        setScore(p => p + 80); setCombo(p => p + 1);
        hpRef.current = Math.min(100, hpRef.current + 1); setHp(hpRef.current);
        showJudgement('GREAT'); playHitSound('perfect');
        emitParticles(laneIndex, 'great'); flashLane(laneIndex, 'great');
      } else {
        setScore(p => p + 50); setCombo(p => p + 1);
        showJudgement('GOOD'); playHitSound('good');
        emitParticles(laneIndex, 'good'); flashLane(laneIndex, 'good');
      }
      setComboBump(true); setTimeout(() => setComboBump(false), 100);
      setCollectedLyrics(prev => [...prev, tappedNote.text]);
    } else {
      setCombo(0);
      hpRef.current = Math.max(0, hpRef.current - 5); setHp(hpRef.current);
      showJudgement('WRONG!'); playHitSound('miss'); flashLane(laneIndex, 'miss');
      if (hpRef.current <= 0) {
        if (bgmRef.current) bgmRef.current.pause();
        gameFinishedRef.current = true;
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  const flashLane = (laneIndex, type) => {
    const pad = document.getElementById(`stage3-pad-${laneIndex}`);
    if (pad) {
      pad.className = `hit-pad active ${type}`;
      setTimeout(() => { if (pad) pad.className = 'hit-pad'; }, 150);
    }
  };

  useEffect(() => {
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
      if (bgmRef.current) { bgmRef.current.pause(); bgmRef.current.currentTime = 0; }
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="stage2-rhythm-container fade-in" ref={containerRef}>
      <audio ref={bgmRef} src="/audio/stage3.mp3" preload="auto" />
      {!isPlaying ? (
        <div className="rhythm-intro glass-panel">
          <h2>Stage 3: 올바른 가사 찾기</h2>
          <p>곡: Myself (달빛천사)</p>
          <p>3개의 가사 노트가 동시에 떨어집니다.<br />원래 가사에 맞는 <strong>올바른 단어</strong>를 골라 터치하세요!</p>
          <button className="start-btn" onClick={startGame}>노래 부르기</button>
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
            <div className={`hp-bar-fill ${hp <= 20 ? 'danger' : ''}`} style={{ width: `${hp}%` }} />
          </div>
          <div className="judgement-display fade-in-fast">
            <span className={`judgement-text ${judgement.toLowerCase().includes('wrong') ? 'miss' : judgement.toLowerCase()}`}>
              {judgement}
            </span>
          </div>
          <div style={{ position: 'absolute', top: '15%', width: '100%', textAlign: 'center', zIndex: 10 }}>
            <h1 style={{ color: '#fff', textShadow: '0 0 15px #ff6bcb', fontSize: '2.5rem', fontFamily: 'Noto Serif KR, serif' }}>
              {collectedLyrics.join('')}
            </h1>
          </div>
          <div className="rhythm-board">
            <canvas ref={canvasRef} className="particles-canvas" />
            <div className="lane" id="stage3-lane-0" />
            <div className="lane" id="stage3-lane-1" />
            <div className="lane" id="stage3-lane-2" />
            <div className="judgement-line" />
          </div>
          <div className="hit-pads">
            {[0, 1, 2].map(i => (
              <div key={i} className="hit-pad" id={`stage3-pad-${i}`}
                onTouchStart={() => handleTap(i)} onMouseDown={() => handleTap(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Stage3LyricRhythm;
