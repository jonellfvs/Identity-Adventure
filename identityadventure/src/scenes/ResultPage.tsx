import { useMBTI } from '../context/ScoreContext';


type ResultPageProps = {
  onRestart: () => void;
};

export function ResultPage({ onRestart }: ResultPageProps) {
  const { scores, addScore } = useMBTI();

  return (
    <div>
      <h1>Result Page</h1>
      <p>You reached the end.</p>
      <button onClick={onRestart}>Go Back to Start</button>
      <button className="nextBtn" onClick={() => addScore({ 'E': 1 })}>Test Add Score</button>
      <p>E Score: {scores.E}</p>
    </div>
  );
}