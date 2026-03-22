import { useState } from "react";
import "./BusSeating.css";
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
];

const ROW_2: SeatDef[] = [
  { col: 0, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 1, status: "occupied" },
  { col: 2, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 3, status: "empty",    scoreType: "I", scoreVal: 1, tooltip: "Sit by yourself (+1I)" },
];

const ROW_3: SeatDef[] = [
  { col: 0, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 1, status: "occupied" },
  { col: 2, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 3, status: "empty",    scoreType: "I", scoreVal: 1, tooltip: "Sit by yourself (+1I)" },
];

const ROW_4: SeatDef[] = [
  { col: 0, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 1, status: "occupied" },
  { col: 2, status: "empty",    scoreType: "E", scoreVal: 1, tooltip: "Sit next to someone (+1E)" },
  { col: 3, status: "empty",    scoreType: "I", scoreVal: 1, tooltip: "Sit by yourself (+1I)" },
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
      className={`busSeat busSeat--${status}`}
      title={seat.tooltip}
      onClick={() => seat.status === "empty" && onSelect(seat)}
    >
      <span className="busSeat-shape" />
    </div>
  );
}


// Main page
interface BusSeatingProps {
  onNext?: () => void; 
}

export default function BusSeating({ onNext }: BusSeatingProps) {
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
    setFlashText(`+${val}${type}!`);
    setShowFlash(false);
    setTimeout(() => setShowFlash(true), 10);

    // Navigate after animation
    setTimeout(() => {
      if (onNext) {
        onNext();
      } else {
        // ── CHANGE THIS to your router navigation ──
        // e.g. navigate("/next-scene") or router.push("/next-scene")
        alert(`Score saved! +${val}${type}\n\n(Pass an onNext prop or replace this with your router navigation)`);
      }
    }, 1400);
  }

  const selectionLabel = selectedSeat
    ? `Row ${selectedSeat.col < 3 ? 1 : 2} · Seat ${selectedSeat.col + 1} — ${
        selectedSeat.scoreType === "I" ? "🪟 Alone" : "👥 Near others"
      } · +${selectedSeat.scoreVal}${selectedSeat.scoreType}`
    : "";

  return (
    <div className="bs-page">

      {/* ── PROMPT ── */}
      <div className="bs-prompt-wrapper">
        <div className="bs-prompt-bubble">
          <p className="bs-prompt-label">🚃 Bus Station</p>
          <p className="bs-prompt-text">
            You board the bus.<br />Where do you sit?
          </p>
          <p className="bs-prompt-sub">Click an empty seat to choose your spot!</p>
        </div>
      </div>

      {/* ── BUS SCENE ── */}
      <div className="bs-bus-scene">
        <div className="bs-bus-placeholder">
          <span className="bs-bus-label">45 - TO CSULB</span>
          <div className="bs-window-row">
            <div className="bs-win" />
            <div className="bs-win" />
            <div className="bs-win" />
            <div className="bs-win" />
          </div>
          <div className="bs-window-row bs-window-row--bottom">
            <div className="bs-win" />
            <div className="bs-win" />
            <div className="bs-win" />
            <div className="bs-win" />
          </div>
        </div>

        {/* Seats overlaid on the bus */}
        <div className="bs-seats-overlay">
          <div className="bs-seat-row">
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
          <div className="bs-seat-row">
            {ROW_2.map((seat) => (
              <Seat
                key={`r2-c${seat.col}`}
                seat={seat}
                isSelected={
                selectedSeat?.col === seat.col &&
                selectedSeat?.scoreType === seat.scoreType &&
                ROW_2.includes(seat)   // ← was ROW_1
                }
                onSelect={handleSelectSeat}
            />
            ))}
          </div>
          <div className="bs-seat-row">
            {ROW_3.map((seat) => (
              <Seat
                key={`r3-c${seat.col}`}
                seat={seat}
                isSelected={
                selectedSeat?.col === seat.col &&
                selectedSeat?.scoreType === seat.scoreType &&
                ROW_3.includes(seat)   // ← was ROW_1
                }
                onSelect={handleSelectSeat}
            />
            ))}
          </div>
          <div className="bs-seat-spacer" />
          <div className="bs-seat-row">
            {ROW_4.map((seat) => (
              <Seat
                key={`r4-c${seat.col}`}
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

      <p className="bs-hint">🪑 Hover to preview · Click to choose your seat</p>

      {/* ── NEXT BUTTON ── */}
      <div className="bs-btn-area">
        {/* {selectedSeat && (
          <div className="bs-selection-info">{selectionLabel}</div>
        )} */}
        <button
          className="bs-btn-next"
          disabled={!selectedSeat}
          onClick={handleNext}
        >
          Next Stop →
        </button>
      </div>
    </div>
  );
}
