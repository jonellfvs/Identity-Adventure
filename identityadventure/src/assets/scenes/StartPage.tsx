type StartPageProps = {
  onNext: () => void;
};

export function StartPage({ onNext }: StartPageProps) {
  return (
    <div>
      <h1>Start Page</h1>
      <p>This is the beginning of the game.</p>
      <button onClick={onNext}>Start Game</button>
    </div>
  );
}