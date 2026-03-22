import { useState, useRef } from "react";
import "./PresentationSlide.css";
import { useMBTI } from "../context/ScoreContext";
import cryingGrad from "../assets/images/crying_cs_grad.jpg";
import lineChart from "../assets/images/line_chart.jpeg";
import dataSheet from "../assets/images/data_sheet.png";
import quote from "../assets/images/not_your_fault.webp";

// ─────────────────────────────────────────────────────────
// Drag item definitions + their MBTI scores
// From planning doc:
//   crying image       → +1F
//   emotional anecdote → +1F  (the "quote" option)
//   line graph         → +1T, +1S
//   data spreadsheet   → +1T, +1S
// ─────────────────────────────────────────────────────────
interface DragItem {
  id: string;
  label: string;
  image: string
  score: Partial<Record<"E"|"I"|"S"|"N"|"T"|"F"|"J"|"P", number>>;
}

const ITEMS: DragItem[] = [
  {
    id: "anecdote",
    label: "Emotional Anecdote",
    image: quote,
    score: { F: 1 },
  },
  {
    id: "graph",
    label: "Line Graph",
    image: lineChart,
    score: { T: 1, S: 1 },
  },
  {
    id: "crying",
    label: "Crying Graduate",
    image: cryingGrad,
    score: { F: 1 },
  },
  {
    id: "spreadsheet",
    label: "Data Spreadsheet",
    image: dataSheet,
    score: { T: 1, S: 1 },
  },
];

const MAX_SLOTS = 1;

// ─────────────────────────────────────────────────────────
// Drag item card
// ─────────────────────────────────────────────────────────
interface ItemCardProps {
  item: DragItem;
  isUsed: boolean;
  onDragStart: (id: string) => void;
}

function ItemCard({ item, isUsed, onDragStart }: ItemCardProps) {
  return (
    <div
      className={`ps-item-card ${isUsed ? "ps-item-card--used" : ""}`}
      draggable={!isUsed}
      onDragStart={() => !isUsed && onDragStart(item.id)}
      title={isUsed ? "Already on slide" : `Drag to slide`}
    >
      <img className="ps-item-img" id={item.id} src={item.image} alt={item.label} />
      {isUsed && <span className="ps-item-used-badge">✓</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Drop slot on the slide
// ─────────────────────────────────────────────────────────
interface DropSlotProps {
  slotIndex: number;
  item: DragItem | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onRemove: (index: number) => void;
}

function DropSlot({ slotIndex, item, isDragOver, onDragOver, onDragLeave, onDrop, onRemove }: DropSlotProps) {
  return (
    <div
      className={`ps-drop-slot ${isDragOver ? "ps-drop-slot--over" : ""} ${item ? "ps-drop-slot--filled" : ""}`}
      onDragOver={(e) => onDragOver(e, slotIndex)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, slotIndex)}
    >
      {item ? (
        <div className="ps-slot-content">
          <img className="ps-slot-img" id={item.id} src={item.image} alt={item.label} />
          <button
            className="ps-slot-remove"
            onClick={() => onRemove(slotIndex)}
            title="Remove"
          >
            ✕
          </button>
        </div>
      ) : (
        <span className="ps-slot-placeholder">
          {isDragOver ? "Drop it!" : `Drop item here`}
        </span>
      )}
    </div>
  );
}

// --> Main page
interface PresentationSlideProps {
  onNext?: () => void;
}

export default function PresentationSlide({ onNext }: PresentationSlideProps) {
  const { addScore } = useMBTI();

  const [slots, setSlots]               = useState<(DragItem | null)[]>([null, null]);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const draggingId = useRef<string | null>(null);

  const usedIds = slots.filter(Boolean).map((s) => s!.id);
  const filledCount = slots.filter(Boolean).length;

  // ── drag handlers ──
  function handleDragStart(id: string) {
    draggingId.current = id;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverSlot(index);
  }

  function handleDragLeave() {
    setDragOverSlot(null);
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverSlot(null);
    const id = draggingId.current;
    if (!id) return;

    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;

    // Don't allow same item twice
    if (usedIds.includes(id)) return;

    setSlots((prev) => {
      const next = [...prev];
      next[index] = item;
      return next;
    });

    draggingId.current = null;
  }

  function handleRemove(index: number) {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }

  // ── next ──
  function handleNext() {
    const chosen = slots.filter(Boolean) as DragItem[];
    if (chosen.length < MAX_SLOTS) return;

    // Merge scores from both chosen items
    const combined: Partial<Record<"E"|"I"|"S"|"N"|"T"|"F"|"J"|"P", number>> = {};
    for (const item of chosen) {
      for (const [key, val] of Object.entries(item.score)) {
        const k = key as "E"|"I"|"S"|"N"|"T"|"F"|"J"|"P";
        combined[k] = (combined[k] ?? 0) + (val ?? 0);
      }
    }

    addScore(combined);

    // Build flash label e.g. "+1F +2T +2S"
    const label = Object.entries(combined)
      .map(([k, v]) => `+${v}${k}`)
      .join("  ");

    setTimeout(() => {
      if (onNext) {
        onNext();
      } else {
        // ── replace with your router navigation ──
        alert(`Score saved! ${label}\n\n(Pass an onNext prop or replace this with your router navigation)`);
      }
    }, 400);
  }

  return (
    <div className="ps-page">

      {/* ── PROMPT ── */}
      <div className="ps-prompt-wrapper">
        <div className="ps-prompt-bubble">
          <p className="ps-prompt-label">📋 It's 1am... Finish the last slide!</p>
          <p className="ps-prompt-text">
            Create your most convincing<br />presentation slide!
          </p>
          <p className="ps-prompt-sub">
            Drag <strong>1 item</strong> onto the slide below
          </p>
        </div>
      </div>

      <div className="ps-content">
      {/* ── DRAG ITEMS ── */}
      <div className="ps-items-wrapper">
        <div className="ps-items-tray">
          {ITEMS.slice(0, 2).map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isUsed={usedIds.includes(item.id)}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>

      {/* ── SLIDE ── */}
      <div className="ps-slide">
        {/* Slide decorations */}
        <div className="ps-slide-corner ps-slide-corner--tl" />
        <div className="ps-slide-corner ps-slide-corner--tr" />
        <div className="ps-slide-corner ps-slide-corner--bl" />
        <div className="ps-slide-corner ps-slide-corner--br" />

        <div className="ps-slide-header">
          <div className="ps-slide-dots">
            <span /><span /><span />
          </div>
          <span className="ps-slide-filename">engr361_final_presentation.pptx</span>
        </div>

        <div className="ps-slide-body">
          <h2 className="ps-slide-title">
            90% of freshly graduated CS students<br />
            <span className="ps-slide-title-accent">fail to get a job </span> for two years.
          </h2>

          {/* Drop zones */}
          <div className="ps-slots">
            {slots.slice(0, MAX_SLOTS).map((item, i) => (
              <DropSlot
                key={i}
                slotIndex={i}
                item={item}
                isDragOver={dragOverSlot === i}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        <div className="ps-slide-footer">
          <span>Slide 8 of 8</span>
          <span>CS Job Crisis — Research Presentation</span>
        </div>
      </div>

      {/* ── DRAG ITEMS ── */}
      <div className="ps-items-wrapper">
        <div className="ps-items-tray">
          {ITEMS.slice(2, 4).map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isUsed={usedIds.includes(item.id)}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
      </div>

      {/* ── NEXT BUTTON ── */}
      <div className="ps-btn-area">
        {filledCount > 0 && filledCount < MAX_SLOTS && (
          <p className="ps-btn-hint">Add {MAX_SLOTS - filledCount} more item{MAX_SLOTS - filledCount > 1 ? "s" : ""} to continue</p>
        )}
        <button
          className="ps-btn-next"
          disabled={filledCount < MAX_SLOTS}
          onClick={handleNext}
        >
          Present It! →
        </button>
      </div>

    </div>
  );
}
