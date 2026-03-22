/**
 * EnemyEncounterPage.tsx
 *
 * Layout:
 *   ┌─────────────────────────┐
 *   │   TOP — enemy + prompt  │  ← 50% height, full width
 *   ├────────────┬────────────┤
 *   │  Choice A  │  Choice B  │  ← 50% height, each 50% width
 *   └────────────┴────────────┘
 */

import { useState } from "react";
import "./EnemyEncounter.css";
import { useMBTI } from "../context/ScoreContext";
import hide from "../assets/images/hide.png";
import fight from "../assets/images/fight.png";


type MBTIDim = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

interface Choice {
  title:     string;
  scores:    Partial<Record<MBTIDim, number>>;
}

const CHOICE_A: Choice = {
  title:  "Hide",
  scores: { I: 1, P: 1 },
};

const CHOICE_B: Choice = {
  title:  "Fight",
  scores: { E: 1, J: 1 },
};
// ─────────────────────────────────────────────────────────────────────────────

interface EnemyEncounterProps {
  onNext?: (choice: "hide" | "fight") => void;
}

export default function EnemyEncounter({ onNext }: EnemyEncounterProps) {
  const { addScore } = useMBTI();

  function handleChoice(choice: Choice, key: "hide" | "fight") {
    addScore(choice.scores);

    if (onNext) {
        onNext(key);
    }
  }

  return (
    <div className="ee-page">

      {/* ── TOP PANEL ── */}
      <div className="ee-top">

        <div className="ee-prompt-bubble">
          <p className="ee-prompt-label">⚔️ Enemy Encounter</p>
          <p className="ee-prompt-text">You ran into the owner of the $1 million; an enemy!</p>
          <p className="ee-prompt-sub">Choose how you respond…</p>
        </div>

      </div>

      {/* ── BOTTOM-LEFT BUTTON ── */}
      <button
        className="ee-choice-btn ee-choice-left"
        data-label="Hide"
        onClick={() => handleChoice(CHOICE_A, "hide")}
        >
        <img src={hide} alt="Hide" className="ee-choice-hide" />
      </button>

      <button
        className="ee-choice-btn ee-choice-right"
        data-label="Fight"
        onClick={() => handleChoice(CHOICE_B, "fight")}
        >
        <img src={fight} alt="Fight" className="ee-choice-fight" />
      </button>

    </div>
  );
}
