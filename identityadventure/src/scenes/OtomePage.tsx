import { useMBTI } from '../context/ScoreContext';
import './OtomePage.css';
import elbeeDefault from '../assets/images/elbee_default.png';
import elbeeShy from '../assets/images/elbee_shy.png';
import { useState } from 'react';
import otomeBackground from '../assets/images/otome_train_background.png';
import { useEffect } from 'react';

type OtomePageProps = {
  onNext: () => void;
};

function Elbee({ imageSrc, visible }: { imageSrc?: string; visible: boolean }) {
    const [shouldRender, setShouldRender] = useState(visible);

    useEffect(() => {
        if (visible) setShouldRender(true); // mount immediately on enter
    }, [visible]);

    if (!shouldRender) return null;

    return (
        <div
            className='elbee'
            // when animation ends and we're exiting, unmount
            onAnimationEnd={() => { if (!visible) setShouldRender(false); }}
        >
            <img
                src={imageSrc}
                alt="Elbee"
                className={`elbee-img ${visible ? 'elbee-enter' : 'elbee-exit'}`}
            />
        </div>
    );
}

// Local MBTI tally — only tracks scores within this otome game
type LocalMBTI = { E: number; I: number; T: number; F: number; N: number; S: number; J: number; P: number };
const EMPTY_LOCAL_MBTI: LocalMBTI = { E: 0, I: 0, T: 0, F: 0, N: 0, S: 0, J: 0, P: 0 };

type MBTIKey = keyof LocalMBTI;

type Scene = {
  speaker: string;
  text: string;
  choices?: { text: string; nextScene: string; mbtiKeys: Partial<LocalMBTI> }[];
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
        { text: "Google interview. 10:30 AM. I mapped out the route - train, then bus. \nI should arrive 15 minutes early… assuming nothing goes wrong.", nextScene: "scene-3", mbtiKeys: { J: 1, T: 1 } },
        { text: "Somewhere… career-defining? Or life-ruining. Depends on how today goes, I guess.", nextScene: "scene-3", mbtiKeys: { P: 1, N: 1 } },
        { text: "I could tell you, but I feel like your answer might be more interesting. \nWhere are you headed?", nextScene: "scene-3", mbtiKeys: { E: 1, F: 1 } },
        { text: "...An interview", nextScene: "scene-3", mbtiKeys: { I: 1 } },
        ],
    },
    "scene-3": {
        speaker: "",
        text: "Suddenly, the train jolts and comes to a halt. The lights flicker for a second. Murmus, sighs, and then silence fills the cabin.",
        nextScene: "scene-4"
    },
    "scene-4": {
        speaker: "Elbee",
        text: "...Well. This is new.",
        choices: [
            { text: "Hold on. (Pull out your phone to check route)", nextScene: "scene-5", mbtiKeys: { T: 1 } },
            { text: "Perfect. Exactly how I imagined my villain origin story starting.", nextScene: "scene-5", mbtiKeys: { E: 1 } },
            { text: "Hopefully you don't have anywhere to be soon.", nextScene: "scene-5", mbtiKeys: { F: 1 } },
            { text: "(Glance out the window while waiting)", nextScene: "scene-5", mbtiKeys: { I: 1 } },
        ],
    },
    "scene-5": {
        speaker: "Elbee",
        text: "I've got snacks if you'd like, this might be a while.",
        choices: [
            { text: "Ooh, I'll take a snack. Is this your go-to?", nextScene: "scene-6", mbtiKeys: { E: 1, F: 1 } },
            { text: "No, I'm good. Thanks though.", nextScene: "scene-6", mbtiKeys: { I: 1, T: 1 } },
            { text: "(Smile, nod, and extend your hand)", nextScene: "scene-6", mbtiKeys: { F: 1, I: 1 } },
            { text: "Only if you answer my question first.\n...do you carry anything cursed?", nextScene: "scene-6", mbtiKeys: { N: 1, P: 1 } },
        ],
    },
    // scene-6 is dynamically resolved based on local MBTI ending — see getEnding()
    "scene-6-good": {
        speaker: "",
        text: "The train starts moving again. You end up chatting the whole ride...",
        // no nextScene = triggers onNext()
    },
    "scene-6-neutral": {
        speaker: "",
        text: "The train starts moving again. It was a brief but memorable encounter...",
        // no nextScene = triggers onNext()
    },
    "scene-6-bad": {
        speaker: "",
        text: "The train starts moving again. You both sat in a comfortable silence...",
        // no nextScene = triggers onNext()
    },
};

// Derives ending from local MBTI tally accumulated only during this otome game.
// Elbee responds to warmth: E+F scores = good, I+T scores = bad, anything else = neutral.
// Adjust these thresholds to tune how easy each ending is to reach.
function getEnding(local: LocalMBTI): string {
    const warmScore = local.E + local.F;
    const coldScore = local.I + local.T;
    if (warmScore > coldScore && warmScore >= 2) return "scene-6-good";
    if (coldScore > warmScore && coldScore >= 2) return "scene-6-bad";
    return "scene-6-neutral";
}

// Which scenes should show Elbee (appears scene-2, disappears after scene-5)
const ELBEE_VISIBLE_SCENES = new Set(["scene-2", "scene-3", "scene-4", "scene-5"]);
// scene-5 uses the shy image
const ELBEE_SHY_SCENES = new Set(["scene-5"]);

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


export function OtomePage({ onNext }: OtomePageProps) {
  const { addScore } = useMBTI();
  const [sceneKey, setSceneKey] = useState("scene-1");
  const [showChoices, setShowChoices] = useState(false);
  // Local MBTI tally — only used within this otome game to determine the ending
  const [localMBTI, setLocalMBTI] = useState<LocalMBTI>(EMPTY_LOCAL_MBTI);

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
            handleNext(); // if no choices and no nextScene, just advance to next page
        }
    };

    const handleChoice = (nextScene: string, mbtiKeys: Partial<LocalMBTI>) => {
    const updatedLocal = { ...localMBTI };
    for (const key in mbtiKeys) {
        updatedLocal[key as MBTIKey] += mbtiKeys[key as MBTIKey] ?? 0;
    }
    setLocalMBTI(updatedLocal);

    addScore(mbtiKeys);

    const resolvedNext = nextScene === "scene-6" ? getEnding(updatedLocal) : nextScene;
    setSceneKey(resolvedNext);
    setShowChoices(false);
};

    // Determine which Elbee image to show, or hide entirely
    const showElbee = ELBEE_VISIBLE_SCENES.has(sceneKey);
    const elbeeSrc = ELBEE_SHY_SCENES.has(sceneKey) ? elbeeShy : elbeeDefault;

    const [fadingOut, setFadingOut] = useState(false);

    const handleNext = () => {
        setFadingOut(true);
        // wait for animation to finish before actually changing page
        setTimeout(onNext, 1000); // match to CSS duration
    };

  return (
    <div className='ot-page' 
        style={{ backgroundImage: `url(${otomeBackground})`}}
        onClick={handleClick}
    >
        <div className='fade-in-overlay' />

{fadingOut && <div className='fade-out-overlay' />}
        {/* Elbee character — appears from scene-2, shy on scene-5, hidden after scene-5 */}
        {showElbee && <Elbee imageSrc={elbeeSrc} visible={showElbee} />}

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
                            onClick={() => handleChoice(choice.nextScene, choice.mbtiKeys)} // type assertion since we're only passing one key per choice in this implementation
                        />
                    ))}
                </div>
            </div>
        )}

        {/* <div className='fade-out-overlay' /> for smooth transition when unmounting */}
    </div>
  );
}