import { useState, useEffect } from 'react'
import './App.css'

import { StartPage } from './scenes/StartPage'
import  PresentationSlide  from './scenes/PresentationSlide'
import  ChooseItemPage from './scenes/ChooseItemPage'
import  TrainSeatingPage  from './scenes/TrainSeatingPage'  
import { ResultPage } from './scenes/ResultPage'
import { OtomePage } from './scenes/OtomePage'


function InterludeScreen({ onDone }: { onDone: () => void }) {
  // Auto-advance after animation completes (match duration to CSS)
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, []);

  return <div className='interlude-screen'>Interlude...</div>;
}

function App() {
  // CHANGE BACK TO INTRO BEFORE SUBMISSION
  const [scene, setScene] = useState("train-seating");

  return (
    <>
      {scene === "intro" && (
        <StartPage onNext={() => setScene("presentation")} />
      )}

      {scene === "result" && (
        <ResultPage onRestart={() => setScene("intro")} />
      )}

      {scene === "presentation" && (
        <PresentationSlide onNext={() => setScene("choose-item")} />
      )}

      {scene === "choose-item" && (
        <ChooseItemPage onNext={() => setScene("train-seating")} />
      )}

      {scene === "train-seating" && (
        <TrainSeatingPage onNext={() => setScene("interlude")} />
      )}

      {/* Interlude screen between train-seating and otome */}
      {scene === "interlude" && (
        <InterludeScreen onDone={() => setScene("otome")} />
      )}

      {scene === "otome" && (
        <OtomePage onNext={() => setScene("result")} />
      )}
    </>
  );
}

export default App;