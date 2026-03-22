import { useMBTI } from '../context/ScoreContext';
import './OtomePage.css';
import elbeeDefault from '../assets/images/elbee_default.png';
import { useState } from 'react';
import { StartPage } from './StartPage';

type OtomePageProps = {
  onNext: () => void;
};

function Elbee({ imageSrc }: { imageSrc?: string }) {
    return (
        <div className='elbee'>
            <img src={imageSrc} alt="Elbee" className='elbee-img' />
        </div>
    )
}

function DialogueBox({ text }: { text: string }) {
    return (
        <div className='dialogue-box'>
            <p>{text}</p>
        </div>
    )
}

function ChoiceButton({ text, onClick }: { text: string, onClick: () => void }) {
    return (
        <button className='choice-button' onClick={onClick}>
            {text}
        </button>
    )
}

function Scene1({ onChoice }: { onChoice: () => void }) {
    return (
        <div className='scene-1'>
            <DialogueBox text="Elbee: Welcome to the Otome Game! Are you ready to find your true love?" />
            <ChoiceButton text="Yes, let's go!" onClick={onChoice} />
        </div>
    )
}

function Scene2({ onChoice }: { onChoice: () => void }) {
    return (
        <div className='scene-2'>
            <DialogueBox text="Elbee: You're doing great! Keep going!" />
            <ChoiceButton text="Continue" onClick={onChoice} />
        </div>
    )
}

export function OtomePage({ onNext }: OtomePageProps) {
  //const { scores, addScore } = useMBTI();
  const [scene, setScene] = useState("scene-1");

  return (
    <div className='ot-page'>
        {scene === "scene-1" && (
            <Scene1 onChoice={() => setScene("scene-2")} />
        )}

        {scene === "scene-2" && (
            <Scene2 onChoice={() => setScene("scene-1")} />
        )}
    </div>
  );
}
    // <div className='ot-page'>
    //     {/* TODO: INTERLUDE w/ animation? */}
    //     <div className='ot-interlude'>  </div>

    //     <Elbee imageSrc={elbeeDefault} />

    //     <Scene1 onChoice={setScene("scene1")} />
    //     {/* TODO show next button when story done */}
    //     <button className='ot-next-btn' onClick={onNext}>Next</button>
    // </div>
 