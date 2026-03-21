type ResultPageProps = {
  onRestart: () => void;
};

export function ResultPage({ onRestart }: ResultPageProps) {
  return (
    <div>
      <h1>Result Page</h1>
      <p>You reached the end.</p>
      <button onClick={onRestart}>Go Back to Start</button>
    </div>
  );
}