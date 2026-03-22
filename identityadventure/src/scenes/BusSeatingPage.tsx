import { useState } from "react";
import "./BusSeating.css";
import { useMBTI } from "../context/ScoreContext";

type SeatStatus = "occupied" | "empty" | "selected";

interface SeatDef {
  col: number;
  status: SeatStatus;
  scoreType?: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  scoreVal?: number;
}

const ROW_1: SeatDef[] = [
  { col: 0, status: "empty",    scoreType: "E", scoreVal: 1 },
  { col: 1, status: "occupied" },
  { col: 2, status: "occupied" },
  { col: 3, status: "empty",    scoreType: "I", scoreVal: 1 },
];

const ROW_2: SeatDef[] = [
  { col: 0, status: "occupied" },
  { col: 1, status: "empty",    scoreType: "E", scoreVal: 1 },
  { col: 2, status: "occupied" },
  { col: 3, status: "empty",    scoreType: "E", scoreVal: 1 },
];

const ROW_3: SeatDef[] = [
  { col: 0, status: "empty",    scoreType: "E", scoreVal: 1 },
  { col: 1, status: "empty",    scoreType: "I", scoreVal: 1 },
  { col: 2, status: "empty",    scoreType: "E", scoreVal: 2 },
  { col: 3, status: "occupied" },
];

const ROW_4: SeatDef[] = [
  { col: 0, status: "occupied" },
  { col: 1, status: "occupied" },
  { col: 2, status: "occupied" },
  { col: 3, status: "empty",    scoreType: "I", scoreVal: 2 },
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

  function handleSelectSeat(seat: SeatDef) {
    setSelectedSeat(seat);
  }

  function handleNext() {
    if (!selectedSeat) return;

    const type = selectedSeat.scoreType!;
    const val  = selectedSeat.scoreVal!;

    // Add to shared MBTI context
    addScore({ [type]: val });
    if (onNext) {
        onNext();
    }
  }

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
                seat={{ ...seat, col: seat.col + 20 }}
                isSelected={selectedSeat?.col === seat.col + 20}
                onSelect={(s) => handleSelectSeat({ ...seat, col: seat.col + 20 })}
            />
            ))}
          </div>
          <div className="bs-seat-row">
            {ROW_3.map((seat) => (
              <Seat
                key={`r3-c${seat.col}`}
                seat={{ ...seat, col: seat.col + 30 }}
                isSelected={selectedSeat?.col === seat.col + 30}
                onSelect={(s) => handleSelectSeat({ ...seat, col: seat.col + 30 })}
            />
            ))}
          </div>
          <div className="bs-seat-spacer" />
          <div className="bs-seat-row">
            {ROW_4.map((seat) => (
              <Seat
                key={`r4-c${seat.col}`}
                seat={{ ...seat, col: seat.col + 40 }} // offset col id so row 2 seats are unique
                isSelected={
                  selectedSeat !== null &&
                  selectedSeat.col === seat.col + 40
                }
                onSelect={(s) =>
                  handleSelectSeat({ ...seat, col: seat.col + 40 })
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
          Continue →
        </button>
      </div>
    </div>
  );
}
