import { useMBTI } from '../context/ScoreContext';


type ChooseItemPageProps = {
  onNext: () => void;
};

export function ChooseItemPage({ onNext }: ChooseItemPageProps) {
  const { scores, addScore } = useMBTI();

  return (
    <div>
      <h1>Youre running late to your first intership interview!</h1>
      <p>Quickly decide what item to bring!</p>
      <button onClick={onNext}>Next</button>
      <button className="nextBtn" onClick={() => addScore({ 'E': 1 })}>Test Add Score</button>
      <p>E Score: {scores.E}</p>
    </div>
  );
}