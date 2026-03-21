import { useState } from "react";

// define full MBTI score state
type Scores = {
  E: number; I: number;
  N: number; S: number;
  T: number; F: number;
  J: number; P: number;
};

// allow partial updates to scores
type ScoreDelta = Partial<Scores>;

export function useMBTIScore() {
  // initialize all scores to 0
  const [scores, setScores] = useState<Scores>({
    E: 0, I: 0,
    N: 0, S: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  });

  function addScore(delta: ScoreDelta) {
    setScores((prev) => {
      const updated = { ...prev };
      for (const key in delta) {
        updated[key as keyof Scores] += delta[key as keyof Scores] ?? 0;
      }
      return updated;
    });
  }

  function getResult(): string {
    return (
      (scores.E >= scores.I ? "E" : "I") +
      (scores.N >= scores.S ? "N" : "S") +
      (scores.T >= scores.F ? "T" : "F") +
      (scores.J >= scores.P ? "J" : "P")
    );
  }

  function resetScores() {
    setScores({ E:0, I:0, N:0, S:0, T:0, F:0, J:0, P:0 });
  }

  return { scores, addScore, getResult, resetScores };
}