import "./StartPage.css";

type StartPageProps = {
  onNext: () => void;
};

export function StartPage({ onNext }: StartPageProps) {
  return (
    <div className="sp-page">

      {/* Scattered background doodles */}
      <div className="sp-doodles"> 
      <span className="sp-doodle sp-doodle--1">★</span>
      <span className="sp-doodle sp-doodle--2">✦</span>
      <span className="sp-doodle sp-doodle--3">~</span>
      <span className="sp-doodle sp-doodle--4">★</span>
      <span className="sp-doodle sp-doodle--5">✦</span>
      <span className="sp-doodle sp-doodle--6">~</span>
      <span className="sp-doodle sp-doodle--7">★</span>
      <span className="sp-doodle sp-doodle--8">✦</span>
      </div>

      <div className="sp-card">

        {/* Corner brackets */}
        <div className="sp-corner sp-corner--tl" />
        <div className="sp-corner sp-corner--tr" />
        <div className="sp-corner sp-corner--bl" />
        <div className="sp-corner sp-corner--br" />

        {/* Welcome line */}
        <p className="sp-welcome">welcome to the</p>

        {/* Main title */}
        <h1 className="sp-title">
          <span className="sp-title-line1">Identity</span>
          <span className="sp-title-line2">Adventure</span>
        </h1>

        {/* Squiggly divider */}
        <div className="sp-divider">
          <svg viewBox="0 0 200 16" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path
              d="M0,8 C20,0 40,16 60,8 C80,0 100,16 120,8 C140,0 160,16 180,8 C190,4 195,6 200,8"
              fill="none"
              stroke="#2a1a0e"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Instructions */}
        <div className="sp-instructions">
          <div className="sp-instructions-icons">
            <span title="Discover yourself">🧠</span>
          </div>
          <p className="sp-instructions-text">
            Imagine yourself in each scenario<br />
            as actions you would take in real life!
          </p>
          <div className="sp-instructions-icons">
            <span title="Make choices">🎯</span>
          </div>
        </div>

        {/* LET'S GO button */}
        <button className="sp-btn" onClick={onNext}>
          <span className="sp-btn-text">LET'S GO!</span>
          <span className="sp-btn-arrow">→</span>
        </button>

        {/* Footer flavour text */}
        <p className="sp-footer">~ find out your MBTI type ~</p>

      </div>
    </div>
  );
}