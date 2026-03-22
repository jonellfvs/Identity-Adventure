import { useState, useEffect } from 'react'
import './App.css'

import { StartPage } from './scenes/StartPage'
import  PresentationSlide  from './scenes/PresentationSlide'
import  ChooseItemPage from './scenes/ChooseItemPage'
import  TrainSeatingPage  from './scenes/TrainSeatingPage'  
import { ResultPage } from './scenes/ResultPage'
import { OtomePage } from './scenes/OtomePage'
import SchedPlannerPage from './scenes/SchedPlannerPage'
import BusSeating from './scenes/BusSeatingPage'
import EnemyEncounter from './scenes/EnemyEncounterPage'
import FindChargerPage from './scenes/FindChargerPage'
import NotificationPage from './scenes/NotificationPage'
import TowerBloxx from './scenes/TowerBloxxPage'


function InterludeScreen({ onDone, text }: { onDone: () => void; text: string }) {
  // Auto-advance after animation completes (match duration to CSS)
  useEffect(() => {
    const timer = setTimeout(onDone, 4000);
    return () => clearTimeout(timer);
  }, []);

  return <div className='interlude-screen'>{text}</div>;
}

function App() {
  // CHANGE BACK TO INTRO BEFORE SUBMISSION
  const [scene, setScene] = useState("intro");

  // Keeps track if the user chooses to hide or fight when enemy was encountered
  const [enemyChoice, setEnemyChoice] = useState<"hide" | "fight" | null>(null);

  return (
    <div style={{ width: "100vw", minHeight: "100vh", overflow: "hidden" }}>
      {scene === "intro" && (
        <StartPage onNext={() => setScene("presentation")} />
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
        <InterludeScreen onDone={() => setScene("otome")} text="Interlude..." />
      )}

      {scene === "otome" && (
        <OtomePage onNext={() => setScene("bus-seating")} />
      )}

      {scene === "bus-seating" && (
        <BusSeating onNext={() => setScene("sched-planner")} />
      )}

      {scene === "sched-planner" && (
        <SchedPlannerPage onNext={() => setScene("Interlude2")} />
      )}

      {scene === "Interlude2" && (
        <InterludeScreen onDone={() => setScene("enemy-encounter")} text="You find yourself lost, walking mindlessly for some time, and then..." />
      )}

      {scene === "enemy-encounter" && (
        <EnemyEncounter onNext={(choice) => {
          setEnemyChoice(choice);
          setScene("tower-bloxx");
        }} />
      )}

      {scene === "tower-bloxx" && (
        <TowerBloxx onNext={() => setScene("Interlude3")} />
      )}

      {scene === "Interlude3" && (
        <InterludeScreen
          onDone={() => setScene("find-charger")}
          text={enemyChoice === "hide"
            ? "You tried to hide... but the enemy found you! They took the money. You're now helpless, lost, and.. your phone is dead."
            : "You fought back... but the enemy defeated you! They took the money. You're now helpless, lost, and.. your phone is dead."}
        />
      )}
      
      {scene === "find-charger" && (
        <FindChargerPage onNext={() => setScene("Interlude4")} />
      )}

      {scene === "Interlude4" && (
        <InterludeScreen onDone={() => setScene("notification")} text={"You found a charger and got your phone back to life! \nThere's one notification waiting..."} />
      )}

      {scene === "notification" && (
        <NotificationPage onNext={() => setScene("result")} />
      )}

      {scene === "result" && (
        <ResultPage onRestart={() => setScene("intro")} />
      )}
    </div>
  );
}

export default App;