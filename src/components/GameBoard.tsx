import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { Match3Engine, MatchResult } from '../game/engine';
import { CrystalRenderer } from '../game/renderer';
import { ParticleSystem } from '../game/particles';
import { Sound } from '../game/audio';
import { BoosterType, LevelObjective, TilePiece } from '../types/game';
import {
  Sparkles,
  Flame,
  Zap,
  RotateCcw,
  Pause,
  Award,
  Star,
  ChevronLeft,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameBoardProps {
  onPause: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ onPause }) => {
  const {
    activeLevel,
    isEndlessMode,
    onLevelWon,
    onLevelLost,
    useBooster,
    profile,
    setScreen
  } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Engine & VFX
  const engineRef = useRef<Match3Engine | null>(null);
  const vfxRef = useRef<ParticleSystem>(new ParticleSystem());
  const animFrameRef = useRef<number | null>(null);

  // Gameplay State
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(activeLevel?.moves || 30);
  const [objectives, setObjectives] = useState<LevelObjective[]>(
    activeLevel ? JSON.parse(JSON.stringify(activeLevel.objectives)) : []
  );
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [selectedPos, setSelectedPos] = useState<{ r: number; c: number } | null>(null);
  const [hintPos, setHintPos] = useState<[number, number, number, number] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBooster, setActiveBooster] = useState<BoosterType | null>(null);
  const [comboBanner, setComboBanner] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Touch Tracking
  const touchStartPos = useRef<{ x: number; y: number; r: number; c: number } | null>(null);
  const lastInteractionTime = useRef<number>(Date.now());

  // Board layout metrics
  const layoutRef = useRef({
    tileSize: 50,
    offsetX: 0,
    offsetY: 0,
    width: 400,
    height: 400
  });

  // Calculate current stars
  const starScores = activeLevel?.starScores || [5000, 10000, 20000];
  const currentStars = score >= starScores[2] ? 3 : score >= starScores[1] ? 2 : score >= starScores[0] ? 1 : 0;
  const starPercent = Math.min(100, Math.round((score / starScores[2]) * 100));

  // Initialize Game Engine
  useEffect(() => {
    const rows = activeLevel?.rows || 8;
    const cols = activeLevel?.cols || 8;
    const allowedColors = activeLevel?.allowedColors || ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'];

    const engine = new Match3Engine(rows, cols, allowedColors);
    engine.initializeBoard(activeLevel?.initialObstacles);
    engineRef.current = engine;

    setScore(0);
    setMovesLeft(activeLevel?.moves || (isEndlessMode ? 99 : 30));
    setObjectives(activeLevel ? JSON.parse(JSON.stringify(activeLevel.objectives)) : []);
    setComboMultiplier(1);
    setSelectedPos(null);
    setIsProcessing(false);
    lastInteractionTime.current = Date.now();

    Sound.startAmbientBgm();

    return () => {
      Sound.stopAmbientBgm();
    };
  }, [activeLevel, isEndlessMode]);

  // Check Objectives completion
  const checkWinLossConditions = useCallback(
    (currentScore: number, currentMoves: number, currentObjs: LevelObjective[]) => {
      if (isEndlessMode) return;

      const allObjectivesDone = currentObjs.every((obj) => obj.current >= obj.target);

      if (allObjectivesDone) {
        setIsProcessing(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        Sound.playVictory();
        setTimeout(() => {
          onLevelWon(activeLevel!.id, Math.max(1, currentStars), currentScore);
        }, 1200);
        return;
      }

      if (currentMoves <= 0) {
        setIsProcessing(true);
        Sound.playDefeat();
        setTimeout(() => {
          const firstIncomplete = currentObjs.find((obj) => obj.current < obj.target);
          onLevelLost(currentScore, firstIncomplete ? firstIncomplete.description : 'Out of moves!');
        }, 800);
      }
    },
    [activeLevel, currentStars, isEndlessMode, onLevelLost, onLevelWon]
  );

  // Resize Canvas to fit container with responsive high-DPI scaling
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cols = engineRef.current?.cols || 8;
    const rows = engineRef.current?.rows || 8;

    // Determine max tile size that fits with padding
    const padding = 20;
    const availWidth = width - padding * 2;
    const availHeight = height - padding * 2;
    const tileSize = Math.floor(Math.min(availWidth / cols, availHeight / rows));

    const boardWidth = cols * tileSize;
    const boardHeight = rows * tileSize;
    const offsetX = Math.floor((width - boardWidth) / 2);
    const offsetY = Math.floor((height - boardHeight) / 2);

    layoutRef.current = { tileSize, offsetX, offsetY, width, height };
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Main Cascade Resolution Loop
  const resolveBoardCascades = useCallback(
    async (lastSwapped?: { r: number; c: number }) => {
      const engine = engineRef.current;
      if (!engine) return;

      setIsProcessing(true);
      let currentCombo = 1;
      let hasMatches = true;

      while (hasMatches) {
        const result: MatchResult = engine.processMatches(lastSwapped, currentCombo);

        if (result.matchedTiles.length === 0) {
          hasMatches = false;
          break;
        }

        // Play audio & spawn VFX for matches
        Sound.playMatch(currentCombo);

        // Combo announcement
        if (currentCombo === 2) setComboBanner('COMBO x2!');
        else if (currentCombo === 3) setComboBanner('SUPER COMBO!');
        else if (currentCombo === 4) setComboBanner('MEGA COMBO!');
        else if (currentCombo >= 5) setComboBanner('ULTRA ASTRAL COMBO!');

        const { tileSize, offsetX, offsetY } = layoutRef.current;

        // Spawn particles and floating score numbers
        result.matchedTiles.forEach(({ row, col, tile }) => {
          const px = offsetX + col * tileSize + tileSize / 2;
          const py = offsetY + row * tileSize + tileSize / 2;
          vfxRef.current.spawnMatchExplosion(px, py, tile.color);
        });

        // Spawn floating score badge
        if (result.matchedTiles.length > 0) {
          const midTile = result.matchedTiles[Math.floor(result.matchedTiles.length / 2)];
          const mx = offsetX + midTile.col * tileSize + tileSize / 2;
          const my = offsetY + midTile.row * tileSize + tileSize / 2;
          vfxRef.current.spawnFloatingText(mx, my, `+${result.scoreGained}`, '#ffea00', 22);
        }

        // Update score
        setScore((prev) => {
          const newScore = prev + result.scoreGained;
          return newScore;
        });

        // Update objectives progress
        setObjectives((prev) =>
          prev.map((obj) => {
            let increment = 0;
            if (obj.type === 'score') {
              return { ...obj, current: obj.current + result.scoreGained };
            } else if (obj.type === 'clear_ice') {
              increment = result.clearedIce;
            } else if (obj.type === 'clear_cages') {
              increment = result.clearedCages;
            } else if (obj.type === 'collect_gems' && obj.gemColor) {
              increment = result.collectedColors[obj.gemColor] || 0;
            }
            return { ...obj, current: Math.min(obj.target, obj.current + increment) };
          })
        );

        // Pause for match explosion animation
        await new Promise((r) => setTimeout(r, 260));

        // Apply Gravity and Refill
        engine.applyGravityAndRefill();

        // Pause for tile drop settle
        await new Promise((r) => setTimeout(r, 240));

        currentCombo++;
        setComboMultiplier(currentCombo);
      }

      setComboBanner(null);
      setComboMultiplier(1);

      // Check if board has any valid moves; if not, smart shuffle!
      if (!engine.hasPossibleMoves()) {
        setIsShuffling(true);
        Sound.playSuperPrism();
        await new Promise((r) => setTimeout(r, 600));
        engine.smartShuffle();
        setIsShuffling(false);
      }

      setIsProcessing(false);
      lastInteractionTime.current = Date.now();
    },
    []
  );

  // Execute Swap
  const handleSwap = useCallback(
    async (r1: number, c1: number, r2: number, c2: number) => {
      const engine = engineRef.current;
      if (!engine || isProcessing) return;

      if (!engine.isValidSwap(r1, c1, r2, c2)) {
        Sound.playInvalid();
        setSelectedPos(null);
        return;
      }

      setIsProcessing(true);
      Sound.playSwap();

      // Check for Special + Special combo direct activation
      const t1 = engine.grid[r1][c1];
      const t2 = engine.grid[r2][c2];
      const isSpecialCombo =
        (t1 && t2 && t1.special !== 'none' && t2.special !== 'none') ||
        (t1 && t1.special === 'super_prism') ||
        (t2 && t2.special === 'super_prism');

      if (isSpecialCombo) {
        Sound.playSuperPrism();
        const comboResult = engine.executeSpecialCombo(r1, c1, r2, c2, 2);

        if (comboResult.specialComboTriggered) {
          setComboBanner(comboResult.specialComboTriggered);
        }

        const { tileSize, offsetX, offsetY } = layoutRef.current;
        comboResult.matchedTiles.forEach(({ row, col, tile }) => {
          const px = offsetX + col * tileSize + tileSize / 2;
          const py = offsetY + row * tileSize + tileSize / 2;
          vfxRef.current.spawnMatchExplosion(px, py, tile.color, 24);
        });

        setScore((prev) => prev + comboResult.scoreGained);

        // Decrement moves
        const nextMoves = movesLeft - 1;
        setMovesLeft(nextMoves);

        await new Promise((r) => setTimeout(r, 350));
        engine.applyGravityAndRefill();
        await new Promise((r) => setTimeout(r, 260));

        await resolveBoardCascades();

        setObjectives((prev) => {
          checkWinLossConditions(score + comboResult.scoreGained, nextMoves, prev);
          return prev;
        });

        setSelectedPos(null);
        setIsProcessing(false);
        return;
      }

      // Normal swap
      engine.swap(r1, c1, r2, c2);
      setSelectedPos(null);

      // Decrement moves
      const nextMoves = movesLeft - 1;
      setMovesLeft(nextMoves);

      // Resolve cascade
      await resolveBoardCascades({ r: r2, c: c2 });

      // Check win/loss
      setObjectives((prev) => {
        checkWinLossConditions(score, nextMoves, prev);
        return prev;
      });
    },
    [checkWinLossConditions, isProcessing, movesLeft, resolveBoardCascades, score]
  );

  // Handle Booster Click on Tile
  const handleBoosterTileClick = useCallback(
    async (r: number, c: number) => {
      const engine = engineRef.current;
      if (!engine || !activeBooster || isProcessing) return;

      const success = useBooster(activeBooster);
      if (!success) {
        setActiveBooster(null);
        return;
      }

      setIsProcessing(true);
      const { tileSize, offsetX, offsetY } = layoutRef.current;
      const px = offsetX + c * tileSize + tileSize / 2;
      const py = offsetY + r * tileSize + tileSize / 2;

      let result: MatchResult | null = null;
      if (activeBooster === 'hammer') {
        Sound.playBomb();
        vfxRef.current.spawnBombBlast(px, py, 'ruby');
        result = engine.useHammer(r, c);
      } else if (activeBooster === 'nova') {
        Sound.playBomb();
        vfxRef.current.spawnBombBlast(px, py, 'topaz');
        result = engine.useNovaBooster(r, c);
      } else if (activeBooster === 'lightning') {
        Sound.playBeam();
        vfxRef.current.spawnBeam('horizontal', r);
        vfxRef.current.spawnBeam('vertical', c);
        result = engine.useLightningBooster(r, c);
      }

      setActiveBooster(null);

      if (result) {
        setScore((prev) => prev + result!.scoreGained);
        await new Promise((res) => setTimeout(res, 280));
        engine.applyGravityAndRefill();
        await new Promise((res) => setTimeout(res, 220));
        await resolveBoardCascades();
      }

      setIsProcessing(false);
    },
    [activeBooster, isProcessing, resolveBoardCascades, useBooster]
  );

  // Click / Tap Event Handler
  const handleTilePress = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current || isProcessing) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const { tileSize, offsetX, offsetY } = layoutRef.current;
      const col = Math.floor((x - offsetX) / tileSize);
      const row = Math.floor((y - offsetY) / tileSize);

      const engine = engineRef.current;
      if (!engine || row < 0 || row >= engine.rows || col < 0 || col >= engine.cols) {
        setSelectedPos(null);
        return;
      }

      lastInteractionTime.current = Date.now();
      setHintPos(null);

      // If a booster is selected, execute on this tile
      if (activeBooster) {
        handleBoosterTileClick(row, col);
        return;
      }

      if (!selectedPos) {
        // Select tile
        const tile = engine.grid[row][col];
        if (tile && tile.obstacle !== 'stone' && tile.obstacle !== 'cage') {
          Sound.playClick();
          setSelectedPos({ r: row, c: col });
        }
      } else {
        // Already selected tile, check if swap or re-select
        if (selectedPos.r === row && selectedPos.c === col) {
          setSelectedPos(null);
        } else if (engine.isAdjacent(selectedPos.r, selectedPos.c, row, col)) {
          handleSwap(selectedPos.r, selectedPos.c, row, col);
        } else {
          // Select new tile
          const tile = engine.grid[row][col];
          if (tile && tile.obstacle !== 'stone' && tile.obstacle !== 'cage') {
            Sound.playClick();
            setSelectedPos({ r: row, c: col });
          } else {
            setSelectedPos(null);
          }
        }
      }
    },
    [activeBooster, handleBoosterTileClick, handleSwap, isProcessing, selectedPos]
  );

  // Touch Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (isProcessing) return;
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const { tileSize, offsetX, offsetY } = layoutRef.current;
    const col = Math.floor((x - offsetX) / tileSize);
    const row = Math.floor((y - offsetY) / tileSize);

    const engine = engineRef.current;
    if (engine && row >= 0 && row < engine.rows && col >= 0 && col < engine.cols) {
      touchStartPos.current = { x: touch.clientX, y: touch.clientY, r: row, c: col };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || isProcessing) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 15) {
      // Tap gesture
      handleTilePress(touch.clientX, touch.clientY);
    } else {
      // Swipe gesture
      const { r, c } = touchStartPos.current;
      let targetR = r;
      let targetC = c;

      if (Math.abs(dx) > Math.abs(dy)) {
        targetC += dx > 0 ? 1 : -1;
      } else {
        targetR += dy > 0 ? 1 : -1;
      }

      const engine = engineRef.current;
      if (engine && targetR >= 0 && targetR < engine.rows && targetC >= 0 && targetC < engine.cols) {
        handleSwap(r, c, targetR, targetC);
      }
    }

    touchStartPos.current = null;
  };

  // Idle Hint Checker
  useEffect(() => {
    const hintInterval = setInterval(() => {
      if (isProcessing || selectedPos) return;
      const idleTime = Date.now() - lastInteractionTime.current;
      if (idleTime > 4000) {
        const hint = engineRef.current?.findHint();
        if (hint) setHintPos(hint);
      }
    }, 1500);

    return () => clearInterval(hintInterval);
  }, [isProcessing, selectedPos]);

  // Main Canvas Render Loop (60 FPS)
  useEffect(() => {
    let animTime = 0;

    const render = () => {
      animTime += 0.016;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);

      const { tileSize, offsetX, offsetY, width, height } = layoutRef.current;

      // Clear Canvas with luxury translucent background
      ctx.clearRect(0, 0, width, height);

      // Render Board Matrix Background Container
      const engine = engineRef.current;
      if (engine) {
        const boardW = engine.cols * tileSize;
        const boardH = engine.rows * tileSize;

        ctx.save();
        ctx.fillStyle = 'rgba(12, 18, 32, 0.75)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(offsetX - 8, offsetY - 8, boardW + 16, boardH + 16, 18);
        ctx.fill();
        ctx.stroke();

        // Render Grid Cells
        for (let r = 0; r < engine.rows; r++) {
          for (let c = 0; c < engine.cols; c++) {
            const cellX = offsetX + c * tileSize;
            const cellY = offsetY + r * tileSize;
            const isAlt = (r + c) % 2 === 0;

            ctx.fillStyle = isAlt ? 'rgba(25, 38, 64, 0.45)' : 'rgba(16, 26, 46, 0.45)';
            ctx.beginPath();
            ctx.roundRect(cellX + 2, cellY + 2, tileSize - 4, tileSize - 4, 8);
            ctx.fill();
          }
        }
        ctx.restore();

        // Render Tile Pieces
        for (let r = 0; r < engine.rows; r++) {
          for (let c = 0; c < engine.cols; c++) {
            const tile = engine.grid[r][c];
            if (!tile) continue;

            const tileX = offsetX + c * tileSize;
            const tileY = offsetY + r * tileSize;

            const isSelected = selectedPos?.r === r && selectedPos?.c === c;
            const isHinted =
              hintPos &&
              ((hintPos[0] === r && hintPos[1] === c) || (hintPos[2] === r && hintPos[3] === c));

            CrystalRenderer.drawTile(
              ctx,
              tile,
              tileX,
              tileY,
              tileSize,
              !!isSelected,
              !!isHinted,
              animTime
            );
          }
        }
      }

      // Update and Render VFX
      vfxRef.current.update();
      vfxRef.current.render(
        ctx,
        tileSize,
        offsetX,
        offsetY,
        engine?.rows || 8,
        engine?.cols || 8
      );

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hintPos, selectedPos]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#070b16] via-[#0d1628] to-[#060912] select-none overflow-hidden">
      {/* Top HUD: Level Info, Objectives & Moves */}
      <div className="w-full pt-3 px-4 pb-2 z-10 flex flex-col gap-2 bg-slate-900/60 backdrop-blur-md border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onPause}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 active:scale-95 transition"
            >
              <Pause className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                {isEndlessMode ? 'Endless Realm' : `Level ${activeLevel?.id || 1}`}
              </span>
              <h2 className="text-sm font-black text-white tracking-wide">
                {isEndlessMode ? 'Infinite Astral Spire' : activeLevel?.title || 'Realm Gate'}
              </h2>
            </div>
          </div>

          {/* Moves Remaining Badge */}
          <div
            className={`px-4 py-1.5 rounded-2xl border flex items-center gap-1.5 transition-all ${
              movesLeft <= 5
                ? 'bg-red-950/80 border-red-500 animate-pulse text-red-400'
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <span className="text-xs uppercase font-bold tracking-wider">Moves</span>
            <span className="text-xl font-black">{movesLeft}</span>
          </div>
        </div>

        {/* Objectives & 3-Star Bar */}
        <div className="grid grid-cols-2 gap-2 items-center">
          {/* Objectives Chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {objectives.map((obj, idx) => {
              const isDone = obj.current >= obj.target;
              return (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded-lg border text-xs flex items-center gap-1 font-semibold ${
                    isDone
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/70 border-slate-700 text-slate-300'
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span>
                    {obj.type === 'score'
                      ? `${score.toLocaleString()}/${obj.target.toLocaleString()}`
                      : `${obj.current}/${obj.target}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Star & Score Meter */}
          <div className="flex flex-col gap-1 items-end">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  className={`w-4 h-4 transition-all duration-300 ${
                    currentStars >= starNum
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-110'
                      : 'text-slate-600'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-slate-200 ml-1">
                {score.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300 rounded-full"
                style={{ width: `${starPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Center: Game Board Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full flex items-center justify-center p-2 touch-none overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onClick={(e) => handleTilePress(e.clientX, e.clientY)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="cursor-pointer select-none"
        />

        {/* Shuffling Announcement */}
        {isShuffling && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="text-center animate-bounce">
              <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-2 animate-spin" />
              <h3 className="text-2xl font-black text-cyan-300 tracking-wider">
                NO MOVES DETECTED!
              </h3>
              <p className="text-sm text-slate-400">Harmonizing the Crystal Realm...</p>
            </div>
          </div>
        )}

        {/* Dynamic Combo Banner */}
        {comboBanner && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
            <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 border border-amber-300 text-white font-black text-lg shadow-[0_0_25px_rgba(245,158,11,0.8)] tracking-wider uppercase">
              {comboBanner}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Boosters Tray */}
      <div className="w-full px-4 py-3 bg-slate-900/80 backdrop-blur-md border-t border-cyan-500/20 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Booster: Crystal Hammer */}
          <button
            onClick={() => setActiveBooster(activeBooster === 'hammer' ? null : 'hammer')}
            disabled={profile.boosters.hammer <= 0 || isProcessing}
            className={`relative p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
              activeBooster === 'hammer'
                ? 'bg-rose-900/80 border-rose-400 scale-105 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 active:scale-95'
            } ${profile.boosters.hammer <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Sparkles className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] font-bold text-slate-300">Hammer</span>
            <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {profile.boosters.hammer}
            </span>
          </button>

          {/* Booster: Cosmic Nova */}
          <button
            onClick={() => setActiveBooster(activeBooster === 'nova' ? null : 'nova')}
            disabled={profile.boosters.nova <= 0 || isProcessing}
            className={`relative p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
              activeBooster === 'nova'
                ? 'bg-amber-900/80 border-amber-400 scale-105 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 active:scale-95'
            } ${profile.boosters.nova <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-300">Nova</span>
            <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {profile.boosters.nova}
            </span>
          </button>

          {/* Booster: Lightning */}
          <button
            onClick={() => setActiveBooster(activeBooster === 'lightning' ? null : 'lightning')}
            disabled={profile.boosters.lightning <= 0 || isProcessing}
            className={`relative p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
              activeBooster === 'lightning'
                ? 'bg-cyan-900/80 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(56,189,248,0.6)]'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 active:scale-95'
            } ${profile.boosters.lightning <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-bold text-slate-300">Lightning</span>
            <span className="absolute -top-1.5 -right-1.5 bg-cyan-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {profile.boosters.lightning}
            </span>
          </button>

          {/* Booster: Shuffle */}
          <button
            onClick={() => {
              if (profile.boosters.shuffle > 0 && !isProcessing) {
                useBooster('shuffle');
                engineRef.current?.smartShuffle();
                Sound.playSwap();
              }
            }}
            disabled={profile.boosters.shuffle <= 0 || isProcessing}
            className={`relative p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all bg-slate-800/80 border-slate-700 hover:border-slate-500 active:scale-95 ${
              profile.boosters.shuffle <= 0 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <RotateCcw className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] font-bold text-slate-300">Shuffle</span>
            <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {profile.boosters.shuffle}
            </span>
          </button>
        </div>

        {/* Active Booster Prompt */}
        {activeBooster && (
          <div className="mt-2 text-center flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-amber-300 animate-pulse">
              Tap any tile on the board to deploy {activeBooster.toUpperCase()}
            </span>
            <button
              onClick={() => setActiveBooster(null)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-0.5 bg-slate-800 px-2 py-0.5 rounded-full"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
