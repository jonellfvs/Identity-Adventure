/**
 * FindChargerPage.tsx
 *
 * Room image: public/findCharger.png  (1536 × 1024 px)
 * Hotspot positions measured from the actual image.
 * No external packages needed.
 */

import { useState, useRef } from "react";
import "./FindCharger.css";
import { useMBTI } from "../context/ScoreContext";

const ROOM_IMG_SRC = "/findCharger1.png";

type ItemId = "person" | "road" | "store";

interface HotspotDef {
  id:        ItemId;
  /** centre-x as % of image width  */
  cx:        number;
  /** centre-y as % of image height */
  cy:        number;
  /** hit-area radius in px (fixed, not scaled) */
  r:         number;
  emoji:     string;
  label:     string;
  scoreType: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  scoreVal:  number;
}

// Coords measured from the 1536 × 1024 source image:
//   person → character standing on the left path
//   road   → empty road / signpost in the centre
//   store  → store building on the right
const HOTSPOTS: HotspotDef[] = [
  {
    id:        "person",
    cx:        21.0,
    cy:        28.0,
    r:         50,
    emoji:     "🧍",
    label:     "Ask a person",
    scoreType: "E",
    scoreVal:  1,
  },
  {
    id:        "road",
    cx:        50.0,
    cy:        31.0,
    r:         50,
    emoji:     "🛤️",
    label:     "Gamble on the unknown",
    scoreType: "S",
    scoreVal:  1,
  },
  {
    id:        "store",
    cx:        81.0,
    cy:        27.0,
    r:         40,
    emoji:     "🏪",
    label:     "Head to a store",
    scoreType: "I",
    scoreVal:  1,
  },
];

interface FindChargerProps {
  onNext?: () => void;
}

export default function FindCharger({ onNext }: FindChargerProps) {
  const { addScore } = useMBTI();

  const [selectedId, setSelectedId] = useState<ItemId | null>(null);
  const [hoveredId,  setHoveredId]  = useState<ItemId | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  function commitAndAdvance(scoreType: string, scoreVal: number) {
    addScore({ [scoreType]: scoreVal });
    if (onNext) {
      onNext();
    }
  }

  function handleHotspotClick(spot: HotspotDef) {
    setSelectedId(spot.id);
  }

  function handleNext() {
    if (!selectedId) return;
    const spot = HOTSPOTS.find(s => s.id === selectedId)!;
    commitAndAdvance(spot.scoreType, spot.scoreVal);
  }

  // Convert % coords → px for tooltip anchor
  function tooltipStyle(spot: HotspotDef): React.CSSProperties {
    const img = imgRef.current;
    if (!img) return { left: `${spot.cx}%`, top: `${spot.cy}%` };
    return {
      left: (spot.cx / 100) * img.offsetWidth,
      top:  (spot.cy / 100) * img.offsetHeight,
    };
  }

  return (
    <div className="fc-page">

      {/* ── PROMPT ── */}
      <div className="fc-prompt-wrapper">
        <div className="fc-prompt-bubble">
          <p className="fc-prompt-label">🗺️ At the Crossroads</p>
          <p className="fc-prompt-text">
            Find a way to find your charger.<br />Which way do you go?
          </p>
          <p className="fc-prompt-sub">
            Click a path to choose your direction!
          </p>
        </div>
      </div>

      {/* ── SCENE ── */}
      <div className="fc-room-scene">
        <img
          ref={imgRef}
          src={ROOM_IMG_SRC}
          alt="A crossroads with a person, an empty road, and a store"
          className="fc-room-img"
          draggable={false}
        />

        {/* Clickable hotspot circles */}
        {HOTSPOTS.map(spot => (
          <div
            key={spot.id}
            className={[
              "fc-hotspot",
              selectedId === spot.id ? "fc-hotspot--selected" : "",
            ].join(" ").trim()}
            style={{
              left:   `${spot.cx}%`,
              top:    `${spot.cy}%`,
              width:  spot.r * 2,
              height: spot.r * 2,
            }}
            onClick={() => handleHotspotClick(spot)}
            onMouseEnter={() => setHoveredId(spot.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}

        {/* Floating tooltip above hovered spot */}
        {hoveredId && (() => {
          const spot = HOTSPOTS.find(s => s.id === hoveredId)!;
          return (
            <div className="fc-tooltip" style={tooltipStyle(spot)}>
              {spot.emoji} {spot.label}
            </div>
          );
        })()}
      </div>

      <p className="fc-hint">
        🔍 Hover to preview · Click to choose your path
      </p>

      {/* ── NEXT BUTTON ── */}
      <div className="fc-btn-area">
        <button
          className="fc-btn-next"
          disabled={!selectedId}
          onClick={handleNext}
        >
          Head Out →
        </button>
      </div>

    </div>
  );
}
