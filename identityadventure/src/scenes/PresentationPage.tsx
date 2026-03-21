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
      <button className="addScoreBtn" onClick={() => addScore({ 'E': 1 })}>Test Add Score</button>
      <img
        src="../assets/images/next.png"   // Replace with your image path
        className="nextBtn"             // Keep your styling if needed
        onClick={onNext}
        style={{ cursor: 'pointer' }}   // Makes it look clickable
      />
      <p>E Score: {scores.E}</p>
    </div>
  );
}