/**
 * ChooseItemPage.tsx
 *
 * Room image: public/room.png  (1536 × 1024 px)
 * Hotspot positions measured from the actual image.
 * No external packages needed — works with React 19.
 */

import { useState, useRef } from "react";
import "./ChooseItem.css";
import { useMBTI } from "../context/ScoreContext";

const ROOM_IMG_SRC = "/room.png";

type ItemId = "charm" | "notebook" | "tablet" | "confidence";

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
//   charm    → four-leaf clover on the green bed blanket
//   notebook → open spiral notebook on the yellow chair
//   tablet   → laptop / tablet on the wooden desk
const HOTSPOTS: HotspotDef[] = [
  {
    id:        "charm",
    cx:        18.0,
    cy:        53.0,
    r:         52,
    emoji:     "🍀",
    label:     "Good luck charm",
    scoreType: "F",
    scoreVal:  1,
  },
  {
    id:        "notebook",
    cx:        68.0,
    cy:        73.0,
    r:         70,
    emoji:     "📓",
    label:     "Notebook",
    scoreType: "I",
    scoreVal:  1,
  },
  {
    id:        "tablet",
    cx:        76.0,
    cy:        44.0,
    r:         52,
    emoji:     "💻",
    label:     "Tablet",
    scoreType: "T",
    scoreVal:  1,
  },
];

const CONFIDENCE_ITEM = {
  scoreType: "E" as const,
  scoreVal:  1,
};

interface ChooseItemProps {
  onNext?: () => void;
}

export default function ChooseItem({ onNext }: ChooseItemProps) {
  const { addScore } = useMBTI();

  const [selectedId, setSelectedId] = useState<ItemId | null>(null);
  const [hoveredId,  setHoveredId]  = useState<ItemId | null>(null);
  const [flashText,  setFlashText]  = useState("");
  const [showFlash,  setShowFlash]  = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  function commitAndAdvance(scoreType: string, scoreVal: number) {
    addScore({ [scoreType]: scoreVal });

    setFlashText(`+${scoreVal}${scoreType}!`);
    setShowFlash(false);
    setTimeout(() => setShowFlash(true), 10);

    setTimeout(() => {
      if (onNext) {
        onNext();
      } else {
        // Replace with your router: navigate("/next-scene")
        alert(`Score saved! +${scoreVal}${scoreType}`);
      }
    }, 1400);
  }

  function handleHotspotClick(spot: HotspotDef) {
    setSelectedId(spot.id);
  }

  function handleConfidenceClick() {
    setSelectedId("confidence" as ItemId);
  }

  function handleNext() {
    if (!selectedId) return;
    if (selectedId === "confidence") {
      commitAndAdvance(CONFIDENCE_ITEM.scoreType, CONFIDENCE_ITEM.scoreVal);
    } else {
      const spot = HOTSPOTS.find(s => s.id === selectedId)!;
      commitAndAdvance(spot.scoreType, spot.scoreVal);
    }
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
    <div className="ci-page">

      {/* ── PROMPT ── */}
      <div className="ci-prompt-wrapper">
        <div className="ci-prompt-bubble">
          <p className="ci-prompt-label">🎒 Pack Your Bag</p>
          <p className="ci-prompt-text">
            You're heading out. What do you bring?
          </p>
          <p className="ci-prompt-sub">
            Click an item in the room — or head out with nothing but confidence!
          </p>
        </div>
      </div>

      {/* ── ROOM SCENE ── */}
      <div className="ci-room-scene">
        <img
          ref={imgRef}
          src={ROOM_IMG_SRC}
          alt="Your cosy room"
          className="ci-room-img"
          draggable={false}
        />

        {/* Clickable hotspot circles */}
        {HOTSPOTS.map(spot => (
          <div
            key={spot.id}
            className={[
              "ci-hotspot",
              selectedId === spot.id ? "ci-hotspot--selected" : "",
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
            <div className="ci-tooltip" style={tooltipStyle(spot)}>
              {spot.emoji} {spot.label}
            </div>
          );
        })()}
      </div>

      <p className="ci-hint">
        🔍 Hover items to see what they are · Click to pick one
      </p>

      {/* ── NOTHING BUT CONFIDENCE (outside frame, selects + navigates immediately) ── */}
      <button
        className={`ci-confidence-btn ${
          selectedId === "confidence" ? "ci-confidence-btn--selected" : ""
        }`}
        onClick={handleConfidenceClick}
      >
        <span className="ci-confidence-left">
          <span className="ci-confidence-emoji">😤</span>
          <span className="ci-confidence-text">
            <span className="ci-confidence-name">"Nothing but confidence"</span>
          </span>
        </span>
        <span className="ci-confidence-arrow">→</span>
      </button>

      {/* ── NEXT BUTTON (for room items) ── */}
      <div className="ci-btn-area">
        <button
          className="ci-btn-next"
          disabled={!selectedId}
          onClick={handleNext}
        >
          Next Stop →
        </button>
      </div>

      {/* ── SCORE FLASH ── */}
      <div className={`ci-score-flash${showFlash ? " ci-score-flash--show" : ""}`}>
        {flashText}
      </div>

    </div>
  );
}
