/**
 * TowerBloxx.tsx
 *
 * A Tower Bloxx-style stacking game.
 * - Block swings on a pendulum arc (true sine-wave motion)
 * - Tall, visually polished blocks with shine + shadow
 * - 1 retry allowed while mid-game; no retry after failing
 * - Scoring: finish 5 blocks → +1J | retry → +1J | no retry → +1P
 */

import { useEffect, useRef, useState, useCallback } from "react";
import "./TowerBloxx.css";
import { useMBTI } from "../context/ScoreContext";
import ads from "../assets/images/ads.jpg";

// ─── Constants ────────────────────────────────────────────────────────────────
const W          = 600;
const H          = 700;
const BLOCK_H    = 45;       // tall blocks
const BASE_W     = 160;
const PIVOT_Y    = 20;       // pendulum pivot from top of canvas
const ARM_LEN    = 260;      // pendulum arm length
const COLORS     = [
  { main: "#378ADD", shine: "#6AB0F5", shadow: "#185FA5" },
  { main: "#1D9E75", shine: "#5DCAA5", shadow: "#0F6E56" },
  { main: "#BA7517", shine: "#EF9F27", shadow: "#854F0B" },
  { main: "#D85A30", shine: "#F0997B", shadow: "#993C1D" },
  { main: "#D4537E", shine: "#ED93B1", shadow: "#993556" },
  { main: "#7F77DD", shine: "#AFA9EC", shadow: "#534AB7" },
  { main: "#639922", shine: "#97C459", shadow: "#3B6D11" },
  { main: "#E24B4A", shine: "#F09595", shadow: "#A32D2D" },
];
const MAX_BLOCKS = 5;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Block {
  x: number;
  w: number;
  colorIdx: number;
}

interface Pendulum {
  angle: number;       // radians from vertical
  angleDelta: number;  // radians per frame
  amplitude: number;   // max angle
  w: number;           // block width
}

interface FallingBlock {
  x: number;
  y: number;
  w: number;
  colorIdx: number;
}

type Phase = "swinging" | "falling" | "done" | "fail";

interface GameState {
  blocks:       Block[];
  pendulum:     Pendulum;
  falling:      FallingBlock | null;
  phase:        Phase;
  camOffset:    number;
  targetCam:    number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeState(): GameState {
  return {
    blocks:    [],
    pendulum:  { angle: -Math.PI / 3, angleDelta: 0.02, amplitude: Math.PI / 3, w: BASE_W },
    falling:   null,
    phase:     "swinging",
    camOffset: 0,
    targetCam: 0,
  };
}

function groundY(): number {
  return H - 36;
}

function stackTopY(blocks: Block[]): number {
  return groundY() - blocks.length * BLOCK_H;
}

// Pendulum tip position
function pendulumTip(p: Pendulum, camOffset: number): { x: number; y: number } {
  return {
    x: W / 2 + Math.sin(p.angle) * ARM_LEN,
    y: PIVOT_Y + Math.cos(p.angle) * ARM_LEN + camOffset,
  };
}

// ─── Main component ───────────────────────────────────────────────────────────
interface TowerBloxxProps {
  onNext?: () => void;
}

export default function TowerBloxx({ onNext }: TowerBloxxProps) {
  const { addScore } = useMBTI();

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef<GameState>(makeState());
  const rafRef     = useRef<number>(0);
  const retryUsed  = useRef(false);

  const [stackCount,  setStackCount]  = useState(0);
  const [phase,       setPhase]       = useState<Phase>("swinging");
  const [showOverlay, setShowOverlay] = useState(false);

  // ── draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    const cam = s.camOffset;

    ctx.clearRect(0, 0, W, H);

    // Sky
    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = "#2a1a0e";
    ctx.fillRect(0, groundY() + cam, W, H);
    ctx.fillStyle = "#3d2810";
    ctx.fillRect(0, groundY() + cam, W, 6);

    // Platform base
    const platX = (W - BASE_W) / 2;
    drawBlock(ctx, platX, groundY() + cam, BASE_W, BLOCK_H, { main: "#666", shine: "#999", shadow: "#333" });

    // Stacked blocks
    for (let i = 0; i < s.blocks.length; i++) {
      const b = s.blocks[i];
      const by = groundY() - (i + 1) * BLOCK_H + cam;
      drawBlock(ctx, b.x, by, b.w, BLOCK_H, COLORS[b.colorIdx]);
    }

    // Falling block
    if (s.falling) {
      const fb = s.falling;
      drawBlock(ctx, fb.x, fb.y, fb.w, BLOCK_H, COLORS[fb.colorIdx]);
    }

    // Pendulum
    if (s.phase === "swinging") {
      const tip = pendulumTip(s.pendulum, cam);
      const pivotScreenY = PIVOT_Y + cam;

      // Crane arm (horizontal bar at top)
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, pivotScreenY);
      ctx.lineTo(W, pivotScreenY);
      ctx.stroke();

      // Rope
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(W / 2, pivotScreenY);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Block hanging from tip
      const p = s.pendulum;
      const bx = tip.x - p.w / 2;
      const by = tip.y;
      drawBlock(ctx, bx, by, p.w, BLOCK_H, COLORS[s.blocks.length % COLORS.length]);
    }
  }, []);

  // ── update ────────────────────────────────────────────────────────────────
  const update = useCallback(() => {
    const s = stateRef.current;

    if (s.phase === "swinging") {
      // Pendulum physics: angle += delta, reflect at amplitude
      s.pendulum.angle += s.pendulum.angleDelta;
      if (Math.abs(s.pendulum.angle) >= s.pendulum.amplitude) {
        s.pendulum.angleDelta *= -1;
        s.pendulum.angle = Math.sign(s.pendulum.angle) * s.pendulum.amplitude;
      }
    }

    if (s.phase === "falling" && s.falling) {
      s.falling.y += 9;
      const landY = stackTopY(s.blocks) - BLOCK_H + s.camOffset;
      if (s.falling.y >= landY) {
        landBlock();
        return;
      }
    }

    // Smooth camera pan — negative offset shifts everything up
    if (s.blocks.length > 2) {
      s.targetCam = -(s.blocks.length - 2) * BLOCK_H;
    }
    s.camOffset += (s.targetCam - s.camOffset) * 0.12;
  }, []);

  // ── land block ────────────────────────────────────────────────────────────
  const landBlock = useCallback(() => {
    const s = stateRef.current;
    const fb = s.falling!;
    let newX = fb.x;
    let newW = fb.w;

    const prev = s.blocks.length === 0
      ? { x: (W - BASE_W) / 2, w: BASE_W }
      : s.blocks[s.blocks.length - 1];

    const overlapLeft  = Math.max(fb.x, prev.x);
    const overlapRight = Math.min(fb.x + fb.w, prev.x + prev.w);
    const overlap      = overlapRight - overlapLeft;

    if (overlap <= 0) {
      s.phase = "fail";
      s.falling = null;
      setPhase("fail");
      triggerFail();
      return;
    }

    newX = overlapLeft;
    newW = overlap;
    s.blocks.push({ x: newX, w: newW, colorIdx: fb.colorIdx });
    s.falling = null;
    setStackCount(s.blocks.length);

    if (s.blocks.length >= MAX_BLOCKS) {
      s.phase = "done";
      setPhase("done");
      triggerFinish();
      return;
    }

    // Next pendulum: slower, narrower
    const newAmplitude = Math.min(Math.PI / 2.2, s.pendulum.amplitude + 0.018);
    const newSpeed     = Math.min(0.065, s.pendulum.angleDelta + 0.003);
    s.pendulum = {
      angle:      -newAmplitude,
      angleDelta: newSpeed,
      amplitude:  newAmplitude,
      w:          Math.max(24, newW),
    };
    s.phase = "swinging";
    setPhase("swinging");
  }, []);

  // ── drop ──────────────────────────────────────────────────────────────────
  const drop = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "swinging") return;

    const tip = pendulumTip(s.pendulum, s.camOffset);
    s.falling = {
      x:        tip.x - s.pendulum.w / 2,
      y:        tip.y,
      w:        s.pendulum.w,
      colorIdx: s.blocks.length % COLORS.length,
    };
    s.phase = "falling";
    setPhase("falling");
  }, []);

  // ── triggers ──────────────────────────────────────────────────────────────
  const triggerFail = useCallback(() => {
    if (!retryUsed.current) addScore({ P: 1 });
    setShowOverlay(true);
    cancelAnimationFrame(rafRef.current);
  }, [addScore]);
  
  const triggerFinish = useCallback(() => {
    addScore({ J: 1 });
    if (!retryUsed.current) addScore({ P: 1 });
    setShowOverlay(true);
    cancelAnimationFrame(rafRef.current);
  }, [addScore]);

  // ── retry ─────────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    if (retryUsed.current) return;
    retryUsed.current = true;
    addScore({ J: 1 });
    stateRef.current = makeState();
    setStackCount(0);
    setPhase("swinging");
  }, [addScore]);

  // ── next ──────────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (onNext) onNext();
  }, [onNext]);

  // ── game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let running = true;

    function loop() {
      if (!running) return;
      update();
      draw();
      const p = stateRef.current.phase;
      if (p !== "done" && p !== "fail") {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase, update, draw]);   // restart loop when phase changes back to swinging

  // ── keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space") { e.preventDefault(); drop(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drop]);

  return (
    <div className="tb-page">
      <img className="tb-game-ads" src={ads} alt="ads">
      </img>

      {/* ── HEADER ── */}
      <div className="tb-header">
        <span className="tb-title">🏗 Tower Bloxx</span>
        <span className="tb-score-pill">{stackCount} / {MAX_BLOCKS}</span>
      </div>
      <div className="tb-game-info">
        <p>Stack 5 blocks to win!</p>
        <p>You may only retry once.</p>
        <p>You can not retry once you have failed the game.</p>
        <p>You can only play the game once.</p>
      </div>

      {/* ── CANVAS ── */}
      <div className="tb-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={drop}
          style={{ cursor: phase === "swinging" ? "pointer" : "default" }}
        />

        {/* Overlay */}
        <div className={`tb-overlay${showOverlay ? " show" : ""}`}>
          <div className="tb-overlay-btns">
            {phase === "done" && onNext && (
              <>
              <div className="tb-overlay-title">Congratulations, you won!</div>
              <button className="tb-btn tb-btn--primary" onClick={handleNext}>
                Skip Ad →
              </button>
              </>
            )}
          </div>
          <div className="tb-overlay-btns">
            {phase === "fail" && onNext && (
              <>
              <div className="tb-overlay-title">Game Over T-T</div>
              <button className="tb-btn tb-btn--primary" onClick={handleNext}>
                Skip Ad →
              </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── DROP BUTTON ── */}
      <div className="tb-drop-area">
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="tb-btn tb-btn--primary"
            onClick={drop}
            disabled={phase !== "swinging"}
          >
            Drop block
          </button>
          <button
            className="tb-btn tb-btn--primary"
            onClick={handleRetry}
            disabled={retryUsed.current || phase === "done" || phase === "fail"}
          >
            {retryUsed.current ? "Retry used" : "Retry (1 left)"}
          </button>
        </div>
        <span className="tb-drop-hint">Click canvas or press Space to drop · Retry resets the game</span>
      </div>

    </div>
  );
}

// ─── Canvas draw helper ───────────────────────────────────────────────────────
function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: { main: string; shine: string; shadow: string }
) {
  if (w < 2) return;

  // Main body
  ctx.fillStyle = color.main;
  ctx.fillRect(x, y, w, h);

  // Top shine strip
  ctx.fillStyle = color.shine;
  ctx.fillRect(x, y, w, 6);

  // Bottom shadow strip
  ctx.fillStyle = color.shadow;
  ctx.fillRect(x, y + h - 5, w, 5);

  // Left edge highlight
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(x, y, 4, h);

  // Right edge shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(x + w - 4, y, 4, h);

  // Subtle inner border
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}
