import { useState } from 'react'
import './App.css'

import { StartPage } from './scenes/StartPage'
import  PresentationSlide  from './scenes/PresentationSlide'
import  ChooseItemPage from './scenes/ChooseItemPage'
import  TrainSeatingPage  from './scenes/TrainSeatingPage'  
import { ResultPage } from './scenes/ResultPage'
import { OtomePage } from './scenes/OtomePage'

function App() {
  const [scene, setScene] = useState("intro");

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
        <TrainSeatingPage onNext={() => setScene("otome")} />
      )}

      {scene === "otome" && (
        <OtomePage onNext={() => setScene("result")} />
      )}
    </>
  );
}

export default App;