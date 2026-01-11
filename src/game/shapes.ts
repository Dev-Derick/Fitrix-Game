// game/shapes.ts

export type Shape = number[][];

// what symbols can exist on blocks (challenge mode only)
export type ShapeTag = "star" | "square" | "triangle";

export type ShapeObj = {
    shape: Shape;
    color: string;
    tags?: ShapeTag[]; // ✅ optional so other modes are safe
};

export const SHAPES: ShapeObj[] = [
    { shape: [[1, 1, 1, 1]], color: "#120efa" }, // I
    { shape: [[1, 1], [1, 1]], color: "#d502ff" }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: "#60a5fa" }, // T
    { shape: [[1, 0, 0], [1, 1, 1]], color: "#d1fe05" }, // L
    { shape: [[0, 0, 1], [1, 1, 1]], color: "#07f6fe" }, // J
    { shape: [[0, 1, 1], [1, 1, 0]], color: "#4f06fb" }, // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: "#f70707" }, // Z
    { shape: [[1, 1, 1], [1, 0, 0]], color: "#03f734" }, // F

    // harder shapes
    { shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], color: "#22d3ee" },
    { shape: [[1, 0, 1], [0, 1, 0], [1, 0, 1]], color: "#e879f9" },
    { shape: [[1]], color: "#10b981" }, // single
];
