import { useMBTI } from '../context/ScoreContext';


type TrainSeatingPageProps = {
  onNext: () => void;
};

export function TrainSeatingPage({ onNext }: TrainSeatingPageProps) {
  const { scores, addScore } = useMBTI();

  return (
    <div>
      <h1>You barely got into the train!</h1>
      <p>Decide where to sit!</p>
      <button onClick={onNext}>Next</button>
      <button className="nextBtn" onClick={() => addScore({ 'E': 1 })}>
        Test Add Score
      </button>
      <p>E Score: {scores.E}</p>
    </div>
  );
}