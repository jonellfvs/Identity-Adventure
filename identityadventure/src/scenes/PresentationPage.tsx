import { useMBTI } from '../context/ScoreContext';
import { NextButton } from '../components/nextButton';

type PresentationPageProps = {
  onNext: () => void;
};

export function PresentationPage({ onNext }: PresentationPageProps) {
  //const { scores, addScore } = useMBTI();

  return (
    /*<div className="presentation-page">
      <h1>It's 1am... Finish up your presentation!</h1>
      <p>Create your most convincing slide!</p>
      <button className="addScoreBtn" onClick={() => addScore({ 'E': 1 })}>Test Add Score</button>
      <NextButton onClick={onNext} />
      <p>E Score: {scores.E}</p>
    </div>*/
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
      </div>

      <p className="ts-hint">🪑 Hover to preview · Click to choose your seat</p>

      <NextButton onClick={onNext} />
    </div>
  );
}