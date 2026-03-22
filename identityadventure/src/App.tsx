import { useState } from 'react'
import './App.css'

import { StartPage } from './scenes/StartPage'
import  PresentationSlide  from './scenes/PresentationSlide'
import ChooseItemPage from './scenes/ChooseItemPage'
import TrainSeatingPage from './scenes/TrainSeatingPage'  
import BusSeatingPage from './scenes/BusSeatingPage'
import { ResultPage } from './scenes/ResultPage'
import { OtomePage } from './scenes/OtomePage'
import SchedPlannerPage from './scenes/SchedPlannerPage'
import EnemyEncounter from './scenes/EnemyEncounter'

function App() {
  const [scene, setScene] = useState("intro");

  return (
    <>
      {scene === "intro" && (
        <StartPage onNext={() => setScene("enemy-encounter")} />
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
        <TrainSeatingPage onNext={() => setScene("bus-seating")} />
      )}

      {scene === "otome" && (
        <OtomePage onNext={() => setScene("bus-seating")} />
      )}

      {scene === "bus-seating" && (
        <BusSeatingPage onNext={() => setScene("sched-planner")} />
      )}

      {scene === "sched-planner" && (
        <SchedPlannerPage onNext={() => setScene("enemy-encounter")} />
      )}

      {scene === "enemy-encounter" && (
        <EnemyEncounter onNext={() => setScene("result")} />
      )}
    </>
  );
}

export default App;