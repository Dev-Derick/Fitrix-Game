"use client";

import { useEffect, useRef } from "react";
import { Shape } from "../game/shapes";

const CELL_SIZE = 40;

type Ghost = { x: number; y: number; shape: Shape; valid: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; color: string };
type Cell = { filled: boolean; color?: string; tags?: string[] };

type Props = {
    grid: Cell[][];
    ghost: Ghost | null;
    justPlaced?: Set<string>;
    clearingCells?: Set<string>;
};

type FloatingText = { x: number; y: number; text: string; alpha: number };

export default function GameCanvas({
    grid,
    ghost,
    justPlaced = new Set(),
    clearingCells = new Set(),
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const scaleMap = useRef<Map<string, number>>(new Map());
    const particlesRef = useRef<Particle[]>([]);
    const floatingTexts = useRef<FloatingText[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const rows = grid.length;
        const cols = grid[0].length;

        canvas.width = cols * CELL_SIZE;
        canvas.height = rows * CELL_SIZE;

        // Initialize scale & particles for cleared cells
        clearingCells.forEach((cellKey) => {
            if (!scaleMap.current.has(cellKey)) scaleMap.current.set(cellKey, 1);
            const [y, x] = cellKey.split("-").map(Number);
            const color = grid[y][x].color || "#facc15";
            for (let i = 0; i < 6; i++) {
                particlesRef.current.push({
                    x: x * CELL_SIZE + CELL_SIZE / 2,
                    y: y * CELL_SIZE + CELL_SIZE / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    alpha: 1,
                    color,
                });
            }

            // Spawn floating tags for challenge mode
            grid[y][x].tags?.forEach((tag) => {
                const icon = tag === "star" ? "⭐" : tag === "square" ? "◼" : "🔺";
                floatingTexts.current.push({
                    x: x * CELL_SIZE + CELL_SIZE / 2,
                    y: y * CELL_SIZE + CELL_SIZE / 2,
                    text: icon,
                    alpha: 1,
                });
            });
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // --- Background ---
            ctx.fillStyle = "#101426";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // --- Grid lines ---
            ctx.strokeStyle = "rgba(0,255,255,0.2)";
            for (let i = 0; i <= rows; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * CELL_SIZE);
                ctx.lineTo(cols * CELL_SIZE, i * CELL_SIZE);
                ctx.stroke();
            }
            for (let i = 0; i <= cols; i++) {
                ctx.beginPath();
                ctx.moveTo(i * CELL_SIZE, 0);
                ctx.lineTo(i * CELL_SIZE, rows * CELL_SIZE);
                ctx.stroke();
            }

            // --- Draw cells ---
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const key = `${y}-${x}`;
                    const cell = grid[y][x];
                    const isClearing = clearingCells.has(key);
                    const isJustPlaced = justPlaced.has(key);
                    let scale = scaleMap.current.get(key) ?? 1;

                    ctx.save();

                    // --- Scaling for clearing ---
                    if (isClearing) {
                        scale -= 0.05;
                        if (scale < 0) scale = 0;
                        scaleMap.current.set(key, scale);
                        ctx.globalAlpha = scale;
                        ctx.translate((x + 0.5) * CELL_SIZE, (y + 0.5) * CELL_SIZE);
                        ctx.scale(scale, scale);
                        ctx.translate(-(x + 0.5) * CELL_SIZE, -(y + 0.5) * CELL_SIZE);
                    }
                    // --- Subtle pulse for just placed ---
                    else if (isJustPlaced) {
                        const pulse = 1 + Math.sin(performance.now() / 150) * 0.03;
                        ctx.translate((x + 0.5) * CELL_SIZE, (y + 0.5) * CELL_SIZE);
                        ctx.scale(pulse, pulse);
                        ctx.translate(-(x + 0.5) * CELL_SIZE, -(y + 0.5) * CELL_SIZE);
                        ctx.shadowColor = cell.color || "#fff";
                        ctx.shadowBlur = 6;
                    }

                    // --- Draw block ---
                    if (cell.filled) {
                        ctx.fillStyle = cell.color || "#96e546";
                        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                        // Glow overlay
                        if (isJustPlaced) {
                            const grad = ctx.createRadialGradient(
                                x * CELL_SIZE + CELL_SIZE / 2,
                                y * CELL_SIZE + CELL_SIZE / 2,
                                CELL_SIZE * 0.1,
                                x * CELL_SIZE + CELL_SIZE / 2,
                                y * CELL_SIZE + CELL_SIZE / 2,
                                CELL_SIZE * 0.5
                            );
                            grad.addColorStop(0, "#fff");
                            grad.addColorStop(0.3, cell.color || "#fff");
                            grad.addColorStop(1, "#0000");
                            ctx.fillStyle = grad;
                            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                        }

                        // --- Draw tags ---
                        if (cell.tags?.length) {
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.font = "bold 16px Arial";
                            cell.tags.forEach((tag, i) => {
                                let icon = "";
                                let color = "#fff";
                                if (tag === "star") { icon = "⭐"; color = "#facc15"; }
                                else if (tag === "square") { icon = "◼"; color = "#22d3ee"; }
                                else if (tag === "triangle") { icon = "🔺"; color = "#f87171"; }

                                ctx.fillStyle = color;
                                ctx.fillText(icon, x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2 + i * 2);
                            });
                        }
                    }

                    // --- Border ---
                    ctx.strokeStyle = "#151414";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                    ctx.restore();
                }
            }

            // --- Ghost ---
            if (ghost) {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = ghost.valid ? "#22c55e" : "#ef4444";
                ghost.shape.forEach((row, r) =>
                    row.forEach((cell, c) => {
                        if (cell) ctx.fillRect((ghost.x + c) * CELL_SIZE, (ghost.y + r) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    })
                );
                ctx.globalAlpha = 1;
            }

            // --- Particles ---
            particlesRef.current.forEach((p) => {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.05;
            });
            particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

            // --- Floating texts ---
            floatingTexts.current.forEach((t) => {
                ctx.globalAlpha = t.alpha;
                ctx.fillStyle = "#fff";
                ctx.font = "bold 20px Arial";
                ctx.fillText(t.text, t.x, t.y);
                t.y -= 0.5;
                t.alpha -= 0.02;
            });
            floatingTexts.current = floatingTexts.current.filter((t) => t.alpha > 0);

            ctx.globalAlpha = 1;

            if ([...scaleMap.current.values()].some((s) => s > 0) || particlesRef.current.length > 0 || floatingTexts.current.length > 0) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                scaleMap.current.clear();
            }
        };

        animate();
        return () => cancelAnimationFrame(animationRef.current!);
    }, [grid, ghost, justPlaced, clearingCells]);

    return <canvas id="gameCanvas" ref={canvasRef} />;
}
