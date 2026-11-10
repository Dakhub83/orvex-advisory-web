"use client";

import { useEffect, useRef } from "react";

// Decorative background: flakes of gold leaf drifting down and turning, flashing
// softly when they face the light. Drawn on a 2D canvas behind the section text.

type Flake = {
  x: number;
  y: number;
  size: number;
  rotation: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  fall: number;
  swayPhase: number;
  opacity: number;
  shape: [number, number][];
};

function makeFlake(width: number, height: number, anywhere: boolean): Flake {
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : -20,
    size: 5 + Math.random() * 11,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.5,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: 0.5 + Math.random() * 1.1,
    fall: 5 + Math.random() * 9,
    swayPhase: Math.random() * Math.PI * 2,
    opacity: 0.3 + Math.random() * 0.35,
    // Irregular torn-leaf outline.
    shape: Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2;
      const radius = 0.55 + Math.random() * 0.45;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7] as [number, number];
    }),
  };
}

export function GoldLeaf({ density = 1, className = "" }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let frame = 0;
    let visible = true;
    let last = performance.now();
    let time = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // Roughly 10 flakes per 100,000 square pixels at density 1, within limits.
      const count = Math.round(Math.min(40, Math.max(6, ((w * h) / 100_000) * 10 * density)));
      flakes = Array.from({ length: count }, () => makeFlake(w, h, true));
    };

    const draw = (dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const f of flakes) {
        f.y += f.fall * dt;
        f.x += Math.sin(time * 0.6 + f.swayPhase) * 10 * dt;
        f.rotation += f.spin * dt;
        f.flip += f.flipSpeed * dt;
        if (f.y > height + 24) Object.assign(f, makeFlake(width, height, false));

        // Flipping is a horizontal squash; the face is brightest when square to the viewer.
        const facing = Math.cos(f.flip);
        const light = Math.abs(facing);
        const l = 0.35 + 0.65 * light;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.scale(facing || 0.01, 1);
        ctx.beginPath();
        f.shape.forEach(([x, y], i) => (i ? ctx.lineTo(x * f.size, y * f.size) : ctx.moveTo(x * f.size, y * f.size)));
        ctx.closePath();
        ctx.fillStyle = `rgba(${(120 + 130 * l) | 0}, ${(85 + 135 * l) | 0}, ${(25 + 110 * l * l) | 0}, ${f.opacity * (0.55 + 0.45 * light)})`;
        ctx.fill();
        ctx.restore();

        // A soft flash when a flake turns fully toward the light.
        if (light > 0.985) {
          const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 1.6);
          glow.addColorStop(0, `rgba(255, 245, 210, ${0.35 * f.opacity})`);
          glow.addColorStop(1, "rgba(255, 245, 210, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(f.x - f.size * 2, f.y - f.size * 2, f.size * 4, f.size * 4);
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      time += dt;
      resize();
      draw(dt);
      frame = requestAnimationFrame(tick);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      resize();
      if (reduceMotion.matches) {
        draw(0); // one still frame
      } else if (visible && document.visibilityState === "visible") {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(canvas);
    const sizeObserver = new ResizeObserver(() => reduceMotion.matches && update());
    sizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", update);
    reduceMotion.addEventListener("change", update);
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduceMotion.removeEventListener("change", update);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none block ${className}`} />;
}
