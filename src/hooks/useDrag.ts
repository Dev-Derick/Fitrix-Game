import { useEffect, useState } from "react";

export function useDrag(
    onDrop: (x: number, y: number) => void,
    onMove?: (x: number, y: number) => void
) {
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const start = (x: number, y: number, rect: DOMRect) => {
        setOffset({ x: x - rect.left, y: y - rect.top });
        setPosition({ x: rect.left, y: rect.top });
        setDragging(true);
    };

    useEffect(() => {
        if (!dragging) return;

        const move = (e: MouseEvent | TouchEvent) => {
            const p = "touches" in e ? e.touches[0] : e;
            const x = p.clientX - offset.x;
            const y = p.clientY - offset.y;
            setPosition({ x, y });
            onMove?.(x, y);
        };

        const end = (e: MouseEvent | TouchEvent) => {
            const p = "changedTouches" in e ? e.changedTouches[0] : e;
            setDragging(false);
            onDrop(p.clientX - offset.x, p.clientY - offset.y);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
        window.addEventListener("touchmove", move);
        window.addEventListener("touchend", end);

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", end);
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", end);
        };
    }, [dragging, offset, onDrop, onMove]);

    return { dragging, position, start };
}
