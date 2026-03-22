import { useMBTI } from '../context/ScoreContext';
import './OtomePage.css';
import elbeeDefault from '../assets/images/elbee_default.png';
import { useState } from 'react';
import { StartPage } from './StartPage';
import otomeBackground from '../assets/images/otome_train_background.png';
import { NextButton } from '../components/nextButton';

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

type Scene = {
  speaker: string;
  text: string;
  choices?: { text: string; nextScene: string }[];
  nextScene?: string; // for non-choice scenes
};

const SCENES: Record<string, Scene> = {
    "scene-1": {
        speaker: "You",
        text: "You take your seat just in time before the train departs. As you settle in, you notice someone approaching...",
        nextScene: "scene-2",
        // no choices = clicking just advances to next scene
    },
    "scene-2": {
        speaker: "Elbee",
        text: "I've never seen you on this train before. The name's Elbee, where are you headed?",
        choices: [
        { text: "Google interview. 10:30 AM. I mapped out the route - train, then bus. I should arrive 15 minutes early… assuming nothing goes wrong.", nextScene: "scene-3" },
        { text: "Somewhere… career-defining? Or life-ruining. Depends on how today goes, I guess", nextScene: "scene-3" },
        { text: "I could tell you—but I feel like your answer might be more interesting. Where are you headed?", nextScene: "scene-3" },
        { text: "...An interview", nextScene: "scene-3" },
        ],
    },
    "scene-3": {
        speaker: "You",
        text: "Suddenly, the train jolts and comes to a halt. The lights flicker for a second. Murmus, sighs, and then silence fills the cabin.",
        nextScene: "scene-4"
    },
    "scene-4": {
        speaker: "Elbee",
        text: "...Well. This is new.",
        choices: [
            { text: "Hold on. (Pull out your phone to check route)", nextScene: "scene-5" },
            { text: "Perfect. Exactly how I imagined my villain origin story starting.", nextScene: "scene-5" },
            { text: "Hopefully you don't have anywhere to be soon.", nextScene: "scene-5" },
            { text: "(Glance out the window while waiting)", nextScene: "scene-5" },
        ],
    },
    "scene-5": {
        speaker: "Elbee",
        text: "I've got snacks if you'd like, this might be a while.",
        choices: [
            { text: "Ooh, I’ll take a snack. Thanks.", nextScene: "scene-6" },
            { text: "No, I’m good. Thanks though", nextScene: "scene-6" },
            { text: "(Smile, nod, and extend your hand)", nextScene: "scene-6" },
            { text: "Only if you answer my question first... do you carry anything cursed?", nextScene: "scene-6" },
        ],
    },
    "scene-6": {
        speaker: "You",
        // Based on choices in otome game only, give 1 of 3 endings
        text: "ENDING HERE",
    },
};



function DialogueBox({ speaker, text }: { speaker: string, text: string }) {
    return (
        <div className='dialogue-box'>
            <p className='speaker'>{speaker}</p>
            <p className='text'>{text}</p>
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
            <DialogueBox speaker="You" text="You take your seat and notice someone approaching..." />
            <ChoiceButton text="Yes, let's go!" onClick={onChoice} />
        </div>
    )
}

function Scene2({ onChoice }: { onChoice: () => void }) {
    return (
        <div className='scene-2'>
            <DialogueBox speaker="Elbee" text="I've never seen you on this train before. The name's Elbee, where are you headed?" />
            <ChoiceButton text="Continue" onClick={onChoice} />
        </div>
    )
}



export function OtomePage({ onNext }: OtomePageProps) {
  //const { scores, addScore } = useMBTI();
  const [sceneKey, setSceneKey] = useState("scene-1");
  const [showChoices, setShowChoices] = useState(false);

  const scene = SCENES[sceneKey];

    const handleClick = () => {
        if (showChoices) {
            return; // don't advance scene if choices are showing
        }

        if (scene.choices) {
            setShowChoices(true);
        }
        else if (scene.nextScene) {
            setSceneKey(scene.nextScene);
        }
        else {
            onNext(); // if no choices and no nextScene, just advance to next page
        }
    };

    const handleChoice = (nextScene: string) => {
        // e.stopPropagation(); // prevent click from also triggering handleClick
        setSceneKey(nextScene);
        setShowChoices(false);
    };


  return (
    <div className='ot-page' 
        style={{ backgroundImage: `url(${otomeBackground})`}}
        onClick={handleClick}
    >
        {/* <Elbee imageSrc={elbeeDefault} /> */}
        {/* TODO: INTERLUDE w/ animation? */}
        <div className='ot-interlude'>  </div>

        <DialogueBox speaker={scene.speaker} text={scene.text} />

        {showChoices && (
            <div className='choices-overlay'>
                <div className='choices-container'>
                    {scene.choices?.map((choice, index) => (
                        <ChoiceButton
                            key={index}
                            text={choice.text}
                            onClick={() => handleChoice(choice.nextScene)}
                        />
                    ))}
                </div>
            </div>
        )}


        
        {/* TODO show next button when story done or make last button */}
        {/* <button className='ot-next-btn' onClick={onNext}>Next</button> */}
    </div>
  );
}