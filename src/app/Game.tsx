"use client";

import { useState, useEffect, useRef } from "react";
import GameCanvas from "../components/GameCanvas";
import ShapeCanvas, { ShapeObj } from "../components/ShapeCanvas";
import { SHAPES, Shape } from "../game/shapes";

const GRID_SIZE = 8;
const CELL_SIZE = 40;

type Cell = { filled: boolean; color?: string };
type GameMode = "classic" | "timed" | "endless" | "challenge";
type Props = { mode: GameMode };

type FloatingText = {
    id: number;
    text: string;
    x: number;
    y: number;
};

export default function Game({ mode }: Props) {
    const [gameOver, setGameOver] = useState(false);
    const [grid, setGrid] = useState<Cell[][]>(
        Array(GRID_SIZE)
            .fill(0)
            .map(() => Array(GRID_SIZE).fill(0).map(() => ({ filled: false })))
    );

    const [ghost, setGhost] = useState<{ x: number; y: number; shape: Shape; valid: boolean } | null>(null);
    const [justPlaced, setJustPlaced] = useState<Set<string>>(new Set());
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(1);
    const [level, setLevel] = useState(1);
    const [batch, setBatch] = useState<ShapeObj[]>([]);
    const [timeLeft, setTimeLeft] = useState(mode === "timed" ? 120 : 0);
    const [shake, setShake] = useState(false);

    // Floating text
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const floatId = useRef(0);

    // Sounds
    const placeSound = useRef<HTMLAudioElement | null>(null);
    const clearSound = useRef<HTMLAudioElement | null>(null);
    const invalidSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        placeSound.current = new Audio("/sound/place.mp3");
        clearSound.current = new Audio("/sound/clear.mp3");
        invalidSound.current = new Audio("/sound/invalid.mp3");

        placeSound.current.volume = 0.3;
        clearSound.current.volume = 0.4;
        invalidSound.current.volume = 0.3;
    }, []);

    // Level scaling
    useEffect(() => {
        setLevel(Math.floor(score / 50) + 1);
    }, [score]);

    // Available shapes
    const getAvailableShapes = () => {
        const maxIndex = Math.min(7 + level - 1, SHAPES.length);
        return SHAPES.slice(0, maxIndex);
    };

    const getNewBatch = () => {
        const shapes = getAvailableShapes();
        return [...shapes].sort(() => 0.5 - Math.random()).slice(0, 4);
    };

    useEffect(() => {
        setBatch(getNewBatch());
    }, []);

    // Timed mode countdown
    useEffect(() => {
        if (mode !== "timed" || gameOver) return;
        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    setGameOver(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [mode, gameOver]);

    const canPlaceShape = (x: number, y: number, shape: Shape | undefined) => {
        if (!shape) return false;
        for (let r = 0; r < shape.length; r++)
            for (let c = 0; c < shape[0].length; c++) {
                if (!shape[r][c]) continue;
                const gx = x + c;
                const gy = y + r;
                if (gx < 0 || gy < 0 || gx >= GRID_SIZE || gy >= GRID_SIZE || grid[gy][gx].filled)
                    return false;
            }
        return true;
    };

    const anyShapeFits = (shapes: ShapeObj[]) =>
        shapes.some((shapeObj) =>
            Array.from({ length: GRID_SIZE }, (_, y) =>
                Array.from({ length: GRID_SIZE }, (_, x) => canPlaceShape(x, y, shapeObj.shape))
            )
                .flat()
                .some(Boolean)
        );

    const findFullLines = (g: Cell[][]) => {
        const rows = new Set<number>();
        const cols = new Set<number>();
        for (let y = 0; y < GRID_SIZE; y++) if (g[y].every((c) => c.filled)) rows.add(y);
        for (let x = 0; x < GRID_SIZE; x++) if (g.every((r) => r[x].filled)) cols.add(x);
        return { rows, cols };
    };

    const clearLines = (g: Cell[][], rows: Set<number>, cols: Set<number>) => {
        const newGrid = g.map((r) => r.map((c) => ({ ...c })));
        rows.forEach((y) => newGrid[y].forEach((_, x) => (newGrid[y][x] = { filled: false })));
        cols.forEach((x) => newGrid.forEach((_, y) => (newGrid[y][x] = { filled: false })));
        return newGrid;
    };

    const spawnFloating = (text: string) => {
        const id = floatId.current++;
        setFloatingTexts((f) => [...f, { id, text, x: 200, y: 200 }]);
        setTimeout(() => setFloatingTexts((f) => f.filter((t) => t.id !== id)), 900);
    };

    const handleMove = (sx: number, sy: number, shapeObj: ShapeObj) => {
        const rect = document.getElementById("gameCanvas")!.getBoundingClientRect();
        const x = Math.round((sx - rect.left) / CELL_SIZE);
        const y = Math.round((sy - rect.top) / CELL_SIZE);
        setGhost({ x, y, shape: shapeObj.shape, valid: canPlaceShape(x, y, shapeObj.shape) });
    };

    const handleDrop = (sx: number, sy: number, shapeObj: ShapeObj) => {
        if (gameOver) return;

        const rect = document.getElementById("gameCanvas")!.getBoundingClientRect();
        const x = Math.round((sx - rect.left) / CELL_SIZE);
        const y = Math.round((sy - rect.top) / CELL_SIZE);

        if (!canPlaceShape(x, y, shapeObj.shape)) {
            invalidSound.current?.play();
            setShake(true);
            setTimeout(() => setShake(false), 300);
            setGhost(null);
            return;
        }

        placeSound.current?.play();

        const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
        shapeObj.shape.forEach((row, r) =>
            row.forEach((cell, c) => {
                if (cell) newGrid[y + r][x + c] = { filled: true, color: shapeObj.color };
            })
        );

        const { rows, cols } = findFullLines(newGrid);

        if (rows.size || cols.size) {
            const gained = 10 * (rows.size + cols.size) * combo;
            setScore((s) => s + gained);
            spawnFloating(`+${gained}`);
            spawnFloating(`COMBO x${combo + 1}`);
            setCombo((c) => c + 1);
            clearSound.current?.play();

            setTimeout(() => {
                setGrid(clearLines(newGrid, rows, cols));
            }, 300);
        } else {
            setCombo(1);
            setGrid(newGrid);
        }

        // Batch system: only refresh when batch empty
        setBatch((b) => {
            const remaining = b.filter((s) => s !== shapeObj);
            if (remaining.length === 0) {
                const next = getNewBatch();
                if (!anyShapeFits(next)) setGameOver(true);
                return next;
            }
            if (!anyShapeFits(remaining)) setGameOver(true);
            return remaining;
        });

        setGhost(null);
    };

    if (gameOver) {
        return (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "radial-gradient(circle at center, #ff0055, #1a1f3c)",
                    flexDirection: "column",
                    color: "#fff",
                    fontFamily: "'Comic Neue', cursive",
                    textAlign: "center",
                    gap: 20,
                    animation: "shake 0.5s",
                }}
            >
                <h1 style={{ fontSize: 60, textShadow: "0 0 20px #ff0, 0 0 40px #ff0" }}>💥 GAME OVER 💥</h1>
                <p style={{ fontSize: 24 }}>Final Score: {score}</p>
                <p style={{ fontSize: 20 }}>Max Combo: 🔥 {combo}x</p>
                {mode === "timed" && <p style={{ opacity: 0.8 }}>⏱ Time’s up!</p>}
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        fontSize: 22,
                        padding: "12px 30px",
                        borderRadius: 12,
                        background: "#00f2ff",
                        color: "#000",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Comic Neue', cursive",
                    }}
                >
                    🔁 Play Again
                </button>
            </div>
        );
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                fontFamily: "'Comic Neue', cursive",
                position: "relative",
                background: "linear-gradient(135deg, #0b0e1a, #1a1f3c, #000000)",
            }}
        >
            <div style={{ color: "#fff", fontSize: 22 }}>
                Score: {score} | Combo: {combo}x
                {mode === "timed" &&
                    ` | ⏱ ${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                        .toString()
                        .padStart(2, "0")}`}
            </div>

            <div className={shake ? "shake" : ""}>
                <GameCanvas grid={grid} ghost={ghost} justPlaced={justPlaced} />
            </div>

            {floatingTexts.map((t) => (
                <div
                    key={t.id}
                    style={{
                        position: "absolute",
                        top: "45%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "#00f2ff",
                        fontSize: 24,
                        animation: "floatUp 0.9s ease-out",
                        pointerEvents: "none",
                    }}
                >
                    {t.text}
                </div>
            ))}

            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                {batch.map((s, i) => (
                    <ShapeCanvas key={i} shape={s} onDrop={handleDrop} onMove={handleMove} />
                ))}
            </div>
        </main>
    );
}
