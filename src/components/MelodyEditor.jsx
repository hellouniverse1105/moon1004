import React, { useState, useEffect, useRef } from 'react';
import './Stage4.css'; // Reuse Stage4 styles where possible

function MelodyEditor({ onBack }) {
  const [melodyData, setMelodyData] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const reqIdRef = useRef(null);
  const currentNoteRef = useRef(null);

  // Auto-correlate pitch detection
  const autoCorrelate = (buf, sampleRate) => {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

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
      if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    }
    let T0 = maxpos;
    return sampleRate / T0;
  };

  const freqToMidi = (f) => (f > 0) ? 69 + 12 * Math.log2(f / 440) : 0;

  useEffect(() => {
    const savedData = localStorage.getItem('CUSTOM_MELODY_DATA');
    if (savedData) {
      try {
        setMelodyData(JSON.parse(savedData));
      } catch(e) {}
    }
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('CUSTOM_MELODY_DATA', JSON.stringify(data));
  };

  const clearData = () => {
    if(window.confirm('모든 기록을 삭제하시겠습니까?')) {
      setMelodyData([]);
      saveToStorage([]);
    }
  };

  const handleJsonChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setMelodyData(parsed);
      saveToStorage(parsed);
    } catch(err) {
      // Ignore parse errors while typing
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsRecording(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const startRecording = async () => {
    try {
      if (!audioContextRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        dataArrayRef.current = new Float32Array(analyserRef.current.fftSize);
      }
      
      setMelodyData([]);
      saveToStorage([]);
      
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setIsRecording(true);
      
      const recordLoop = () => {
        if (!isRecording) return;
        
        const time = audioRef.current.currentTime;
        setCurrentTime(time);
        
        analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);
        const freq = autoCorrelate(dataArrayRef.current, audioContextRef.current.sampleRate);
        const midi = freq > 0 ? freqToMidi(freq) : 0;
        
        if (midi > 50 && midi < 90) { // Valid human vocal range roughly
          const roundedMidi = Math.round(midi);
          if (!currentNoteRef.current || currentNoteRef.current.note !== roundedMidi) {
            // Finish previous note
            if (currentNoteRef.current) {
               const newNote = { ...currentNoteRef.current };
               setMelodyData(prev => {
                 const updated = [...prev, newNote];
                 saveToStorage(updated);
                 return updated;
               });
            }
            // Start new note
            currentNoteRef.current = { time: parseFloat(time.toFixed(3)), duration: 0.1, note: roundedMidi };
          } else {
            // Extend current note
            currentNoteRef.current.duration = parseFloat((time - currentNoteRef.current.time).toFixed(3));
          }
        } else {
          // No pitch detected, end current note if exists
          if (currentNoteRef.current) {
             const newNote = { ...currentNoteRef.current };
             if (newNote.duration > 0.1) {
                 setMelodyData(prev => {
                     const updated = [...prev, newNote];
                     saveToStorage(updated);
                     return updated;
                 });
             }
             currentNoteRef.current = null;
          }
        }
        
        reqIdRef.current = requestAnimationFrame(recordLoop);
      };
      
      reqIdRef.current = requestAnimationFrame(recordLoop);
      
    } catch(e) {
      alert("마이크 권한이 필요합니다.");
    }
  };

  useEffect(() => {
    if (!isRecording && reqIdRef.current) {
      cancelAnimationFrame(reqIdRef.current);
    }
  }, [isRecording]);

  useEffect(() => {
    const updateTime = () => {
        if (audioRef.current && isPlaying) setCurrentTime(audioRef.current.currentTime);
        if (isPlaying) requestAnimationFrame(updateTime);
    };
    if (isPlaying) requestAnimationFrame(updateTime);
  }, [isPlaying]);

  return (
    <div className="stage4-container fade-in" style={{ padding: '20px', overflowY: 'auto', display: 'block' }}>
      <audio ref={audioRef} src="/audio/stage4.mp3" onEnded={() => { setIsPlaying(false); setIsRecording(false); }} />
      
      <div className="glass-panel" style={{ position: 'relative', zIndex: 10 }}>
        <h2>Melody Editor (Stage 4)</h2>
        <p>노래에 맞춰 마이크로 노래를 부르면 피치가 자동 기록됩니다. 완료 후 게임에 바로 적용됩니다.</p>
        
        <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="start-btn" onClick={togglePlayback} style={{ padding: '10px' }}>
            {isPlaying && !isRecording ? "일시정지" : "노래 들어보기"}
          </button>
          <button className="start-btn" onClick={startRecording} style={{ padding: '10px', backgroundColor: isRecording ? 'red' : '' }}>
            {isRecording ? "기록 중... (중지하려면 클릭)" : "🎤 내 목소리로 기록 시작"}
          </button>
          <button className="start-btn" onClick={clearData} style={{ padding: '10px', backgroundColor: '#555' }}>
            초기화
          </button>
          <button className="start-btn" onClick={onBack} style={{ padding: '10px', backgroundColor: '#333' }}>
            돌아가기
          </button>
        </div>
        
        <div>현재 시간: {currentTime.toFixed(2)}s</div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>JSON Data (수동 수정 가능)</h3>
          <textarea 
            value={JSON.stringify(melodyData, null, 2)} 
            onChange={handleJsonChange}
            style={{ width: '100%', height: '300px', background: '#222', color: '#0f0', fontFamily: 'monospace', padding: '10px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default MelodyEditor;
