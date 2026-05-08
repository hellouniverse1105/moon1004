import React, { useState, useEffect, useRef } from 'react';
import './Stage2.css';

// ✅ Custom Beatmap Data from my_beatmap.json
const SONG_NOTES = [
    { "time": 2.859, "lane": 0, "type": "short" },
    { "time": 3.111, "lane": 1, "type": "short" },
    { "time": 3.35, "lane": 2, "type": "short" },
    { "time": 3.591, "lane": 3, "type": "short" },
    { "time": 3.864, "lane": 2, "type": "short" },
    { "time": 4.088, "lane": 3, "type": "short" },
    { "time": 4.359, "lane": 2, "type": "short" },
    { "time": 4.903, "lane": 0, "type": "short" },
    { "time": 5.159, "lane": 0, "type": "short" },
    { "time": 5.416, "lane": 0, "type": "short" },
    { "time": 5.719, "lane": 1, "type": "short" },
    { "time": 5.99, "lane": 0, "type": "short" },
    { "time": 6.184, "lane": 1, "type": "short" },
    { "time": 6.471, "lane": 0, "type": "short" },
    { "time": 6.759, "lane": 2, "type": "short" },
    { "time": 7.079, "lane": 0, "type": "short" },
    { "time": 7.367, "lane": 3, "type": "short" },
    { "time": 7.67, "lane": 2, "type": "short" },
    { "time": 7.928, "lane": 1, "type": "short" },
    { "time": 8.166, "lane": 3, "type": "short" },
    { "time": 8.471, "lane": 2, "type": "short" },
    { "time": 8.743, "lane": 0, "type": "short" },
    { "time": 9.064, "lane": 1, "type": "short" },
    { "time": 9.448, "lane": 2, "type": "short" },
    { "time": 9.815, "lane": 3, "type": "short" },
    { "time": 10.12, "lane": 2, "type": "short" },
    { "time": 10.504, "lane": 2, "type": "short" },
    { "time": 10.918, "lane": 2, "type": "short" },
    { "time": 11.48, "lane": 0, "type": "short" },
    { "time": 11.703, "lane": 0, "type": "short" },
    { "time": 11.926, "lane": 0, "type": "short" },
    { "time": 12.23, "lane": 2, "type": "short" },
    { "time": 12.487, "lane": 3, "type": "short" },
    { "time": 12.807, "lane": 2, "type": "short" },
    { "time": 13.079, "lane": 3, "type": "short" },
    { "time": 13.64, "lane": 1, "type": "short" },
    { "time": 13.927, "lane": 0, "type": "short" },
    { "time": 14.182, "lane": 1, "type": "short" },
    { "time": 14.471, "lane": 2, "type": "short" },
    { "time": 14.68, "lane": 3, "type": "short" },
    { "time": 14.872, "lane": 2, "type": "short" },
    { "time": 15.223, "lane": 0, "type": "short" },
    { "time": 15.462, "lane": 0, "type": "short" },
    { "time": 15.831, "lane": 2, "type": "short" },
    { "time": 16.119, "lane": 3, "type": "short" },
    { "time": 16.424, "lane": 2, "type": "short" },
    { "time": 16.631, "lane": 3, "type": "short" },
    { "time": 16.918, "lane": 2, "type": "short" },
    { "time": 17.191, "lane": 1, "type": "short" },
    { "time": 17.48, "lane": 0, "type": "short" },
    { "time": 17.783, "lane": 2, "type": "short" },
    { "time": 18.167, "lane": 3, "type": "short" },
    { "time": 18.647, "lane": 2, "type": "long", "duration": 1.072 },
    { "time": 19.863, "lane": 3, "type": "short" },
    { "time": 20.696, "lane": 2, "type": "short" },
    { "time": 21.017, "lane": 3, "type": "short" },
    { "time": 21.462, "lane": 2, "type": "short" },
    { "time": 21.863, "lane": 3, "type": "short" },
    { "time": 22.871, "lane": 0, "type": "short" },
    { "time": 23.174, "lane": 1, "type": "short" },
    { "time": 23.496, "lane": 0, "type": "short" },
    { "time": 23.671, "lane": 1, "type": "short" },
    { "time": 23.976, "lane": 0, "type": "short" },
    { "time": 24.28, "lane": 2, "type": "short" },
    { "time": 25.048, "lane": 3, "type": "short" },
    { "time": 25.366, "lane": 2, "type": "short" },
    { "time": 25.719, "lane": 3, "type": "short" },
    { "time": 26.152, "lane": 2, "type": "long", "duration": 1.265 },
    { "time": 28.199, "lane": 0, "type": "short" },
    { "time": 28.679, "lane": 1, "type": "short" },
    { "time": 29.158, "lane": 3, "type": "short" },
    { "time": 29.639, "lane": 2, "type": "short" },
    { "time": 30.024, "lane": 3, "type": "short" },
    { "time": 30.279, "lane": 2, "type": "short" },
    { "time": 30.534, "lane": 3, "type": "short" },
    { "time": 30.823, "lane": 0, "type": "short" },
    { "time": 31.288, "lane": 0, "type": "short" },
    { "time": 31.719, "lane": 1, "type": "short" },
    { "time": 32.216, "lane": 2, "type": "short" },
    { "time": 32.487, "lane": 0, "type": "short" },
    { "time": 32.744, "lane": 2, "type": "short" },
    { "time": 33.0, "lane": 3, "type": "short" },
    { "time": 33.496, "lane": 2, "type": "short" },
    { "time": 33.879, "lane": 1, "type": "short" },
    { "time": 34.376, "lane": 2, "type": "short" },
    { "time": 34.599, "lane": 3, "type": "short" },
    { "time": 34.887, "lane": 2, "type": "short" },
    { "time": 35.127, "lane": 0, "type": "short" },
    { "time": 35.607, "lane": 1, "type": "short" },
    { "time": 36.07, "lane": 1, "type": "short" },
    { "time": 36.552, "lane": 2, "type": "short" },
    { "time": 36.791, "lane": 3, "type": "short" },
    { "time": 37.079, "lane": 2, "type": "short" },
    { "time": 37.351, "lane": 0, "type": "short" },
    { "time": 37.895, "lane": 1, "type": "short" },
    { "time": 38.296, "lane": 2, "type": "short" },
    { "time": 38.759, "lane": 3, "type": "short" },
    { "time": 39.016, "lane": 2, "type": "short" },
    { "time": 39.287, "lane": 3, "type": "short" },
    { "time": 39.543, "lane": 2, "type": "short" },
    { "time": 40.039, "lane": 0, "type": "short" },
    { "time": 40.488, "lane": 1, "type": "short" },
    { "time": 40.952, "lane": 2, "type": "short" },
    { "time": 41.191, "lane": 2, "type": "short" },
    { "time": 41.479, "lane": 2, "type": "short" },
    { "time": 41.752, "lane": 0, "type": "short" },
    { "time": 42.135, "lane": 1, "type": "short" },
    { "time": 42.566, "lane": 3, "type": "short" },
    { "time": 42.855, "lane": 2, "type": "short" },
    { "time": 43.207, "lane": 3, "type": "short" },
    { "time": 43.607, "lane": 2, "type": "short" },
    { "time": 43.878, "lane": 3, "type": "long", "duration": 1.571 },
    { "time": 46.087, "lane": 0, "type": "long", "duration": 0.639 },
    { "time": 46.983, "lane": 1, "type": "short" },
    { "time": 47.304, "lane": 2, "type": "short" },
    { "time": 47.623, "lane": 3, "type": "short" },
    { "time": 48.007, "lane": 2, "type": "short" },
    { "time": 48.248, "lane": 0, "type": "short" },
    { "time": 48.632, "lane": 1, "type": "short" },
    { "time": 49.064, "lane": 2, "type": "short" },
    { "time": 50.247, "lane": 3, "type": "short" },
    { "time": 50.535, "lane": 2, "type": "short" },
    { "time": 50.776, "lane": 3, "type": "short" },
    { "time": 51.065, "lane": 2, "type": "short" },
    { "time": 51.302, "lane": 0, "type": "short" },
    { "time": 51.607, "lane": 1, "type": "short" },
    { "time": 51.974, "lane": 2, "type": "short" },
    { "time": 52.408, "lane": 0, "type": "short" },
    { "time": 55.207, "lane": 2, "type": "short" },
    { "time": 55.431, "lane": 0, "type": "short" },
    { "time": 55.671, "lane": 2, "type": "short" },
    { "time": 55.958, "lane": 3, "type": "short" },
    { "time": 56.344, "lane": 2, "type": "short" },
    { "time": 56.774, "lane": 1, "type": "short" },
    { "time": 57.08, "lane": 3, "type": "short" },
    { "time": 57.432, "lane": 2, "type": "short" },
    { "time": 57.895, "lane": 0, "type": "long", "duration": 0.799 },
    { "time": 59.032, "lane": 2, "type": "short" },
    { "time": 59.303, "lane": 3, "type": "short" },
    { "time": 59.575, "lane": 2, "type": "short" },
    { "time": 59.991, "lane": 3, "type": "short" },
    { "time": 60.264, "lane": 1, "type": "short" },
    { "time": 60.439, "lane": 0, "type": "short" },
    { "time": 60.631, "lane": 2, "type": "short" },
    { "time": 60.983, "lane": 3, "type": "short" },
    { "time": 61.335, "lane": 0, "type": "short" },
    { "time": 61.559, "lane": 1, "type": "short" },
    { "time": 61.863, "lane": 2, "type": "short" },
    { "time": 62.119, "lane": 3, "type": "short" },
    { "time": 62.359, "lane": 2, "type": "short" },
    { "time": 62.758, "lane": 0, "type": "short" },
    { "time": 63.064, "lane": 1, "type": "long", "duration": 0.575 },
    { "time": 63.847, "lane": 2, "type": "short" },
    { "time": 64.119, "lane": 3, "type": "short" },
    { "time": 64.375, "lane": 2, "type": "short" },
    { "time": 64.616, "lane": 0, "type": "short" },
    { "time": 64.902, "lane": 1, "type": "short" },
    { "time": 65.222, "lane": 3, "type": "short" },
    { "time": 65.511, "lane": 2, "type": "short" },
    { "time": 66.006, "lane": 0, "type": "short" },
    { "time": 66.278, "lane": 0, "type": "short" },
    { "time": 66.504, "lane": 0, "type": "short" },
    { "time": 66.775, "lane": 2, "type": "short" },
    { "time": 67.031, "lane": 3, "type": "short" },
    { "time": 67.223, "lane": 2, "type": "short" },
    { "time": 67.558, "lane": 1, "type": "short" },
    { "time": 67.831, "lane": 0, "type": "short" },
    { "time": 68.215, "lane": 2, "type": "short" },
    { "time": 68.487, "lane": 3, "type": "short" },
    { "time": 68.727, "lane": 2, "type": "short" },
    { "time": 68.999, "lane": 1, "type": "short" },
    { "time": 69.287, "lane": 0, "type": "short" },
    { "time": 69.576, "lane": 2, "type": "short" },
    { "time": 69.897, "lane": 3, "type": "short" },
    { "time": 70.184, "lane": 2, "type": "short" },
    { "time": 70.567, "lane": 2, "type": "short" },
    { "time": 70.902, "lane": 2, "type": "short" },
    { "time": 71.143, "lane": 1, "type": "short" },
    { "time": 71.576, "lane": 1, "type": "short" },
    { "time": 71.991, "lane": 3, "type": "short" },
    { "time": 72.55, "lane": 2, "type": "short" },
    { "time": 72.776, "lane": 3, "type": "short" },
    { "time": 73.031, "lane": 2, "type": "short" },
    { "time": 73.287, "lane": 0, "type": "short" },
    { "time": 73.575, "lane": 1, "type": "short" },
    { "time": 73.864, "lane": 2, "type": "short" },
    { "time": 74.151, "lane": 0, "type": "short" },
    { "time": 74.663, "lane": 3, "type": "short" },
    { "time": 74.936, "lane": 2, "type": "short" },
    { "time": 75.175, "lane": 1, "type": "short" },
    { "time": 75.48, "lane": 3, "type": "short" },
    { "time": 75.783, "lane": 2, "type": "short" },
    { "time": 75.958, "lane": 3, "type": "short" },
    { "time": 76.327, "lane": 2, "type": "short" },
    { "time": 76.551, "lane": 0, "type": "short" },
    { "time": 76.887, "lane": 2, "type": "short" },
    { "time": 77.192, "lane": 3, "type": "short" },
    { "time": 77.449, "lane": 2, "type": "short" },
    { "time": 77.735, "lane": 1, "type": "short" },
    { "time": 78.006, "lane": 3, "type": "short" },
    { "time": 78.343, "lane": 2, "type": "short" },
    { "time": 78.599, "lane": 0, "type": "short" },
    { "time": 78.919, "lane": 1, "type": "short" },
    { "time": 79.288, "lane": 2, "type": "short" },
    { "time": 79.671, "lane": 3, "type": "long", "duration": 1.103 },
    { "time": 81.11, "lane": 2, "type": "long", "duration": 1.041 },
    { "time": 82.135, "lane": 1, "type": "long", "duration": 0.625 },
    { "time": 82.936, "lane": 0, "type": "long", "duration": 0.688 },
    { "time": 82.952, "lane": 2, "type": "long", "duration": 0.751 }
];

const FALL_SPEED = 400; // Updated speed for more dynamic gameplay
const KEYS = ['d', 'f', 'j', 'k'];

function Stage2Rhythm({ onComplete }) {
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

  // Play hit sounds
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
    const y = canvas.height; // At the bottom (hit line)

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
      if (hpRef.current <= 0) return;
      const currentTime = bgmRef.current ? bgmRef.current.currentTime : (audioCtxRef.current.currentTime - startTimeRef.current);
      
      // Spawn notes
      const lookAhead = 2.0;
      notesRef.current = notesRef.current.filter(note => {
        if (note.time - currentTime <= lookAhead) {
          activeNotesRef.current.push({ 
            ...note, 
            y: 0, 
            hit: false, 
            isHolding: false, 
            headHit: false,
            tailMissed: false
          });
          return false;
        }
        return true;
      });

      // Update positions
      const boardHeight = containerRef.current?.clientHeight * 0.8 || window.innerHeight * 0.8;
      
      activeNotesRef.current = activeNotesRef.current.filter(note => {
        if (note.hit) return false;
        
        const timeToHit = note.time - currentTime;
        note.y = boardHeight - (timeToHit * FALL_SPEED);

        // Long note holding points
        if (note.type === 'long' && note.isHolding) {
          setScore(s => s + 1);
        }

        // Miss detection
        if (note.type === 'short') {
          if (timeToHit < -0.2) {
            handleMiss();
            return false;
          }
        } else { // Long note
          const tailTimeToHit = (note.time + note.duration) - currentTime;
          if (tailTimeToHit < -0.2) {
            if (note.isHolding) { // Successfully finished
              setScore(s => s + 200);
              setCombo(c => c + 1);
              showJudgement('PERFECT');
              emitParticles(note.lane, 'perfect');
            } else if (!note.tailMissed) {
              handleMiss();
            }
            return false;
          }
        }
        return true;
      });

      renderLanes();
      renderParticles();

      // Check end
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
      const laneEl = document.getElementById(`lane-${i}`);
      if (!laneEl) continue;
      laneEl.innerHTML = '';
      
      activeNotesRef.current.filter(n => n.lane === i).forEach(note => {
        if (note.type === 'short') {
          const noteEl = document.createElement('div');
          noteEl.className = 'rhythm-note';
          noteEl.style.top = `${note.y - 10}px`;
          laneEl.appendChild(noteEl);
        } else {
          // Long note body
          const bodyHeight = note.duration * FALL_SPEED;
          const bodyEl = document.createElement('div');
          bodyEl.className = `rhythm-note-body ${note.isHolding ? 'holding' : ''}`;
          bodyEl.style.height = `${bodyHeight}px`;
          bodyEl.style.top = `${note.y - bodyHeight}px`;
          laneEl.appendChild(bodyEl);

          // Long note head
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
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.life)})`;
      ctx.fill();
      return p.life > 0;
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
        let judgementType = 'perfect';
        if (timeDiff <= 0.05) judgementType = 'perfect';
        else if (timeDiff <= 0.12) judgementType = 'great';
        else judgementType = 'good';

        if (targetNote.type === 'short') {
          targetNote.hit = true;
          setScore(s => s + (judgementType === 'perfect' ? 100 : judgementType === 'great' ? 80 : 50));
          setCombo(c => c + 1);
          showJudgement(judgementType.toUpperCase());
          playHitSound(judgementType);
          emitParticles(laneIndex, judgementType);
          triggerComboBump();
          flashPad(laneIndex, judgementType);
        } else {
          targetNote.headHit = true;
          targetNote.isHolding = true;
          showJudgement(judgementType.toUpperCase());
          playHitSound(judgementType);
          flashPad(laneIndex, judgementType);
        }
      } else {
        handleMiss();
        flashPad(laneIndex, 'miss');
      }
    } else {
      handleMiss();
      flashPad(laneIndex, 'miss');
    }
  };

  const handleRelease = (laneIndex) => {
    setActiveKeys(prev => ({ ...prev, [laneIndex]: false }));
    const holdingNote = activeNotesRef.current.find(n => n.lane === laneIndex && n.type === 'long' && n.isHolding);
    if (holdingNote) {
      holdingNote.isHolding = false;
      holdingNote.tailMissed = true;
      handleMiss();
    }
  };

  const triggerComboBump = () => {
    setComboBump(true);
    setTimeout(() => setComboBump(false), 100);
  };

  const flashPad = (laneIndex, type) => {
    const pad = document.getElementById(`pad-${laneIndex}`);
    if (pad) {
      pad.classList.add('active', type);
      setTimeout(() => pad.classList.remove('active', 'perfect', 'great', 'good', 'miss'), 150);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const idx = KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1 && !activeKeys[idx]) {
        handlePress(idx);
      }
    };
    const handleKeyUp = (e) => {
      const idx = KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1) {
        handleRelease(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, activeKeys]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth * 0.8;
        canvasRef.current.height = containerRef.current.clientHeight * 0.8;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, []);

  return (
    <div className="stage2-rhythm-container fade-in" ref={containerRef}>
      <audio ref={bgmRef} src="/audio/stage2.mp3" preload="auto" />
      
      <div className="hud">
        <div className="score">SCORE: {score}</div>
        <div className={`combo ${comboBump ? 'bump' : ''}`}>{combo > 0 ? `${combo} COMBO` : ''}</div>
      </div>

      <div className="hp-bar-container">
        <div className={`hp-bar-fill ${hp <= 20 ? 'danger' : ''}`} style={{ width: `${hp}%` }}></div>
      </div>

      {!isPlaying ? (
        <div className="rhythm-intro glass-panel">
          <h2>Stage 2: 4키 연습</h2>
          <p>D, F, J, K 키 또는 화면 하단을 터치하세요!</p>
          <p>롱노트는 끝까지 누르고 있어야 합니다.</p>
          <button className="start-btn" onClick={startGame}>시작하기</button>
        </div>
      ) : (
        <>
          <div className="judgement-display">
            <span className={`judgement-text ${judgement.toLowerCase()}`}>{judgement}</span>
          </div>

          <div className="rhythm-board">
            <canvas ref={canvasRef} className="particles-canvas"></canvas>
            <div className="lane" id="lane-0"></div>
            <div className="lane" id="lane-1"></div>
            <div className="lane" id="lane-2"></div>
            <div className="lane" id="lane-3"></div>
            <div className="judgement-line"></div>
          </div>

          <div className="hit-pads">
            {KEYS.map((key, i) => (
              <div 
                key={key}
                className={`hit-pad ${activeKeys[i] ? 'active' : ''}`} 
                id={`pad-${i}`}
                data-key={key.toUpperCase()}
                onMouseDown={() => handlePress(i)}
                onMouseUp={() => handleRelease(i)}
                onTouchStart={(e) => { e.preventDefault(); handlePress(i); }}
                onTouchEnd={(e) => { e.preventDefault(); handleRelease(i); }}
              >
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Stage2Rhythm;
