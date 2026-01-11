"use client";
import { useState, useEffect } from "react";
import Game from "./Game";

type GameMode = "classic" | "timed" | "endless" | "challenge";

export default function Page() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<GameMode>("classic");

  return !started ? (
    <LandingPage
      onStart={(m) => {
        setMode(m);
        setStarted(true);
      }}
      selectedMode={mode}
    />
  ) : (
    <Game mode={mode} />
  );
}

/* ---------------- LANDING PAGE ---------------- */
function LandingPage({
  onStart,
  selectedMode,
}: {
  onStart: (mode: GameMode) => void;
  selectedMode: GameMode;
}) {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  const modes: { label: string; value: GameMode; icon: string }[] = [
    { label: "CLASSIC", value: "classic", icon: "🧩" },
    { label: "TIMED", value: "timed", icon: "⏱" },
    { label: "ENDLESS", value: "endless", icon: "♾" },
    { label: "CHALLENGE", value: "challenge", icon: "⚔" },
  ];

  return (
    <div className="landing">
      {/* Animated gradient background */}
      <div className="animated-bg"></div>

      {/* Floating background blocks */}
      <img src="/Block1.png" className="bg block1" />
      <img src="/Block2.png" className="bg block2" />
      <img src="/Block3.png" className="bg block3" />
      <img src="/BlockBlast.png" className="bg block4" />

      {/* Main content */}
      <div className="content">
        <img src="/LOGO.png" alt="Logo" className="logo" />
        <p className="hook">Stack fast. Think faster.</p>

        <div className="modes">
          {modes.map((m) => (
            <button
              key={m.value}
              className={`mode ${selectedMode === m.value ? "primary" : ""}`}
              onClick={() => onStart(m.value)}
            >
              <span style={{ marginRight: 6 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        <div className="meta">
          <span>Best Score: 12,430</span>
          <span>v1.0 – Beta</span>
        </div>
      </div>

      <style jsx>{`

        .landing {
          height: 100vh;
          width: 100%;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Comic Neue', cursive;
        }

        /* Animated gradient background */
        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          background: linear-gradient(-45deg, #0b0e1a, #1a1f3c, #001, #0b0e1a);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
          z-index: 0;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Background blocks */
        .bg {
          position: absolute;
          opacity: 0.25;
          animation: float 20s infinite ease-in-out;
          z-index: 1;
        }

        .block1 { top: 8%; left: 5%; width: 140px; animation-duration: 20s; }
        .block2 { bottom: 10%; right: 8%; width: 160px; animation-duration: 26s; }
        .block3 { bottom: 18%; left: 12%; width: 120px; animation-duration: 22s; }
        .block4 { top: 5%; right: 5%; width: 260px; opacity: 0.15; animation-duration: 30s; }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* Content */
        .content {
          z-index: 2;
          text-align: center;
          animation: fadeIn 0.9s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .logo {
          width: 300px;
          margin-bottom: 10px;
          animation: pulse 3s infinite ease-in-out;
          filter: drop-shadow(0 0 25px #00f2ff88);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
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
          margin-bottom: 20px;
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
          font-family: 'Comic Neue', cursive;
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

        /* Mobile polish */
        @media (max-width: 600px) {
          .logo { width: 200px; }
          .hook { font-size: 14px; }
          .modes { grid-template-columns: 1fr; max-width: 240px; }
          .mode { font-size: 14px; padding: 12px; }
        }
      `}</style>
    </div>
  );
}
