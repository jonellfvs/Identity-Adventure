import { useMBTI } from '../context/ScoreContext';
import { NextButton } from '../components/nextButton';


type ChooseItemPageProps = {
  onNext: () => void;
};

export function ChooseItemPage({ onNext }: ChooseItemPageProps) {
  const { scores, addScore } = useMBTI();

  return (
    <div className="chooseItemPage">
      <h1>Youre running late to your first intership interview!</h1>
      <p>Quickly decide what item to bring!</p>
      <button className="addScoreBtn" onClick={() => addScore({ 'E': 1 })}>Test Add Score</button>
      <p>E Score: {scores.E}</p>

      <NextButton onClick={onNext} />
    </div>
  );
}