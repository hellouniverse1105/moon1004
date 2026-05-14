import React, { useState, useEffect, useRef } from 'react';
import './Stage2.css';

// ✅ Custom Beatmap Data from stage3_beatmap.json
const SONG_NOTES = [
    { "time": -0.056, "lane": 2, "type": "short" },
    { "time": 0.804, "lane": 3, "type": "short" },
    { "time": 1.188, "lane": 2, "type": "short" },
    { "time": 1.605, "lane": 3, "type": "short" },
    { "time": 2.02, "lane": 2, "type": "short" },
    { "time": 2.165, "lane": 3, "type": "short" },
    { "time": 2.756, "lane": 2, "type": "short" },
    { "time": 3.109, "lane": 0, "type": "short" },
    { "time": 3.796, "lane": 1, "type": "short" },
    { "time": 4.197, "lane": 0, "type": "short" },
    { "time": 4.612, "lane": 1, "type": "short" },
    { "time": 4.98, "lane": 1, "type": "short" },
    { "time": 5.221, "lane": 1, "type": "short" },
    { "time": 5.716, "lane": 0, "type": "short" },
    { "time": 6.147, "lane": 1, "type": "short" },
    { "time": 6.531, "lane": 1, "type": "short" },
    { "time": 6.707, "lane": 1, "type": "short" },
    { "time": 7.571, "lane": 2, "type": "short" },
    { "time": 7.94, "lane": 2, "type": "short" },
    { "time": 8.18, "lane": 2, "type": "short" },
    { "time": 8.661, "lane": 3, "type": "short" },
    { "time": 8.869, "lane": 2, "type": "short" },
    { "time": 9.06, "lane": 3, "type": "short" },
    { "time": 9.237, "lane": 2, "type": "short" },
    { "time": 9.557, "lane": 3, "type": "short" },
    { "time": 9.715, "lane": 2, "type": "long", "duration": 2.561 },
    { "time": 36.421, "lane": 0, "type": "short" },
    { "time": 36.756, "lane": 1, "type": "short" },
    { "time": 37.124, "lane": 0, "type": "short" },
    { "time": 37.54, "lane": 0, "type": "short" },
    { "time": 37.795, "lane": 0, "type": "short" },
    { "time": 38.596, "lane": 2, "type": "short" },
    { "time": 38.965, "lane": 3, "type": "short" },
    { "time": 39.251, "lane": 2, "type": "short" },
    { "time": 39.844, "lane": 0, "type": "short" },
    { "time": 40.133, "lane": 1, "type": "short" },
    { "time": 40.485, "lane": 3, "type": "short" },
    { "time": 40.708, "lane": 2, "type": "short" },
    { "time": 41.236, "lane": 3, "type": "short" },
    { "time": 41.637, "lane": 2, "type": "short" },
    { "time": 41.973, "lane": 3, "type": "short" },
    { "time": 42.277, "lane": 0, "type": "long", "duration": 1.215 },
    { "time": 43.924, "lane": 2, "type": "short" },
    { "time": 44.228, "lane": 3, "type": "short" },
    { "time": 44.515, "lane": 2, "type": "short" },
    { "time": 45.013, "lane": 0, "type": "short" },
    { "time": 45.252, "lane": 1, "type": "short" },
    { "time": 45.381, "lane": 0, "type": "short" },
    { "time": 45.748, "lane": 1, "type": "short" },
    { "time": 46.164, "lane": 0, "type": "short" },
    { "time": 46.5, "lane": 1, "type": "short" },
    { "time": 46.788, "lane": 2, "type": "long", "duration": 0.915 },
    { "time": 48.453, "lane": 2, "type": "short" },
    { "time": 48.692, "lane": 3, "type": "short" },
    { "time": 49.14, "lane": 2, "type": "short" },
    { "time": 49.459, "lane": 0, "type": "short" },
    { "time": 49.909, "lane": 1, "type": "short" },
    { "time": 50.291, "lane": 0, "type": "short" },
    { "time": 50.597, "lane": 2, "type": "short" },
    { "time": 51.124, "lane": 3, "type": "short" },
    { "time": 51.349, "lane": 2, "type": "long", "duration": 0.751 },
    { "time": 53.363, "lane": 0, "type": "short" },
    { "time": 53.589, "lane": 1, "type": "short" },
    { "time": 53.717, "lane": 0, "type": "short" },
    { "time": 54.052, "lane": 1, "type": "short" },
    { "time": 54.501, "lane": 2, "type": "short" },
    { "time": 54.821, "lane": 3, "type": "short" },
    { "time": 55.061, "lane": 2, "type": "short" },
    { "time": 55.924, "lane": 2, "type": "long", "duration": 0.688 },
    { "time": 56.805, "lane": 0, "type": "short" },
    { "time": 57.061, "lane": 1, "type": "short" },
    { "time": 57.427, "lane": 0, "type": "long", "duration": 0.721 },
    { "time": 58.291, "lane": 2, "type": "short" },
    { "time": 58.564, "lane": 3, "type": "short" },
    { "time": 58.819, "lane": 2, "type": "long", "duration": 1.121 },
    { "time": 60.868, "lane": 0, "type": "short" },
    { "time": 61.061, "lane": 1, "type": "short" },
    { "time": 61.187, "lane": 0, "type": "short" },
    { "time": 61.555, "lane": 1, "type": "short" },
    { "time": 61.973, "lane": 2, "type": "short" },
    { "time": 62.355, "lane": 3, "type": "short" },
    { "time": 62.755, "lane": 2, "type": "short" },
    { "time": 63.123, "lane": 3, "type": "short" },
    { "time": 63.428, "lane": 0, "type": "long", "duration": 0.849 },
    { "time": 63.428, "lane": 3, "type": "long", "duration": 0.849 },
    { "time": 64.613, "lane": 1, "type": "long", "duration": 1.503 },
    { "time": 64.613, "lane": 2, "type": "long", "duration": 1.503 },
    { "time": 66.916, "lane": 2, "type": "long", "duration": 0.288 },
    { "time": 66.916, "lane": 0, "type": "long", "duration": 0.288 },
    { "time": 67.348, "lane": 3, "type": "short" },
    { "time": 67.299, "lane": 1, "type": "short" },
    { "time": 67.684, "lane": 2, "type": "short" },
    { "time": 67.923, "lane": 3, "type": "short" },
    { "time": 68.389, "lane": 2, "type": "short" },
    { "time": 68.885, "lane": 0, "type": "short" },
    { "time": 69.109, "lane": 1, "type": "short" },
    { "time": 69.46, "lane": 0, "type": "long", "duration": 2.399 },
    { "time": 69.46, "lane": 2, "type": "long", "duration": 2.399 },
    { "time": 72.948, "lane": 2, "type": "short" },
    { "time": 73.107, "lane": 3, "type": "short" },
    { "time": 73.364, "lane": 2, "type": "short" },
    { "time": 73.732, "lane": 1, "type": "short" },
    { "time": 73.956, "lane": 3, "type": "short" },
    { "time": 74.515, "lane": 2, "type": "short" },
    { "time": 74.867, "lane": 0, "type": "short" },
    { "time": 75.299, "lane": 1, "type": "short" },
    { "time": 75.587, "lane": 0, "type": "short" },
    { "time": 76.724, "lane": 0, "type": "short" },
    { "time": 76.756, "lane": 2, "type": "short" },
    { "time": 77.076, "lane": 3, "type": "long", "duration": 0.609 },
    { "time": 78.003, "lane": 2, "type": "short" },
    { "time": 78.292, "lane": 3, "type": "short" },
    { "time": 78.628, "lane": 1, "type": "short" },
    { "time": 79.012, "lane": 0, "type": "short" },
    { "time": 79.315, "lane": 1, "type": "short" },
    { "time": 79.683, "lane": 2, "type": "short" },
    { "time": 79.796, "lane": 3, "type": "long", "duration": 0.288 },
    { "time": 80.42, "lane": 0, "type": "short" },
    { "time": 80.676, "lane": 1, "type": "short" },
    { "time": 80.964, "lane": 0, "type": "short" },
    { "time": 81.221, "lane": 1, "type": "short" },
    { "time": 81.653, "lane": 2, "type": "long", "duration": 0.48 },
    { "time": 82.388, "lane": 0, "type": "short" },
    { "time": 82.421, "lane": 3, "type": "short" },
    { "time": 82.724, "lane": 1, "type": "short" },
    { "time": 82.772, "lane": 2, "type": "short" },
    { "time": 83.028, "lane": 0, "type": "long", "duration": 1.056 },
    { "time": 83.028, "lane": 3, "type": "long", "duration": 1.056 },
    { "time": 84.309, "lane": 2, "type": "short" },
    { "time": 84.645, "lane": 3, "type": "long", "duration": 0.59 },
    { "time": 85.429, "lane": 1, "type": "short" },
    { "time": 85.781, "lane": 0, "type": "short" },
    { "time": 86.148, "lane": 1, "type": "short" },
    { "time": 86.532, "lane": 2, "type": "short" },
    { "time": 86.739, "lane": 3, "type": "short" },
    { "time": 86.9, "lane": 2, "type": "short" },
    { "time": 87.3, "lane": 0, "type": "short" },
    { "time": 87.651, "lane": 1, "type": "short" },
    { "time": 88.373, "lane": 2, "type": "short" },
    { "time": 88.741, "lane": 3, "type": "short" },
    { "time": 89.14, "lane": 0, "type": "short" },
    { "time": 89.509, "lane": 0, "type": "short" },
    { "time": 89.861, "lane": 0, "type": "short" },
    { "time": 90.309, "lane": 2, "type": "short" },
    { "time": 90.5, "lane": 3, "type": "short" },
    { "time": 90.662, "lane": 2, "type": "short" },
    { "time": 90.772, "lane": 3, "type": "long", "duration": 0.209 },
    { "time": 91.093, "lane": 2, "type": "short" },
    { "time": 91.219, "lane": 3, "type": "long", "duration": 0.417 },
    { "time": 91.748, "lane": 1, "type": "short" },
    { "time": 92.067, "lane": 0, "type": "short" },
    { "time": 92.213, "lane": 1, "type": "short" },
    { "time": 92.579, "lane": 2, "type": "short" },
    { "time": 92.756, "lane": 3, "type": "short" },
    { "time": 92.948, "lane": 2, "type": "long", "duration": 0.208 },
    { "time": 93.38, "lane": 3, "type": "short" },
    { "time": 93.523, "lane": 2, "type": "short" },
    { "time": 93.699, "lane": 3, "type": "short" },
    { "time": 94.405, "lane": 0, "type": "short" },
    { "time": 94.852, "lane": 1, "type": "short" },
    { "time": 95.093, "lane": 3, "type": "long", "duration": 1.039 },
    { "time": 96.373, "lane": 2, "type": "short" },
    { "time": 96.677, "lane": 3, "type": "long", "duration": 0.577 },
    { "time": 97.54, "lane": 0, "type": "short" },
    { "time": 97.877, "lane": 1, "type": "short" },
    { "time": 98.292, "lane": 2, "type": "short" },
    { "time": 98.629, "lane": 3, "type": "short" },
    { "time": 98.867, "lane": 2, "type": "short" },
    { "time": 99.109, "lane": 3, "type": "short" },
    { "time": 99.477, "lane": 2, "type": "short" },
    { "time": 99.796, "lane": 3, "type": "long", "duration": 0.672 },
    { "time": 100.596, "lane": 1, "type": "short" },
    { "time": 100.917, "lane": 0, "type": "short" },
    { "time": 101.267, "lane": 1, "type": "short" },
    { "time": 101.652, "lane": 2, "type": "short" },
    { "time": 101.812, "lane": 3, "type": "short" },
    { "time": 102.052, "lane": 2, "type": "short" },
    { "time": 102.436, "lane": 3, "type": "short" },
    { "time": 102.933, "lane": 2, "type": "short" },
    { "time": 103.205, "lane": 3, "type": "short" },
    { "time": 103.428, "lane": 2, "type": "short" },
    { "time": 103.955, "lane": 0, "type": "short" },
    { "time": 104.34, "lane": 1, "type": "short" },
    { "time": 104.628, "lane": 0, "type": "short" },
    { "time": 104.868, "lane": 1, "type": "short" },
    { "time": 105.396, "lane": 3, "type": "short" },
    { "time": 105.877, "lane": 2, "type": "short" },
    { "time": 106.804, "lane": 3, "type": "short" },
    { "time": 106.981, "lane": 2, "type": "short" },
    { "time": 107.3, "lane": 0, "type": "long", "duration": 5.616 },
    { "time": 107.3, "lane": 1, "type": "long", "duration": 5.616 },
    { "time": 107.3, "lane": 2, "type": "long", "duration": 5.616 },
    { "time": 107.3, "lane": 3, "type": "long", "duration": 5.616 }
];

const FALL_SPEED = 400;
const KEYS = ['d', 'f', 'j', 'k'];

function Stage3LyricRhythm({ onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [judgement, setJudgement] = useState('');
  const [hp, setHp] = useState(100);
  const [comboBump, setComboBump] = useState(false);
  const [activeKeys, setActiveKeys] = useState({});
  
  const hpRef = useRef(100);
  const audioCtxRef = useRef(null);
  const startTimeRef = useRef(0);
  const reqIdRef = useRef(null);
  const notesRef = useRef(SONG_NOTES.map((n, i) => ({ ...n, id: i })));
  const activeNotesRef = useRef([]);
  const bgmRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  
  const containerRef = useRef(null);
  const judgementTimeoutRef = useRef(null);

  const playHitSound = (type = 'perfect') => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'sine';
    if (type === 'perfect') osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
    else if (type === 'good') osc.frequency.setValueAtTime(660, audioCtxRef.current.currentTime);
    else osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
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
    const laneWidth = canvas.width / 4;
    const x = (laneIndex * laneWidth) + (laneWidth / 2);
    const y = canvas.height;
    let color = '255, 255, 255';
    if (type === 'perfect') color = '0, 255, 255';
    else if (type === 'great') color = '255, 255, 0';
    else if (type === 'good') color = '0, 255, 0';
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        size: Math.random() * 4 + 2,
        life: 1, color
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
      if (hpRef.current <= 0) return;
      const currentTime = bgmRef.current ? bgmRef.current.currentTime : (audioCtxRef.current.currentTime - startTimeRef.current);
      
      const lookAhead = 2.0;
      notesRef.current = notesRef.current.filter(note => {
        if (note.time - currentTime <= lookAhead) {
          activeNotesRef.current.push({ ...note, hit: false, isHolding: false, headHit: false, tailMissed: false });
          return false;
        }
        return true;
      });

      const boardHeight = containerRef.current?.clientHeight * 0.8 || window.innerHeight * 0.8;
      activeNotesRef.current = activeNotesRef.current.filter(note => {
        if (note.hit) return false;
        const timeToHit = note.time - currentTime;
        note.y = boardHeight - (timeToHit * FALL_SPEED);
        if (note.type === 'long' && note.isHolding) setScore(s => s + 1);
        if (note.type === 'short') {
          if (timeToHit < -0.2) { handleMiss(); return false; }
        } else {
          const tailTimeToHit = (note.time + note.duration) - currentTime;
          if (tailTimeToHit < -0.2) {
            if (note.isHolding) { setScore(s => s + 200); setCombo(c => c + 1); showJudgement('PERFECT'); emitParticles(note.lane, 'perfect'); }
            else if (!note.tailMissed) handleMiss();
            return false;
          }
        }
        return true;
      });

      renderLanes();
      renderParticles();
      if (notesRef.current.length === 0 && activeNotesRef.current.length === 0) {
        setTimeout(() => onComplete(), 2000);
        return;
      }
      reqIdRef.current = requestAnimationFrame(updateLoop);
    };
    reqIdRef.current = requestAnimationFrame(updateLoop);
  };

  const handleMiss = () => {
    setCombo(0);
    hpRef.current = Math.max(0, hpRef.current - 8);
    setHp(hpRef.current);
    showJudgement('MISS');
    playHitSound('miss');
    if (hpRef.current <= 0) {
      if (bgmRef.current) bgmRef.current.pause();
      setTimeout(() => onComplete(), 2000);
    }
  };

  const renderLanes = () => {
    for (let i = 0; i < 4; i++) {
      const laneEl = document.getElementById(`stage3-lane-${i}`);
      if (!laneEl) continue;
      laneEl.innerHTML = '';
      activeNotesRef.current.filter(n => n.lane === i).forEach(note => {
        if (note.type === 'short') {
          const noteEl = document.createElement('div');
          noteEl.className = 'rhythm-note';
          noteEl.style.top = `${note.y - 10}px`;
          laneEl.appendChild(noteEl);
        } else {
          const bodyHeight = note.duration * FALL_SPEED;
          const bodyEl = document.createElement('div');
          bodyEl.className = `rhythm-note-body ${note.isHolding ? 'holding' : ''}`;
          bodyEl.style.height = `${bodyHeight}px`;
          bodyEl.style.top = `${note.y - bodyHeight}px`;
          laneEl.appendChild(bodyEl);
          const headEl = document.createElement('div');
          headEl.className = 'rhythm-note long-head';
          headEl.style.top = `${note.y - 10}px`;
          laneEl.appendChild(headEl);
        }
      });
    }
  };

  const renderParticles = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx; p.y += p.vy; p.life -= 0.03;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.life)})`;
      ctx.fill(); return p.life > 0;
    });
  };

  const handlePress = (laneIndex) => {
    if (!isPlaying || hpRef.current <= 0) return;
    setActiveKeys(prev => ({ ...prev, [laneIndex]: true }));
    const currentTime = bgmRef.current ? bgmRef.current.currentTime : (audioCtxRef.current.currentTime - startTimeRef.current);
    const targetNote = activeNotesRef.current.find(n => n.lane === laneIndex && !n.hit && !n.headHit);
    if (targetNote) {
      const timeDiff = Math.abs(targetNote.time - currentTime);
      if (timeDiff <= 0.2) {
        let judgementType = timeDiff <= 0.05 ? 'perfect' : timeDiff <= 0.12 ? 'great' : 'good';
        if (targetNote.type === 'short') {
          targetNote.hit = true;
          setScore(s => s + (judgementType === 'perfect' ? 100 : judgementType === 'great' ? 80 : 50));
          if (judgementType === 'perfect') {
            hpRef.current = Math.min(100, hpRef.current + 2);
            setHp(hpRef.current);
          }
          setCombo(c => c + 1); showJudgement(judgementType.toUpperCase()); playHitSound(judgementType);
          emitParticles(laneIndex, judgementType); triggerComboBump(); flashPad(laneIndex, judgementType);
        } else {
          targetNote.headHit = true; targetNote.isHolding = true;
          showJudgement(judgementType.toUpperCase()); playHitSound(judgementType); flashPad(laneIndex, judgementType);
        }
      } else { handleMiss(); flashPad(laneIndex, 'miss'); }
    } else { handleMiss(); flashPad(laneIndex, 'miss'); }
  };

  const handleRelease = (laneIndex) => {
    setActiveKeys(prev => ({ ...prev, [laneIndex]: false }));
    const holdingNote = activeNotesRef.current.find(n => n.lane === laneIndex && n.type === 'long' && n.isHolding);
    if (holdingNote) { holdingNote.isHolding = false; holdingNote.tailMissed = true; handleMiss(); }
  };

  const triggerComboBump = () => { setComboBump(true); setTimeout(() => setComboBump(false), 100); };

  const flashPad = (laneIndex, type) => {
    const pad = document.getElementById(`stage3-pad-${laneIndex}`);
    if (pad) {
      pad.classList.add('active', type);
      setTimeout(() => pad.classList.remove('active', 'perfect', 'great', 'good', 'miss'), 150);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const idx = KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1 && !activeKeys[idx]) handlePress(idx);
    };
    const handleKeyUp = (e) => {
      const idx = KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1) handleRelease(idx);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [isPlaying, activeKeys]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth * 0.8;
        canvasRef.current.height = containerRef.current.clientHeight * 0.8;
      }
    };
    handleResize(); window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current); };
  }, []);

  return (
    <div className="stage2-rhythm-container fade-in" ref={containerRef}>
      <audio ref={bgmRef} src="/audio/stage3.mp3" preload="auto" />
      <div className="hud">
        <div className="score">SCORE: {score}</div>
        <div className={`combo ${comboBump ? 'bump' : ''}`}>{combo > 0 ? `${combo} COMBO` : ''}</div>
      </div>
      <div className="hp-bar-container">
        <div className={`hp-bar-fill ${hp <= 20 ? 'danger' : ''}`} style={{ width: `${hp}%` }}></div>
      </div>
      {!isPlaying ? (
        <div className="rhythm-intro glass-panel">
          <h2>Stage 3: Myself</h2>
          <p>D, F, J, K 키 또는 화면 하단을 터치하세요!</p>
          <p>노트 속 가사가 제거되어 더욱 집중할 수 있습니다.</p>
          <button className="start-btn" onClick={startGame}>시작하기</button>
        </div>
      ) : (
        <>
          <div className="judgement-display">
            <span className={`judgement-text ${judgement.toLowerCase()}`}>{judgement}</span>
          </div>
          <div className="rhythm-board">
            <canvas ref={canvasRef} className="particles-canvas"></canvas>
            <div className="lane" id="stage3-lane-0"></div>
            <div className="lane" id="stage3-lane-1"></div>
            <div className="lane" id="stage3-lane-2"></div>
            <div className="lane" id="stage3-lane-3"></div>
            <div className="judgement-line"></div>
          </div>
          <div className="hit-pads">
            {KEYS.map((key, i) => (
              <div key={key} className={`hit-pad ${activeKeys[i] ? 'active' : ''}`} id={`stage3-pad-${i}`} data-key={key.toUpperCase()}
                onMouseDown={() => handlePress(i)} onMouseUp={() => handleRelease(i)}
                onTouchStart={(e) => { e.preventDefault(); handlePress(i); }} onTouchEnd={(e) => { e.preventDefault(); handleRelease(i); }}>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Stage3LyricRhythm;
