import { useState } from "react";
import "./TrainSeating.css";
import { useMBTI } from "../context/ScoreContext";


type SeatStatus = "occupied" | "empty" | "selected";

interface SeatDef {
  col: number;
  status: SeatStatus;
  scoreType?: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  scoreVal?: number;
  tooltip?: string;
}

const ROW_1: SeatDef[] = [
  { col: 0, status: "empty",    scoreType: "I", scoreVal: 2, tooltip: "Sit by yourself (+1I)" },
  { col: 1, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 2, status: "occupied",},
  { col: 3, status: "occupied" },
  { col: 4, status: "empty",    scoreType: "E", scoreVal: 2, tooltip: "Sit between two people (+2E)" },
  { col: 5, status: "occupied" },
];

const ROW_2: SeatDef[] = [
  { col: 0, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 1, status: "occupied" },
  { col: 2, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 3, status: "empty",    scoreType: "I", scoreVal: 1, tooltip: "Sit by yourself (+1I)" },
  { col: 4, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 5, status: "occupied" },
];


// Seat component
interface SeatProps {
  seat: SeatDef;
  isSelected: boolean;
  onSelect: (seat: SeatDef) => void;
}

function Seat({ seat, isSelected, onSelect }: SeatProps) {
  const status: SeatStatus = isSelected ? "selected" : seat.status;

  return (
    <div
      className={`seat seat--${status}`}
      title={seat.tooltip}
      onClick={() => seat.status === "empty" && onSelect(seat)}
    >
      <span className="seat-shape" />
    </div>
  );
}


// Main page
interface TrainSeatingProps {
  onNext?: () => void; 
}

export default function TrainSeating({ onNext }: TrainSeatingProps) {
  const { addScore } = useMBTI();

  const [selectedSeat, setSelectedSeat] = useState<SeatDef | null>(null);
  const [flashText, setFlashText]       = useState<string>("");
  const [showFlash, setShowFlash]       = useState(false);

  function handleSelectSeat(seat: SeatDef) {
    setSelectedSeat(seat);
  }

  function handleNext() {
    if (!selectedSeat) return;

    const type = selectedSeat.scoreType!;
    const val  = selectedSeat.scoreVal!;

    // Add to shared MBTI context
    addScore({ [type]: val });

    // Flash animation
    // setFlashText(`+${val}${type}!`);
    // setShowFlash(false);
    // setTimeout(() => setShowFlash(true), 10);

    // Navigate after animation
    setTimeout(() => {
      if (onNext) {
        onNext();
      } else {
        // ── CHANGE THIS to your router navigation ──
        // e.g. navigate("/next-scene") or router.push("/next-scene")
        alert(`Score saved! +${val}${type}\n\n(Pass an onNext prop or replace this with your router navigation)`);
      }
    }, 100);
  }

  const selectionLabel = selectedSeat
    ? `Row ${selectedSeat.col < 3 ? 1 : 2} · Seat ${selectedSeat.col + 1} — ${
        selectedSeat.scoreType === "I" ? "🪟 Alone" : "👥 Near others"
      } · +${selectedSeat.scoreVal}${selectedSeat.scoreType}`
    : "";

  return (
    <div className="ts-page">

      {/* ── PROMPT ── */}
      <div className="ts-prompt-wrapper">
        <div className="ts-prompt-bubble">
          <p className="ts-prompt-label">🚃 Train Station</p>
          <p className="ts-prompt-text">
            You board the train.<br />Where do you sit?
          </p>
          <p className="ts-prompt-sub">Click an empty seat to choose your spot!</p>
        </div>
      </div>

      {/* ── TRAIN SCENE ── */}
      <div className="ts-train-scene">
        <div className="ts-train-placeholder">
          <span className="ts-train-label">METRO LINE 404</span>
          <div className="ts-window-row">
            <div className="ts-win" />
            <div className="ts-win" />
            <div className="ts-win" />
            <div className="ts-win" />
          </div>
          <div className="ts-floor" />
        </div>

        {/* Seats overlaid on the train */}
        <div className="ts-seats-overlay">
          <div className="ts-seat-row">
            {ROW_1.map((seat) => (
              <Seat
                key={`r1-c${seat.col}`}
                seat={seat}
                isSelected={
                  selectedSeat?.col === seat.col &&
                  selectedSeat?.scoreType === seat.scoreType &&
                  ROW_1.includes(seat)
                }
                onSelect={handleSelectSeat}
              />
            ))}
          </div>
          <div className="ts-seat-spacer" />
          <div className="ts-seat-row">
            {ROW_2.map((seat) => (
              <Seat
                key={`r2-c${seat.col}`}
                seat={{ ...seat, col: seat.col + 10 }} // offset col id so row 2 seats are unique
                isSelected={
                  selectedSeat !== null &&
                  selectedSeat.col === seat.col + 10
                }
                onSelect={(s) =>
                  handleSelectSeat({ ...seat, col: seat.col + 10 })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <p className="ts-hint">🪑 Hover to preview · Click to choose your seat</p>

      {/* ── NEXT BUTTON ── */}
      <div className="ts-btn-area">
        {/* {selectedSeat && (
          <div className="ts-selection-info">{selectionLabel}</div>
        )} */}
        <button
          className="ts-btn-next"
          disabled={!selectedSeat}
          onClick={handleNext}
        >
          Next Stop →
        </button>
      </div>

      {/* ── SCORE FLASH ── */}
      <div className={`ts-score-flash ${showFlash ? "ts-score-flash--show" : ""}`}>
        {flashText}
      </div>
    </div>
  );
}
