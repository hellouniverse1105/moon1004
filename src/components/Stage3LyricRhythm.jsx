import React, { useState, useEffect, useRef } from 'react';
import './Stage2.css';

// ✅ 달빛천사 Myself 전체 가사 (105초) — librosa onset 분석 기반
const BEATS = [
  // --- 1절: "다신 울지 않을래" ---
  { time: 4.3,  text: "다" }, { time: 4.6,  text: "신" }, { time: 5.2,  text: "울" },
  { time: 5.9,  text: "지" }, { time: 6.2,  text: "않" }, { time: 6.4,  text: "을" },
  { time: 6.5,  text: "래" },
  // "모진 시련 앞에도"
  { time: 7.2,  text: "모" }, { time: 8.4,  text: "진" }, { time: 9.7,  text: "시" },
  { time: 11.0, text: "련" }, { time: 11.7, text: "앞" }, { time: 13.6, text: "에" },
  { time: 14.9, text: "도" },
  // "나 언제나 당당히 웃을 수 있게"
  { time: 15.5, text: "나" }, { time: 16.1, text: "언" }, { time: 16.3, text: "제" },
  { time: 16.4, text: "나" }, { time: 16.6, text: "당" }, { time: 17.1, text: "당" },
  { time: 17.4, text: "히" }, { time: 18.5, text: "웃" }, { time: 18.7, text: "을" },
  { time: 19.3, text: "있" }, { time: 19.6, text: "게" },
  // "아픈 이별의 눈물에"
  { time: 20.9, text: "아" }, { time: 21.1, text: "픈" }, { time: 21.2, text: "이" },
  { time: 21.9, text: "별" }, { time: 22.2, text: "의" }, { time: 22.4, text: "눈" },
  { time: 22.5, text: "물" },
  // "아무런 말도 못하고"
  { time: 23.1, text: "아" }, { time: 23.8, text: "무" }, { time: 24.4, text: "런" },
  { time: 24.7, text: "말" }, { time: 25.1, text: "고" },
  // "떠나는 뒷모습만 새겼죠"
  { time: 26.0, text: "떠" }, { time: 26.2, text: "나" }, { time: 26.3, text: "는" },
  { time: 27.6, text: "뒷" }, { time: 28.9, text: "습" }, { time: 29.2, text: "만" },
  { time: 29.9, text: "새" }, { time: 30.2, text: "겼" }, { time: 30.7, text: "죠" },
  // "어렸던 그때의 나에겐"
  { time: 31.4, text: "어" }, { time: 31.8, text: "렸" }, { time: 32.1, text: "던" },
  { time: 32.7, text: "나" }, { time: 33.0, text: "에" }, { time: 33.4, text: "겐" },
  // --- 간주 (34~38s) — 노트 없음 ---
  // "세상이 무너지듯 어쩔 줄 몰랐죠"
  { time: 38.1, text: "세" }, { time: 38.5, text: "상" }, { time: 38.6, text: "이" },
  { time: 39.1, text: "무" }, { time: 39.4, text: "너" }, { time: 39.6, text: "지" },
  { time: 40.4, text: "듯" }, { time: 41.3, text: "어" }, { time: 41.7, text: "쩔" },
  { time: 42.9, text: "줄" }, { time: 44.2, text: "몰" }, { time: 44.6, text: "랐" },
  { time: 45.5, text: "죠" },
  // "아물어 갈 시간이 지나 알았죠"
  { time: 46.5, text: "아" }, { time: 46.8, text: "물" }, { time: 47.4, text: "어" },
  { time: 48.0, text: "갈" }, { time: 49.0, text: "시" }, { time: 49.3, text: "간" },
  { time: 50.6, text: "이" }, { time: 51.9, text: "지" }, { time: 53.1, text: "나" },
  { time: 53.5, text: "알" }, { time: 54.4, text: "았" }, { time: 55.1, text: "죠" },
  // "마음속에 남은 그대를"
  { time: 55.4, text: "마" }, { time: 55.7, text: "음" }, { time: 56.0, text: "속" },
  { time: 56.3, text: "에" }, { time: 56.8, text: "남" }, { time: 57.6, text: "그" },
  { time: 58.3, text: "대" }, { time: 59.5, text: "를" },
  // "서로 몰래 닮아간 나와 그대"
  { time: 60.2, text: "서" }, { time: 60.7, text: "로" }, { time: 61.1, text: "몰" },
  { time: 61.5, text: "래" }, { time: 61.8, text: "닮" }, { time: 62.1, text: "아" },
  { time: 62.5, text: "간" }, { time: 64.6, text: "나" }, { time: 65.3, text: "와" },
  { time: 65.9, text: "그" }, { time: 67.2, text: "대" },
  // "나를 지켜 주었던"
  { time: 67.5, text: "나" }, { time: 69.7, text: "를" }, { time: 71.0, text: "지" },
  { time: 72.3, text: "켜" }, { time: 73.6, text: "주" }, { time: 74.8, text: "었" },
  // --- 간주 (75~78s) — 노트 없음 ---
  // 후렴 "다신 울지 않을래 모진 시련"
  { time: 78.7, text: "다" }, { time: 79.4, text: "신" }, { time: 80.0, text: "울" },
  { time: 80.8, text: "지" }, { time: 81.2, text: "않" }, { time: 81.9, text: "을" },
  { time: 82.5, text: "래" }, { time: 82.7, text: "모" }, { time: 82.8, text: "진" },
  { time: 83.0, text: "시" },
  // --- 브릿지: "다시 만날 운명을" ---
  { time: 86.3, text: "다" }, { time: 87.3, text: "시" }, { time: 87.5, text: "만" },
  { time: 87.6, text: "날" }, { time: 88.9, text: "운" }, { time: 89.2, text: "명" },
  { time: 90.2, text: "을" },
  // "내 가슴속에 새겼죠"
  { time: 91.4, text: "내" }, { time: 92.1, text: "가" }, { time: 92.4, text: "슴" },
  { time: 92.7, text: "속" }, { time: 94.0, text: "에" }, { time: 95.3, text: "새" },
  { time: 97.8, text: "겼" }, { time: 100.4, text: "죠" },
  // "시간이 지나도 꼭"
  { time: 101.2, text: "시" }, { time: 101.5, text: "간" }, { time: 101.7, text: "이" },
  { time: 102.0, text: "지" }, { time: 102.5, text: "나" }, { time: 103.3, text: "도" },
  { time: 103.4, text: "꼭" },
];

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
