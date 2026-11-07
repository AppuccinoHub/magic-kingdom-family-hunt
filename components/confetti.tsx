"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/use-reduced-motion";

const COLORS = ["#E36A4F", "#E3B341", "#1F8A70", "#3C7CB5", "#F4A3C8", "#14233C"];

export function ConfettiBurst({ play }: { play: boolean }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!play || reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const pieces = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: -0.1 - Math.random() * 0.4,
      r: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 0.35 + Math.random() * 0.45,
      drift: -0.12 + Math.random() * 0.24,
      spin: Math.random() * Math.PI,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let frame = 0;
    let raf = 0;
    const draw = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      frame += 1;
      const life = frame / 130;
      pieces.forEach((piece) => {
        piece.y += piece.speed * 0.012;
        piece.x += piece.drift * 0.01;
        piece.spin += 0.04;
        const fade = life > 0.72 ? Math.max(0, 1 - (life - 0.72) / 0.28) : 1;
        context.globalAlpha = fade;
        context.fillStyle = piece.color;
        context.save();
        context.translate(piece.x * width, piece.y * height);
        context.rotate(piece.spin);
        if (piece.shape === "rect") context.fillRect(-piece.r, -piece.r / 2, piece.r * 2, piece.r);
        else context.beginPath(), context.arc(0, 0, piece.r / 1.4, 0, Math.PI * 2), context.fill();
        context.restore();
      });
      context.globalAlpha = 1;
      if (life < 1) raf = requestAnimationFrame(draw);
      else context.clearRect(0, 0, width, height);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [play, reduce]);

  if (!play || reduce) return null;
  return <canvas ref={canvasRef} data-testid="confetti" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
