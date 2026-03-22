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
      <p>E Score: {scores.E}</p>
      <p>I Score: {scores.I}</p>
      <p>S Score: {scores.S}</p>
      <p>N Score: {scores.N}</p>
      <p>T Score: {scores.T}</p>
      <p>F Score: {scores.F}</p>
      <p>J Score: {scores.J}</p>
      <p>P Score: {scores.P}</p>
    </div>
  );
}