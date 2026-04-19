"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type Star = { id: number; top: number; left: number; size: number; duration: number; delay: number };
function generateStars(): Star[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() < 0.7 ? 1 : 2,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 4,
  }));
}

const NAV_ITEMS = [
  { label: "筆記", sub: "NOTES", href: "/notes" },
  { label: "遊戲作品", sub: "GAMES", href: "/games" },
  { label: "其他", sub: "OTHER", href: "/other" },
];

const DINO_W = 36;
const DINO_H = 44;
const OBS_W = 18;
const GRAVITY = 0.7;
const JUMP_FORCE = -12;
const BASE_SPEED = 4;

export default function Home() {
  const [stars, setStars] = useState<Star[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef({
    dinoY: 0, dinoVY: 0, isJumping: false,
    obstacles: [] as { x: number; h: number }[],
    score: 0, speed: BASE_SPEED, frame: 0,
    gameOver: false, started: false, legToggle: 0,
  });
  const rafRef = useRef(0);

  useEffect(() => { setStars(generateStars()); }, []);

  const resetGame = useCallback((start = true) => {
    const g = gs.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ground = canvas.height - 40;
    g.dinoY = ground - DINO_H;
    g.dinoVY = 0; g.isJumping = false;
    g.obstacles = []; g.score = 0;
    g.speed = BASE_SPEED; g.frame = 0;
    g.gameOver = false; g.started = start; g.legToggle = 0;
  }, []);

  const jump = useCallback(() => {
    const g = gs.current;
    if (!g.started || g.gameOver) { resetGame(true); return; }
    if (!g.isJumping) { g.dinoVY = JUMP_FORCE; g.isJumping = true; }
  }, [resetGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const GROUND = H - 40;

    resetGame(false);

    function drawDino(x: number, y: number, dead: boolean, leg: number) {
      const p = 4;
      ctx!.fillStyle = dead ? "#ff5555" : "#00ff41";
      ctx!.fillRect(x + p * 2, y + p, p * 5, p * 4);
      ctx!.fillRect(x + p * 4, y, p * 3, p * 2);
      ctx!.fillRect(x + p * 4, y - p * 3, p * 4, p * 3);
      ctx!.fillRect(x + p * 7, y - p * 2, p, p);
      ctx!.fillStyle = "#000";
      ctx!.fillRect(x + p * 6, y - p * 3, p, p);
      ctx!.fillStyle = dead ? "#ff5555" : "#00ff41";
      ctx!.fillRect(x, y + p * 2, p * 2, p * 2);
      const l1 = leg < 10 ? p * 2 : p;
      const l2 = leg < 10 ? p : p * 2;
      ctx!.fillRect(x + p * 3, y + p * 5, p, l1);
      ctx!.fillRect(x + p * 5, y + p * 5, p, l2);
    }

    function drawCactus(x: number, h: number) {
      ctx!.fillStyle = "#00ff41";
      ctx!.fillRect(x, GROUND - h, OBS_W, h);
      ctx!.fillRect(x - 7, GROUND - h + 8, 7, 12);
      ctx!.fillRect(x + OBS_W, GROUND - h + 12, 7, 10);
      ctx!.fillRect(x - 7, GROUND - h + 8, OBS_W + 14, 5);
    }

    function loop() {
      const g = gs.current;
      ctx!.clearRect(0, 0, W, H);

      ctx!.fillStyle = "#00ff4133";
      ctx!.fillRect(0, GROUND, W, 1);

      if (!g.started) {
        drawDino(60, GROUND - DINO_H, false, 0);
        ctx!.fillStyle = "#00ff41";
        ctx!.font = "10px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("[ SPACE / CLICK TO START ]", W / 2, GROUND - 60);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (g.gameOver) {
        drawDino(60, GROUND - DINO_H, true, 0);
        g.obstacles.forEach(o => drawCactus(o.x, o.h));
        ctx!.fillStyle = "#ff5555";
        ctx!.font = "bold 14px monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("[ GAME OVER ]", W / 2, GROUND - 80);
        ctx!.fillStyle = "#00ff41";
        ctx!.font = "10px monospace";
        ctx!.fillText(`SCORE: ${String(g.score).padStart(5, "0")}`, W / 2, GROUND - 55);
        ctx!.fillText("[ SPACE / CLICK TO RETRY ]", W / 2, GROUND - 35);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      g.frame++;
      g.legToggle = (g.legToggle + 1) % 20;
      g.score = Math.floor(g.frame / 6);
      if (g.frame % 400 === 0) g.speed += 0.4;

      g.dinoVY += GRAVITY;
      g.dinoY += g.dinoVY;
      if (g.dinoY >= GROUND - DINO_H) {
        g.dinoY = GROUND - DINO_H;
        g.dinoVY = 0;
        g.isJumping = false;
      }

      const interval = Math.max(55, 110 - Math.floor(g.score / 8));
      if (g.frame % interval === 0) {
        g.obstacles.push({ x: W + 10, h: 28 + Math.random() * 28 });
      }

      g.obstacles = g.obstacles.filter(o => o.x > -OBS_W - 20);
      for (const o of g.obstacles) {
        o.x -= g.speed;
        drawCactus(o.x, o.h);
        if (
          60 + DINO_W - 10 > o.x + 4 &&
          60 + 10 < o.x + OBS_W - 2 &&
          g.dinoY + DINO_H - 6 > GROUND - o.h
        ) {
          g.gameOver = true;
        }
      }

      drawDino(60, g.dinoY, false, g.legToggle);
      ctx!.fillStyle = "#00ff41";
      ctx!.font = "10px monospace";
      ctx!.textAlign = "right";
      ctx!.fillText(String(g.score).padStart(5, "0"), W - 12, 20);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [resetGame]);

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: "#000", color: "#00ff41", fontFamily: "monospace" }}>
      {/* 星點背景 */}
      {stars.map((star) => (
        <span key={star.id} className="star" style={{
          top: `${star.top}%`, left: `${star.left}%`,
          width: `${star.size}px`, height: `${star.size}px`,
          background: "#00ff4155",
          animationDuration: `${star.duration}s`,
          animationDelay: `${star.delay}s`,
        }} />
      ))}

      {/* 標題 */}
      <header className="relative z-10 text-center py-10">
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(12px, 2.5vw, 24px)",
          color: "#00ff41",
          textShadow: "0 0 10px #00ff41, 0 0 20px #00ff4188",
          letterSpacing: "0.05em",
        }}>
          史萊海姆的遊戲小屋
        </h1>
        <div style={{ color: "#00ff4166", fontSize: "11px", marginTop: "8px", letterSpacing: "4px" }}>
          ── SLIME HEIM GAME HUT ──
        </div>
      </header>

      {/* 主要按鈕區 */}
      <section className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
          width: "100%",
          maxWidth: "700px",
        }}>
          {NAV_ITEMS.map((item, i) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  border: `1px solid ${hovered === i ? "#00ff41" : "#00ff4155"}`,
                  background: hovered === i ? "#00ff4111" : "transparent",
                  boxShadow: hovered === i ? "0 0 16px #00ff4144, inset 0 0 16px #00ff4111" : "none",
                  padding: "32px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  minHeight: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "clamp(11px, 1.8vw, 16px)",
                  color: hovered === i ? "#00ff41" : "#aaffcc",
                  textShadow: hovered === i ? "0 0 8px #00ff41" : "none",
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "10px", color: "#00ff4166", letterSpacing: "3px" }}>
                  {item.sub}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 恐龍遊戲 */}
      <div className="relative z-10 flex justify-center px-4 pb-4" style={{ height: "30vh" }}>
        <canvas
          ref={canvasRef}
          width={720}
          height={180}
          onClick={jump}
          className="w-full max-w-2xl cursor-pointer"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </main>
  );
}
