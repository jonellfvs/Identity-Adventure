import { useMBTI } from '../context/ScoreContext';

type StartPageProps = {
  onNext: () => void;
};

export function StartPage({ onNext }: StartPageProps) {
  const { scores, addScore } = useMBTI();
   
  return (
    <div>
      <h1>Start Page</h1>
      <p>This is the beginning of the game.</p>
      <button onClick={onNext}>Start Game</button>
      <button className="addScoreBtn" onClick={() => addScore({ 'E': 1 })}>Test Add Score</button>
      <p>E Score: {scores.E}</p>
    </div>
  );
}