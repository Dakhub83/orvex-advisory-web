"use client";

import { useEffect, useRef } from "react";

// Decorative: a trickle of gold grains falling onto a heap that glints as the
// light catches individual grains. 2D canvas with pre-rendered grain sprites.

const SIZES = [1.4, 1.8, 2.2, 2.7];

type Falling = { x: number; y: number; vx: number; vy: number; size: number; bounced: boolean };
type Glint = { x: number; y: number; life: number; max: number };

function grainSprite(radius: number, light: number, dpr: number) {
  const size = Math.ceil(radius * 2 * dpr) + 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  const r = (size - 2) / 2;
  const grad = g.createRadialGradient(size / 2 - r * 0.35, size / 2 - r * 0.35, r * 0.05, size / 2, size / 2, r);
  grad.addColorStop(0, `rgb(255, ${(238 + 17 * light) | 0}, ${(170 + 60 * light) | 0})`);
  grad.addColorStop(0.35, `rgb(${(226 + 25 * light) | 0}, ${(178 + 30 * light) | 0}, ${(70 + 30 * light) | 0})`);
  grad.addColorStop(0.8, "rgb(150, 104, 30)");
  grad.addColorStop(1, "rgba(70, 45, 10, 0.9)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(size / 2, size / 2, r, 0, Math.PI * 2);
  g.fill();
  return canvas;
}

function sparkleSprite(dpr: number) {
  const s = 24 * dpr;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const g = canvas.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(255,250,225,1)");
  grad.addColorStop(0.15, "rgba(255,230,160,.6)");
  grad.addColorStop(1, "rgba(255,200,90,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = "rgba(255,248,220,.8)";
  g.lineWidth = dpr;
  g.beginPath();
  g.moveTo(s / 2, 2);
  g.lineTo(s / 2, s - 2);
  g.moveTo(2, s / 2);
  g.lineTo(s - 2, s / 2);
  g.stroke();
  return canvas;
}

export function GoldGrains({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sprites = SIZES.map((r) => [0, 0.5, 1].map((light) => grainSprite(r, light, dpr)));
    const sparkle = sparkleSprite(dpr);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    // Stream and heap position: right of centre beside the text on wide screens,
    // centred and relatively larger in the narrow band on phones.
    let center = 0.62;
    let heapHeight = 0.3;
    let heapSpread = 0.2;
    let heap: HTMLCanvasElement | null = null;
    let surfaceGrains: { x: number; y: number }[] = [];
    const falling: Falling[] = [];
    const glints: Glint[] = [];

    const surface = (x: number) =>
      height - height * heapHeight * Math.exp(-(((x - width * center) / Math.max(width * heapSpread, 110)) ** 2)) - height * 0.03;

    const drawSprite = (target: CanvasRenderingContext2D, sprite: HTMLCanvasElement, x: number, y: number) => {
      const w = sprite.width / dpr;
      target.drawImage(sprite, x - w / 2, y - w / 2, w, w);
    };

    // The heap is static, so it is drawn once per size onto an offscreen canvas.
    const buildHeap = () => {
      heap = document.createElement("canvas");
      heap.width = canvas.width;
      heap.height = canvas.height;
      const h = heap.getContext("2d")!;
      h.setTransform(dpr, 0, 0, dpr, 0, 0);
      const glow = h.createRadialGradient(width * center, height * 0.88, 0, width * center, height * 0.88, width * 0.45);
      glow.addColorStop(0, "rgba(214,150,52,0.30)");
      glow.addColorStop(0.5, "rgba(180,110,30,0.10)");
      glow.addColorStop(1, "rgba(180,110,30,0)");
      h.fillStyle = glow;
      h.fillRect(0, 0, width, height);
      surfaceGrains = [];
      const count = Math.round((width * height) / 55);
      for (let i = 0; i < count; i++) {
        const x = width * center + (Math.random() - 0.5) * width * 0.9;
        const top = surface(x);
        if (top > height - 2) continue;
        const depth = Math.pow(Math.random(), 2.2) * (height - top); // denser near the visible surface
        const shade = depth < 6 ? 2 : depth < 30 ? 1 : 0;
        h.globalAlpha = Math.max(0.35, 1 - depth / (height * 0.35));
        drawSprite(h, sprites[(Math.random() * SIZES.length) | 0][shade], x, top + depth);
        if (depth < 4) surfaceGrains.push({ x, y: top + depth });
      }
      h.globalAlpha = 1;
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === width && h === height) return;
      width = w;
      height = h;
      const narrow = w < 640;
      center = narrow ? 0.5 : 0.62;
      heapHeight = narrow ? 0.42 : 0.3;
      heapSpread = narrow ? 0.3 : 0.2;
      falling.length = 0;
      // A hidden canvas (the phone version on desktop, or the reverse) has no size: draw nothing.
      if (!w || !h) {
        heap = null;
        return;
      }
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      buildHeap();
    };

    const spawn = () => {
      const spread = (Math.random() + Math.random() + Math.random() - 1.5) * 5;
      falling.push({
        x: width * center + spread,
        y: -4 - Math.random() * 20,
        vx: spread * 0.02,
        vy: 1.5 + Math.random() * 2,
        size: (Math.random() * SIZES.length) | 0,
        bounced: false,
      });
    };

    const draw = (now: number, dt: number) => {
      if (!width || !height) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (heap) ctx.drawImage(heap, 0, 0, width, height);

      if (dt > 0) for (let i = 0; i < 6; i++) spawn();
      for (let i = falling.length - 1; i >= 0; i--) {
        const p = falling[i];
        p.vy += 0.22 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const ground = surface(p.x);
        if (p.y >= ground) {
          if (!p.bounced && Math.random() < 0.5) {
            // A small bounce, then a roll down the slope.
            p.bounced = true;
            p.y = ground - 1;
            p.vy = -p.vy * 0.25;
            p.vx = (p.x < width * center ? -1 : 1) * (0.6 + Math.random() * 1.6);
          } else {
            falling.splice(i, 1);
            continue;
          }
        }
        const shade = Math.sin(now * 0.02 + i) > 0.6 ? 2 : 1; // tumbling grains flicker
        drawSprite(ctx, sprites[p.size][shade], p.x, p.y);
      }

      if (dt > 0 && surfaceGrains.length && Math.random() < 0.35) {
        const g = surfaceGrains[(Math.random() * surfaceGrains.length) | 0];
        glints.push({ x: g.x, y: g.y, life: 0, max: 0.6 + Math.random() * 0.7 });
      }
      ctx.globalCompositeOperation = "lighter";
      for (let i = glints.length - 1; i >= 0; i--) {
        const g = glints[i];
        g.life += dt / 60;
        if (g.life >= g.max) {
          glints.splice(i, 1);
          continue;
        }
        const k = Math.sin((Math.PI * g.life) / g.max);
        const size = 10 + 8 * k;
        ctx.globalAlpha = k;
        ctx.drawImage(sparkle, g.x - size / 2, g.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let frame = 0;
    // Starts paused; the IntersectionObserver reports at once whether it is on screen.
    let visible = false;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50) / 16.67; // in 60 fps frames
      last = now;
      resize();
      draw(now, dt);
      frame = requestAnimationFrame(tick);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      resize();
      if (reduceMotion.matches) {
        draw(performance.now(), 0); // the heap alone, still
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
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none block ${className}`} />;
}
