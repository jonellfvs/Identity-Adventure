import { useMBTI } from '../context/ScoreContext';
import { SceneLayout } from '../components/sceneLayout';

type PresentationPageProps = {
  onNext: () => void;
};

export function PresentationPage({ onNext }: PresentationPageProps) {
  //const { scores, addScore } = useMBTI();

  return (
    <SceneLayout
      label="Presentation"
      title="It's 1 am... and you have a presentation tomorrow morning!"
      subtitle="Click the best image that finishes the presentation."
      hint="Hover to preview · Drag the image to the specified position"
      onNext={onNext}
    >
      <div className="scene-content">
        {/* your game/question content goes here */}
      </div>
    </SceneLayout>
  );
}