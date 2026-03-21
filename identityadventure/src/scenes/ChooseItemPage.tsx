import { useMBTI } from '../context/ScoreContext';
import { SceneLayout } from '../components/sceneLayout';


type ChooseItemPageProps = {
  onNext: () => void;
};

export function ChooseItemPage({ onNext }: ChooseItemPageProps) {
  //const { scores, addScore } = useMBTI();

  return (
      <SceneLayout
        label="Choose item"
        title="Youre running late to your first intership interview!"
        subtitle="Yu have 5 seconds to decide what item to bring!"
        hint="Hover to preview · Click on the image to select"
        onNext={onNext}
      >
        <div className="scene-content">
          {/* your game/question content goes here */}
        </div>
      </SceneLayout>
    );
}