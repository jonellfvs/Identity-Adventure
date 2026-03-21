import nextImage from '../assets/images/next.png';

type NextButtonProps = {
  onClick: () => void;
};

export function NextButton({ onClick }: NextButtonProps) {
  return (
    <img
      src={nextImage}
      className="nextBtn"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      alt="Next"
    />
  );
}