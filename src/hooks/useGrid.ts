import { useState } from "react";
import { Shape } from "../game/shapes";

export function useGrid(gridSize: number) {
    const [grid, setGrid] = useState(
        Array(gridSize).fill(0).map(() => Array(gridSize).fill(0))
    );

    const canPlaceShape = (x: number, y: number, shape: Shape) => {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[0].length; c++) {
                if (shape[r][c] === 1) {
                    const gx = x + c;
                    const gy = y + r;
                    if (
                        gx < 0 ||
                        gy < 0 ||
                        gx >= gridSize ||
                        gy >= gridSize ||
                        grid[gy][gx] === 1
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const placeShape = (x: number, y: number, shape: Shape) => {
        if (!canPlaceShape(x, y, shape)) return false;

        setGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            shape.forEach((row, r) =>
                row.forEach((cell, c) => {
                    if (cell === 1) newGrid[y + r][x + c] = 1;
                })
            );
            return newGrid;
        });

        return true;
    };

    return { grid, placeShape };
}
