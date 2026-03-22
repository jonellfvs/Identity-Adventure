/**
 * SchedPlannerPage.tsx
 *
 * You find $1,000,000 on your seat — what do you do with it?
 * Drag up to 5 tasks into the planner. If you add 5+, earn +1J.
 * Each task also grants its own score bonuses on submit.
 */

import { useState, useRef } from "react";
import "./SchedPlanner.css";
import { useMBTI } from "../context/ScoreContext";

// ─── Types ───────────────────────────────────────────────────────────────────
type MBTIDim = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

interface TaskDef {
  id:     string;
  label:  string;
  scores: Partial<Record<MBTIDim, number>>;
}

// ─── All 15 tasks ─────────────────────────────────────────────────────────────
const ALL_TASKS: TaskDef[] = [
  {
    id:     "chatgpt",
    label:  "Ask ChatGPT how to invest it",
    scores: { T: 1 },
  },
  {
    id:     "nonprofit",
    label:  "Donate to a non-profit that helps freshly graduated CS students find a job",
    scores: { F: 1, J: 1, S: 1 },
  },
  {
    id:     "startup",
    label:  "Build a startup with friends",
    scores: { N: 1, E: 1 },
  },
  {
    id:     "twitch",
    label:  "Become a Twitch Streamer",
    scores: { E: 1, P: 1 },
  },
  {
    id:     "anime",
    label:  "Commission the next season of your favorite anime",
    scores: { F: 1, N: 1 },
  },
  {
    id:     "vegas",
    label:  "Book it to Las Vegas and GAMBLE!!!!",
    scores: { P: 1, E: 1 },
  },
  {
    id:     "crypto",
    label:  "Put it into crypto",
    scores: { P: 1, T: 1 },
  },
  {
    id:     "loans",
    label:  "Secretly pay off your friend's student loans",
    scores: { I: 1, F: 1, S: 1 },
  },
  {
    id:     "cottage",
    label:  "Buy a cottage in the countryside",
    scores: { F: 1, I: 1 },
  },
  {
    id:     "keyboards",
    label:  "Buy 10,000 mechanical keyboards and resell later",
    scores: { S: 1 },
  },
];

const MAX_TASKS   = 5;
const BONUS_AT    = 5;   // tasks needed for +1J bonus

const LEFT_TASKS  = ALL_TASKS.slice(0, Math.ceil(ALL_TASKS.length / 2));
const RIGHT_TASKS = ALL_TASKS.slice(Math.ceil(ALL_TASKS.length / 2));

// ─── Main component ───────────────────────────────────────────────────────────
interface SchedPlannerProps {
  onNext?: () => void;
}

export default function SchedPlanner({ onNext }: SchedPlannerProps) {
  const { addScore } = useMBTI();

  const [planned,    setPlanned]    = useState<TaskDef[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragTaskId = useRef<string | null>(null);

  const isFull     = planned.length >= MAX_TASKS;
  const hasBonus   = planned.length >= BONUS_AT;
  const usedIds    = new Set(planned.map(t => t.id));

  // ── Drag handlers ────────────────────────────────────────────────────────
  function onDragStart(taskId: string) {
    dragTaskId.current = taskId;
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!isFull || usedIds.has(dragTaskId.current ?? "")) return;
    setIsDragOver(true);
  }

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function onDragLeave() {
    setIsDragOver(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const id   = dragTaskId.current;
    if (!id) return;
    const task = ALL_TASKS.find(t => t.id === id);
    if (!task) return;
    if (usedIds.has(id)) return;       // already added
    if (planned.length >= MAX_TASKS) return; // full
    setPlanned(prev => [...prev, task]);
    dragTaskId.current = null;
  }

  function removeTask(id: string) {
    setPlanned(prev => prev.filter(t => t.id !== id));
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  function handleNext() {
    if (planned.length === 0) return;

    // Accumulate scores from all planned tasks
    const total: Partial<Record<MBTIDim, number>> = {};
    for (const task of planned) {
      for (const [dim, val] of Object.entries(task.scores) as [MBTIDim, number][]) {
        total[dim] = (total[dim] ?? 0) + val;
      }
    }

    // +1J bonus for planning 5+ tasks
    if (hasBonus) {
      total["J"] = (total["J"] ?? 0) + 1;
    }

    addScore(total);
    if (onNext) {
        onNext();
    }
  }

  // ── Task card ────────────────────────────────────────────────────────────
  function TaskCard({ task }: { task: TaskDef }) {
    const used = usedIds.has(task.id);
    return (
      <div
        className={`sp-task-card${used ? " sp-task-card--used" : ""}`}
        draggable={!used}
        onDragStart={() => onDragStart(task.id)}
        title={used ? "Already in your planner" : "Drag to your planner"}
      >
        {task.label}
      </div>
    );
  }

  return (
    <div className="sp-page">

      {/* ── PROMPT ── */}
      <div className="sp-prompt-wrapper">
        <div className="sp-prompt-bubble">
          <p className="sp-prompt-label">💰 Schedule Planner</p>
          <p className="sp-prompt-text">
            You find $1,000,000 on your seat.<br />How would you spend it?
          </p>
          <p className="sp-prompt-sub">
            Drag tasks into your planner!
          </p>
        </div>
      </div>

      {/* ── LEFT COLUMN ── */}
      <div className="sp-col-left">
        {LEFT_TASKS.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* ── CENTRE: PLANNER ── */}
      <div className="sp-centre">
        <div className="sp-planner">
          <div className="sp-planner-header">
            <span className="sp-planner-title">📋 My $1M Plan</span>
            <span className={`sp-planner-count${isFull ? " sp-planner-count--full" : ""}`}>
            </span>
          </div>

          <div
            className={[
              "sp-drop-zone",
              isDragOver  ? "sp-drop-zone--over" : "",
              isFull      ? "sp-drop-zone--full" : "",
            ].join(" ").trim()}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {planned.length === 0 ? (
              <div className="sp-drop-hint">
                ← Drag 1 or more tasks here →
              </div>
            ) : (
              planned.map(task => (
                <div key={task.id} className="sp-dropped-item">
                  <span className="sp-dropped-item-text">{task.label}</span>
                  <button
                    className="sp-dropped-remove"
                    onClick={() => removeTask(task.id)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {hasBonus && (
          <div className="sp-bonus-banner">
            <span className="sp-bonus-star">⭐</span>
            Planner full!
          </div>
        )}

        <p className="sp-hint">
          🗑 Click ✕ on a task to remove it
        </p>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="sp-col-right">
        {RIGHT_TASKS.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* ── NEXT BUTTON ── */}
      <div className="sp-btn-area">
        <button
          className="sp-btn-next"
          disabled={planned.length === 0}
          onClick={handleNext}
        >
          Board Off Bus →
        </button>
      </div>

    </div>
  );
}
