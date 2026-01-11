"use client";
import { useEffect, useState } from "react";

export default function Page() {
    const [started, setStarted] = useState(false);

    if (started) {
        return (
            <div style={{ color: "white", textAlign: "center", marginTop: 100 }}>
                {/* Your actual game renders here */}
                <h1>GAME STARTS HERE 🎮</h1>
            </div>
        );
    }

    return <LandingPage onStart={() => setStarted(true)} />;
}

/* ---------------- LANDING PAGE ---------------- */

function LandingPage({ onStart }: { onStart: () => void }) {
    useEffect(() => {
        document.body.classList.add("loaded");
    }, []);

    return (
        <div className="landing">
            {/* Floating background blocks */}
            <img src="/Block1.png" className="bg block1" />
            <img src="/Block2.png" className="bg block2" />
            <img src="/Block3.png" className="bg block3" />
            <img src="/BlockBlast.png" className="bg block4" />

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => (
                <img
                    key={i}
                    src="/Block1.png"
                    alt="particle"
                    style={{
                        position: "absolute",
                        top: Math.random() * 80 + "%",
                        left: Math.random() * 80 + "%",
                        width: 40,
                        height: 40,
                        opacity: 0.1,
                        zIndex: 1,
                        animation: `floatParticle${i % 3} ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
                    }}
                />
            ))}

            {[...Array(13)].map((_, i) => (
                <img
                    key={i}
                    src="/Block2.png"
                    alt="particle"
                    style={{
                        position: "absolute",
                        bottom: Math.random() * 80 + "%",
                        right: Math.random() * 80 + "%",
                        width: 40,
                        height: 40,
                        opacity: 0.1,
                        zIndex: 1,
                        animation: `floatParticle${i % 3} ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
                    }}
                />
            ))}

            {/* Main content */}
            <div className="content">
                <img src="/LOGO.png" alt="Logo" className="logo" />

                <p className="hook">Stack fast. Think faster.</p>

                <div className="modes">
                    <button className="mode primary" onClick={onStart}>
                        🧩 CLASSIC
                    </button>
                    <button className="mode">⏱ TIMED</button>
                    <button className="mode">♾ ENDLESS</button>
                    <button className="mode">⚔ CHALLENGE</button>
                </div>

                <div className="meta">
                    <span>Best Score: 12,430</span>
                    <span>v1.0 – Beta</span>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
        .landing {
          height: 100vh;
          width: 100%;
          overflow: hidden;
          position: relative;
          background: radial-gradient(circle at top, #1a1f3c, #0b0e1a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: system-ui, sans-serif;
        }

        /* Background blocks */
        .bg {
          position: absolute;
          opacity: 0.25;
          animation: float 20s infinite ease-in-out;
        }

        .block1 {
          top: 8%;
          left: 5%;
          width: 140px;
        }

        .block2 {
          bottom: 10%;
          right: 8%;
          width: 160px;
          animation-duration: 26s;
        }

        .block3 {
          bottom: 18%;
          left: 12%;
          width: 120px;
          animation-duration: 22s;
        }

        .block4 {
          top: 5%;
          right: 5%;
          width: 260px;
          opacity: 0.15;
        }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(8deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        /* Content */
        .content {
          z-index: 10;
          text-align: center;
          animation: fadeIn 0.9s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .logo {
          width: 300px;
          margin-bottom: 10px;
          animation: pulse 3s infinite ease-in-out;
          filter: drop-shadow(0 0 25px #00f2ff88);
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        .hook {
          font-size: 18px;
          opacity: 0.85;
          margin-bottom: 30px;
        }

        /* Mode buttons */
        .modes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          max-width: 360px;
          margin: auto;
        }

        .mode {
          padding: 14px;
          font-size: 16px;
          border-radius: 12px;
          border: none;
          background: #1f2547;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode:hover {
          transform: translateY(-4px);
          background: #2b3280;
        }

        .primary {
          background: linear-gradient(135deg, #00f2ff, #3a7cff);
          color: #000;
          font-weight: bold;
          box-shadow: 0 0 22px #00f2ff99;
        }

        .meta {
          margin-top: 30px;
          font-size: 12px;
          opacity: 0.6;
          display: flex;
          justify-content: space-between;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float1 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-20px) rotate(15deg); } }
        @keyframes float2 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-15px) rotate(-10deg); } }
        @keyframes float3 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-25px) rotate(20deg); } }
        @keyframes float4 { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-10px) rotate(-15deg); } }
        @keyframes floatParticle0 { 0% { transform: translateY(0); } 100% { transform: translateY(-15px); } }
        @keyframes floatParticle1 { 0% { transform: translateY(0); } 100% { transform: translateY(-20px); } }
        @keyframes floatParticle2 { 0% { transform: translateY(0); } 100% { transform: translateY(-25px); } }
      `}</style>
        </div>
    );
}




if (gameOver) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: 20,
                background: "linear-gradient(135deg, #667eea, #764ba2, #f6d365)",
                backgroundSize: "400% 400%",
                animation: "gradientShift 20s ease infinite",
                color: "#fff"
            }}>
                <h1>Game Over</h1>
                <p>Mode: {mode.toUpperCase()}</p>
                <p>Score: {score}</p>
                <p>Max Combo: {combo}x</p>
                <button onClick={() => {
                    setGrid(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0).map(() => ({ filled: false }))));
                    setScore(0);
                    setCombo(1);
                    setLevel(1);
                    setGameOver(false);
                    setSidebarShapes(getRandomShapes());
                }} style={{ padding: "10px 30px", fontSize: 20, cursor: "pointer" }}>
                    Restart
                </button>
            </div>
        );
    }

    // ---- Main Game ----
    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: 20,
            background: "linear-gradient(135deg, #667eea, #764ba2, #f6d365)",
            backgroundSize: "400% 400%",
            animation: "gradientShift 20s ease infinite",
        }}>
            <GameCanvas grid={grid} ghost={ghost} clearingCells={clearingCells} />
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                {sidebarShapes.map((s, i) => (
                    <ShapeCanvas key={i} shape={s} onDrop={handleDrop} onMove={handleMove} />
                ))}
            </div>
        </main>
    );