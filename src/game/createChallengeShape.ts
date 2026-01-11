// utils/createChallengeShape.ts

import { SHAPES, ShapeObj, ShapeTag } from "../game/shapes";

const TAGS: ShapeTag[] = ["star", "square", "triangle"];

export function createChallengeShape(): ShapeObj {
    const base = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    return {
        ...base,
        tags: [TAGS[Math.floor(Math.random() * TAGS.length)]],
    };
}
