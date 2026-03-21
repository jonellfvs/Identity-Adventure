
import type { ReactNode } from 'react';
import { NextButton } from './nextButton';

type SceneLayoutProps = {
  label: string;
  title: string;
  subtitle?: string;
  hint?: string;
  onNext?: () => void;
  children: ReactNode;
};

export function SceneLayout({
  label,
  title,
  subtitle,
  hint,
  onNext,
  children,
}: SceneLayoutProps) {
  return (
    <div className="scene-page">
      <div className="scene-prompt-wrapper">
        <div className="scene-prompt-bubble">
          <p className="scene-prompt-label">{label}</p>
          <p className="scene-prompt-text">{title}</p>
          {subtitle && <p className="scene-prompt-sub">{subtitle}</p>}
        </div>
      </div>

      <div className="scene-content">
        {children}
      </div>

      {hint && <p className="scene-hint">{hint}</p>}

      {onNext && <NextButton onClick={onNext} />}
    </div>
  );
}