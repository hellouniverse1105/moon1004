import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import './Stage1.css';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 15;

// 0: Floor, 1: Wall, 2: Goal
const MAP_DATA = [
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function Stage1Stealth({ onComplete, onGameOver }) {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 13 });
  const [enemyPos, setEnemyPos] = useState({ x: 5, y: 5 });
  const [enemyDir, setEnemyDir] = useState(1);

  // Vision cone tiles based on enemy pos and dir
  const getVisionCone = (ex, ey, dir) => {
    return [
      { x: ex + dir, y: ey },
      { x: ex + dir * 2, y: ey },
      { x: ex + dir * 2, y: ey - 1 },
      { x: ex + dir * 2, y: ey + 1 },
    ].filter(v => 
      v.x >= 0 && v.x < GRID_WIDTH && 
      v.y >= 0 && v.y < GRID_HEIGHT && 
      MAP_DATA[v.y][v.x] !== 1 // Cannot see through walls
    );
  };

  const visionCone = getVisionCone(enemyPos.x, enemyPos.y, enemyDir);

  const movePlayer = useCallback((dx, dy) => {
    setPlayerPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
        if (MAP_DATA[newY][newX] !== 1) { // Not a wall
          return { x: newX, y: newY };
        }
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyPos(prev => {
        let nextX = prev.x + enemyDir;
        if (nextX >= GRID_WIDTH || nextX < 0 || MAP_DATA[prev.y][nextX] === 1) {
          setEnemyDir(enemyDir * -1);
          return prev;
        }
        return { ...prev, x: nextX };
      });
    }, 800);
    return () => clearInterval(interval);
  }, [enemyDir]);

  useEffect(() => {
    // Check Goal
    if (MAP_DATA[playerPos.y][playerPos.x] === 2) {
      setTimeout(onComplete, 300);
      return;
    }
    
    // Check Game Over
    const isPlayerInVision = visionCone.some(v => v.x === playerPos.x && v.y === playerPos.y);
    const isPlayerOnEnemy = playerPos.x === enemyPos.x && playerPos.y === enemyPos.y;
    
    if (isPlayerInVision || isPlayerOnEnemy) {
      setTimeout(onGameOver, 300);
    }
  }, [playerPos, enemyPos, visionCone, onComplete, onGameOver]);

  return (
    <div className="stage1-container fade-in">
      <div className="stage-header glass-panel">
        <h2>Stage 1: 할머니의 눈을 피해서!</h2>
        <p>붉은 시야를 피해 노란색 현관문으로 가세요</p>
      </div>
      
      <div className="game-grid-wrapper">
        <div className="game-grid-premium">
          {/* Render Map */}
          {MAP_DATA.map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`cell-${x}-${y}`} 
                className={`grid-cell-premium ${cell === 1 ? 'wall' : cell === 2 ? 'goal' : 'floor'}`}
                style={{ left: `${x * 10}%`, top: `${y * (100 / 15)}%`, width: '10%', height: `${100 / 15}%` }}
              >
                {cell === 2 && <div className="goal-glow"></div>}
              </div>
            ))
          )}

          {/* Render Vision Cone */}
          {visionCone.map((v, i) => (
             <div 
               key={`vision-${i}`} 
               className="vision-tile"
               style={{ left: `${v.x * 10}%`, top: `${v.y * (100 / 15)}%`, width: '10%', height: `${100 / 15}%` }}
             ></div>
          ))}

          {/* Render Enemy */}
          <motion.div 
            className="entity-sprite enemy-sprite-wrapper"
            animate={{ left: `${enemyPos.x * 10}%`, top: `${enemyPos.y * (100 / 15)}%` }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{ width: '10%', height: `${100 / 15}%` }}
          >
            <img src="/assets/grandma_chibi.png" alt="Grandma" />
          </motion.div>

          {/* Render Player */}
          <motion.div 
            className="entity-sprite player-sprite-wrapper"
            animate={{ left: `${playerPos.x * 10}%`, top: `${playerPos.y * (100 / 15)}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ width: '10%', height: `${100 / 15}%` }}
          >
            <img src="/assets/luna_chibi.png" alt="Luna" />
          </motion.div>
        </div>
      </div>

      <div className="controls-premium">
        <div className="glass-d-pad">
          <button className="d-btn up" onClick={() => movePlayer(0, -1)}><ArrowUp size={28}/></button>
          <button className="d-btn left" onClick={() => movePlayer(-1, 0)}><ArrowLeft size={28}/></button>
          <button className="d-btn right" onClick={() => movePlayer(1, 0)}><ArrowRight size={28}/></button>
          <button className="d-btn down" onClick={() => movePlayer(0, 1)}><ArrowDown size={28}/></button>
          <div className="d-center"></div>
        </div>
      </div>
    </div>
  );
}

export default Stage1Stealth;
