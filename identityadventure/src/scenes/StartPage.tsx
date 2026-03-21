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
      <img
        src="../assets/images/next.png"   // Replace with your image path
        alt="Next button"
        className="nextBtn"             // Keep your styling if needed
        onClick={() => addScore({ E: 1 })}
        style={{ cursor: 'pointer' }}   // Makes it look clickable
      />
      <p>E Score: {scores.E}</p>
    </div>
  );
}