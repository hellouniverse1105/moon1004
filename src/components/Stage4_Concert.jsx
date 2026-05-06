import React, { useState, useEffect, useRef } from 'react';
import './Stage4.css';

const LYRICS = [
  { time: 1, text: "오직 한 가지 간직하고 있는 건" },
  { time: 4, text: "지금껏 그려왔던 작은 꿈" },
  { time: 7, text: "지금의 내 모습 어떻게 보일까?" },
  { time: 10, text: "나 어릴 적 함께한 너에게" },
  { time: 13, text: "저 하늘을 봐 서로 멀리 있어도" },
  { time: 16, text: "함께할 수 있어 나 너에게" },
  { time: 19, text: "언제나 빛나는 둥근 달처럼" },
  { time: 22, text: "너를 기다리고 있을게" },
  { time: 25, text: "너무 늦지 않게 내게 와줘" },
  { time: 28, text: "Let's Sing a Song!" }
];

const SONG_DURATION = 32;

function Stage4Concert() {
  const [volume, setVolume] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showEnding, setShowEnding] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const reqIdRef = useRef(null);

  useEffect(() => {
    // Start the song timer
    if (!isMicEnabled) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setCurrentTime(elapsed);
      if (elapsed >= SONG_DURATION) {
        setShowEnding(true);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isMicEnabled]);

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      setIsMicEnabled(true);
      
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArrayRef.current[i];
        }
        const avg = sum / bufferLength;
        // Normalize 0-100 (avg is usually max around 128-255 depending on loud)
        setVolume(Math.min(100, (avg / 128) * 100));
        
        reqIdRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("마이크 접근을 허용해야 스테이지 4를 진행할 수 있습니다!");
    }
  };

  useEffect(() => {
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Determine current lyric
  const currentLyric = LYRICS.reduce((acc, curr) => {
    return currentTime >= curr.time ? curr.text : acc;
  }, "");

  if (showEnding) {
    return (
      <div className="ending-screen fade-in-slow">
        <div className="ending-content">
          <h1>기적적으로 목소리를 되찾은 루나...</h1>
          <p>수많은 팬들의 응원과 에이치를 향한 마음이 기적을 만들었습니다.</p>
          <br/>
          <h3>~ New Future ~</h3>
          <p>진정한 가수로 거듭난 그녀의 노래는 영원히 계속될 것입니다.</p>
          <br/><br/>
          <p className="credits">개발: Antigravity<br/>원작: 만월을 찾아서 (달빛천사)</p>
          <p className="credits">Thank you for playing!</p>
        </div>
      </div>
    );
  }

  if (!isMicEnabled) {
    return (
      <div className="mic-request-screen">
        <div className="mic-card glass-panel">
          <h2>마지막 콘서트 무대</h2>
          <p>당신의 목소리로 풀문의 마법을 완성해주세요.</p>
          <p className="mic-hint">노래를 부르면 화면의 빛과 야광봉이 반응합니다!</p>
          <button className="start-btn" onClick={requestMic}>마이크 허용 및 시작</button>
        </div>
      </div>
    );
  }

  // Generate some lightsticks
  const lightSticks = Array.from({ length: 20 });

  return (
    <div className="stage4-container fade-in">
      <div className="concert-bg" style={{ backgroundImage: 'url(/assets/concert_bg.png)' }}></div>
      
      {/* Dynamic Aura based on volume */}
      <div 
        className="moon-aura" 
        style={{ 
          opacity: 0.3 + (volume / 100) * 0.7,
          transform: `scale(${1 + (volume / 100) * 0.5})`
        }}
      ></div>

      <div className="idol-wrapper">
        <img 
          src="/assets/fullmoon_idol.png" 
          alt="Full Moon" 
          className="idol-image"
          style={{
            filter: `drop-shadow(0 0 ${10 + (volume / 100) * 30}px rgba(255, 255, 255, 0.8))`
          }}
        />
      </div>

      <div className="lyrics-display">
        <h2 key={currentLyric} className="lyric-text fade-in-fast">{currentLyric}</h2>
        <div className="volume-bar-container">
          <div className="volume-bar" style={{ width: `${volume}%` }}></div>
        </div>
      </div>

      <div className="audience-area">
        {lightSticks.map((_, i) => (
          <div 
            key={i} 
            className="light-stick"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${0.8 - (volume / 100) * 0.4}s`,
              boxShadow: `0 0 ${5 + (volume / 100) * 15}px ${volume > 50 ? '#fff' : '#a64aff'}`,
              backgroundColor: volume > 50 ? '#fff' : '#a64aff'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Stage4Concert;
