import { useMBTI } from '../context/ScoreContext';
import { NextButton } from '../components/nextButton';

type TrainSeatingPageProps = {
  onNext: () => void;
};

export function TrainSeatingPage({ onNext }: TrainSeatingPageProps) {
  const { scores, addScore } = useMBTI();

  return (
    <div className="trainSeatingPage">
      <h1>You barely got into the train!</h1>
      <p>Decide where to sit!</p>
      <button className="nextBtn" onClick={() => addScore({ 'E': 1 })}>
        Test Add Score
      </button>
      <p>E Score: {scores.E}</p>

      <NextButton onClick={onNext} />
    </div>
  );
}