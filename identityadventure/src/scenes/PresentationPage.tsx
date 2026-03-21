import { useMBTI } from '../context/ScoreContext';


type PresentationPageProps = {
  onNext: () => void;
};

export function PresentationPage({ onNext }: PresentationPageProps) {
  const { scores, addScore } = useMBTI();

  return (
    <div>
      <h1>It's 1am... Finish up your presentation!</h1>
      <p>Create your most convincing slide!</p>
      <button onClick={onNext}>Next</button>
      <button className="nextBtn" onClick={() => addScore({ 'E': 1 })}>Test Add Score</button>
      <p>E Score: {scores.E}</p>
    </div>
  );
}