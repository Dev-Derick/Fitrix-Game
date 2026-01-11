// src/app/layout.tsx
import React from "react";

import "./global.css";


export const metadata = {
    title: "Fitrix Game",
    description: "Shape Fit Challenge Game",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html >
    );
}
