import React, { useState, useEffect, useRef } from 'react';
import './Stage4.css';

// MIDI Note to Frequency Helper
const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const freqToMidi = (f) => (f > 0) ? 69 + 12 * Math.log2(f / 440) : 0;

// ✅ New Future 멜로디 데이터 (MIDI 번호 기반)
let MELODY_DATA = [
  // 1절: "오직 한 가지 간직하고 있는 건"
  { time: 1.0, duration: 0.4, note: 67 }, { time: 1.5, duration: 0.4, note: 67 },
  { time: 2.0, duration: 0.4, note: 69 }, { time: 2.5, duration: 0.4, note: 67 },
  { time: 3.0, duration: 0.6, note: 65 }, 
  { time: 4.2, duration: 0.3, note: 67 }, { time: 4.6, duration: 0.3, note: 67 },
  { time: 5.0, duration: 0.3, note: 69 }, { time: 5.4, duration: 0.3, note: 67 },
  { time: 5.8, duration: 0.3, note: 65 }, { time: 6.2, duration: 0.3, note: 62 },
  { time: 6.6, duration: 0.6, note: 60 },
  // "지금껏 그려왔던 작은 꿈"
  { time: 7.5, duration: 0.4, note: 67 }, { time: 8.0, duration: 0.4, note: 67 },
  { time: 8.5, duration: 0.4, note: 69 }, { time: 9.0, duration: 0.4, note: 67 },
  { time: 9.5, duration: 0.8, note: 65 },
  // ... 생략된 부분은 유사한 패턴으로 반복
  { time: 12.0, duration: 0.4, note: 67 }, { time: 13.0, duration: 0.4, note: 69 },
  { time: 15.0, duration: 0.4, note: 72 }, { time: 16.0, duration: 0.8, note: 71 },
];

try {
  const savedData = localStorage.getItem('CUSTOM_MELODY_DATA');
  if (savedData) {
    MELODY_DATA = JSON.parse(savedData);
  }
} catch (e) {
  console.log("Error loading custom melody data");
}

const SONG_DURATION = 60;

function Stage4Concert() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerMidi, setPlayerMidi] = useState(0);
  const [showEnding, setShowEnding] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const bgmRef = useRef(null);
  const canvasRef = useRef(null);
  const reqIdRef = useRef(null);
  const containerRef = useRef(null);
  
  // Scoring state refs to avoid re-renders at 60fps
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

  // ✅ 음정 검출 알고리즘 (Autocorrelation)
  const autoCorrelate = (buf, sampleRate) => {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1; // 소리가 너무 작으면 무시

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++)
        c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;
    return sampleRate / T0;
  };

  const startConcert = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      dataArrayRef.current = new Float32Array(analyserRef.current.fftSize);

      if (bgmRef.current) {
        bgmRef.current.currentTime = 0;
        bgmRef.current.play();
      }
      setIsMicEnabled(true);
      setIsPlaying(true);
      
      // Use requestAnimationFrame for loop
      const run = () => {
        updateLoop();
        reqIdRef.current = requestAnimationFrame(run);
      };
      run();
    } catch (err) {
      alert("마이크 권한이 필요합니다!");
    }
  };

  const updateLoop = () => {
    if (!analyserRef.current || !bgmRef.current) return;

    const time = bgmRef.current.currentTime;
    setCurrentTime(time);

    // 1. 음정 분석
    analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);
    const freq = autoCorrelate(dataArrayRef.current, audioContextRef.current.sampleRate);
    const midi = freq > 0 ? freqToMidi(freq) : 0;
    setPlayerMidi(midi);

    // 2. 판정 및 채점
    const currentNote = MELODY_DATA.find(n => time >= n.time && time <= n.time + n.duration);
    if (currentNote && midi > 0) {
      const diff = Math.abs(currentNote.note - midi);
      if (diff <= 1.0) { // 1반음 내외 허용
        scoreRef.current += 1;
        comboRef.current += 1;
        setScore(Math.floor(scoreRef.current / 5));
        setCombo(comboRef.current);
      } else {
        comboRef.current = 0;
        setCombo(0);
      }
    }

    // 3. 렌더링 (Canvas)
    drawPianoRoll(time, midi);

    if (time >= SONG_DURATION) {
      setShowEnding(true);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    }
  };

  const drawPianoRoll = (time, pMidi) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 타겟 노트 (멜로디 바)
    const viewWindow = 4; // 4초치 화면에 표시
    const pixelsPerSec = W / viewWindow;
    const midiMin = 50; 
    const midiMax = 85; 
    const midiRange = midiMax - midiMin;

    MELODY_DATA.forEach(n => {
      if (n.time + n.duration < time || n.time > time + viewWindow) return;

      const x = (n.time - time) * pixelsPerSec;
      const w = n.duration * pixelsPerSec;
      const y = H - ((n.note - midiMin) / midiRange) * H;

      ctx.fillStyle = '#ff6bcb';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff6bcb';
      ctx.fillRect(x, y-10, w, 20);
      ctx.shadowBlur = 0;
    });

    // 판정선 (고정 위치)
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(50, H); ctx.stroke();
    ctx.setLineDash([]);

    // 플레이어 커서 (현재 음정)
    if (pMidi >= midiMin && pMidi <= midiMax) {
      const py = H - ((pMidi - midiMin) / midiRange) * H;
      ctx.fillStyle = '#00f2fe';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.arc(50, py, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = 300;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  if (showEnding) {
    return (
      <div className="ending-screen fade-in-slow">
        <div className="ending-content glass-panel">
          <h1>기적의 콘서트 종료</h1>
          <p>수나의 목소리가 온 세상에 퍼져나갔습니다.</p>
          <div className="final-score">FINAL SCORE: {score}</div>
          <button className="start-btn" onClick={() => window.location.reload()}>다시 하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stage4-container fade-in" ref={containerRef}>
      <audio ref={bgmRef} src="/audio/stage4.mp3" preload="auto" />
      
      {!isPlaying ? (
        <div className="mic-request-screen">
          <div className="mic-card glass-panel">
            <h2>마지막 콘서트: New Future</h2>
            <p>직접 노래를 불러 수나의 목소리를 완성해주세요.</p>
            <button className="start-btn" onClick={startConcert}>공연 시작 (마이크 권한 필요)</button>
          </div>
        </div>
      ) : (
        <>
          <div className="concert-header">
            <div className="score">SCORE: {score}</div>
            <div className="combo">{combo > 0 ? `${combo} COMBO` : ''}</div>
          </div>

          <div className="piano-roll-container">
            <canvas ref={canvasRef} className="pitch-canvas"></canvas>
            <div className="pitch-label">PITCH GUIDE</div>
          </div>

          <div className="stage-visuals">
            <div className="idol-glow" style={{ transform: `scale(${1 + (playerMidi > 0 ? 0.2 : 0)})`, opacity: playerMidi > 0 ? 0.8 : 0.3 }}></div>
            <img src="/assets/fullmoon_idol.png" alt="Suna" className="idol-img" />
          </div>

          <div className="lyrics-overlay">
            <h2>우리가 만들어갈 New Future!</h2>
          </div>
        </>
      )}
    </div>
  );
}

export default Stage4Concert;
