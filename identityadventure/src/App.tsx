import { useState } from 'react'
import './App.css'

import { StartPage } from './assets/scenes/StartPage'
import { ResultPage } from './assets/scenes/ResultPage'

function App() {
  const [scene, setScene] = useState("intro");

  return (
    <>
      {scene === "intro" && (
        <StartPage onNext={() => setScene("result")} />
      )}

      {scene === "result" && (
        <ResultPage onRestart={() => setScene("intro")} />
      )}
    </>
  );
}

export default App;