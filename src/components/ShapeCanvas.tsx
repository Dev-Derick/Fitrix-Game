"use client";

import { useRef, useEffect } from "react";
import { Shape } from "../game/shapes";
import { useDrag } from "../hooks/useDrag";

const CELL_SIZE = 20;

export type ShapeTag = "star" | "triangle" | "square";

export type ShapeObj = {
    shape: Shape;
    color: string;
    tags?: ShapeTag[]; // ✅ OPTIONAL
};

type Props = {
    shape: ShapeObj;
    onDrop?: (x: number, y: number, shape: ShapeObj) => void;
    onMove?: (x: number, y: number, shape: ShapeObj) => void;
};

export default function ShapeCanvas({ shape: s, onDrop, onMove }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { dragging, position, start } = useDrag(
        (x, y) => onDrop?.(x, y, s),
        (x, y) => onMove?.(x, y, s)
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = s.shape[0].length * CELL_SIZE;
        canvas.height = s.shape.length * CELL_SIZE;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        s.shape.forEach((row, y) =>
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillStyle = s.color;
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    ctx.strokeStyle = "#151414";
                    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            })
        );
    }, [s]);

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={e =>
                start(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())
            }
            onTouchStart={e =>
                start(
                    e.touches[0].clientX,
                    e.touches[0].clientY,
                    e.currentTarget.getBoundingClientRect()
                )
            }
            style={{
                position: dragging ? "absolute" : "static",
                left: dragging ? position.x : undefined,
                top: dragging ? position.y : undefined,
                cursor: "grab",
                zIndex: dragging ? 1000 : 1,
            }}
        />
    );
}
