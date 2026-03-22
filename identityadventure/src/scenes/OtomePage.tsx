import { useMBTI } from '../context/ScoreContext';

type OtomePageProps = {
  onNext: () => void;
};

export function OtomePage({ onNext }: OtomePageProps) {
  //const { scores, addScore } = useMBTI();

  return (
    <div className='ot-page'>
        <h1>Interlude...</h1>
        <button onClick={onNext}>Start Game</button>
    </div>
  );
}