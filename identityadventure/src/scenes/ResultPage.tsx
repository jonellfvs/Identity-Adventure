import { useEffect, useState } from "react";
import "./ResultPage.css";
import { useMBTI } from "../context/ScoreContext";
import INTJtypies from "../assets/images/INTJ-typies.jpg";
import INTPtypies from "../assets/images/INTP-typies.jpg";
import ENTJtypies from "../assets/images/ENTJ-typies.jpg";
import ENFPtypies from "../assets/images/ENFP-typies.jpg";

import INFJtypies from "../assets/images/INFJ-typies.jpg";
import INFPtypies from "../assets/images/INFP-typies.jpg";
import ENFJtypies from "../assets/images/ENFJ-typies.jpg";
import ENTPtypies from "../assets/images/ENFP-typies.jpg";

import ISTJtypies from "../assets/images/ISTJ-typies.jpg";
import ISFJtypies from "../assets/images/ISFJ-typies.jpg";
import ESTJtypies from "../assets/images/ESTJ-typies.jpg";
import ESFJtypies from "../assets/images/ESFJ-typies.jpg";

import ISTPtypies from "../assets/images/ISTP-typies.jpg";
import ISFPtypies from "../assets/images/ISFP-typies.jpg";
import ESTPtypies from "../assets/images/ESTP-typies.jpg";
import ESFPtypies from "../assets/images/ESFP-typies.jpg";

// ─────────────────────────────────────────────────────────
// MBTI type data
// ─────────────────────────────────────────────────────────
type MBTIData = {
  title: string;
  tagline: string;
  description: string;
  csQuote: string;
  emoji: string;
  sprite: string;
  color: string;
};

const MBTI_DATA: Record<string, MBTIData> = {
  INTJ: { title: "The Architect",    tagline: "Mastermind behind the curtain",              description: "Strategic and independent, INTJs are the system designers of the world. They see inefficiency as a personal insult and will refactor everything — including their social life — for optimal performance.", csQuote: '"Any fool can write code a computer understands. Good code is written for humans." — Martin Fowler',                                          emoji: "🏗️", sprite: INTJtypies, color: "#4a6fa5" },
  INTP: { title: "The Logician",     tagline: "Still debugging the meaning of life",         description: "Inventive and analytical, INTPs live in their heads. They'll spend 3 hours automating a 5-minute task and have zero regrets. Stack Overflow is their love language.",                                                                        csQuote: '"Programs must be written for people to read, and only incidentally for machines to execute." — Abelson',                                      emoji: "🔬", sprite: INTPtypies, color: "#5b8a6f" },
  ENTJ: { title: "The Commander",    tagline: "CEO of the group project",                    description: "Bold and driven, ENTJs see every project as a conquest. They assigned themselves scrum master before the team even met, and honestly? The sprint is going great.",                                                                            csQuote: '"Move fast and break things." — Mark Zuckerberg (probably on their vision board)',                                                              emoji: "⚡", sprite: ENTJtypies, color: "#c0392b" },
  ENTP: { title: "The Debater",      tagline: "Will argue tabs vs spaces for 45 minutes",    description: "Quick-witted and resourceful, ENTPs love a good technical argument — not to win, but because the chaos is fun. They have 12 side projects and none are finished.",                                                                           csQuote: '"The best error message is the one that never shows up." — Thomas Fuchs',                                                                       emoji: "💡", sprite: ENTPtypies, color: "#d68910" },
  INFJ: { title: "The Advocate",     tagline: "Building tech for the greater good",           description: "Visionary and empathetic, INFJs code with purpose. They want their app to change lives and they write the most thoughtful commit messages on the team.",                                                                                     csQuote: '"Technology is best when it brings people together." — Matt Mullenweg',                                                                         emoji: "🌱", sprite: INFJtypies, color: "#8e44ad" },
  INFP: { title: "The Mediator",     tagline: "The readme is a short story",                 description: "Creative and idealistic, INFPs bring soul to code. Their variable names are poetic, their UI is beautiful, and they cried a little pushing their first open-source contribution.",                                                           csQuote: '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',                                                                    emoji: "🌸", sprite: INFPtypies, color: "#c0647a" },
  ENFJ: { title: "The Protagonist",  tagline: "Makes everyone feel included in the PR review",description: "Charismatic and altruistic, ENFJs are the ones hosting the hackathon and still submitting a project. They leave encouraging comments on everyone's code.",                                                                                   csQuote: '"Alone we can do so little; together we can do so much." — Helen Keller',                                                                       emoji: "🌟", sprite: ENFJtypies, color: "#e07b39" },
  ENFP: { title: "The Campaigner",   tagline: "Started 6 projects this month, shipped 1",    description: "Enthusiastic and creative, ENFPs are the spark in every hackathon team. They pitched the idea, hyped everyone, and yes — they wrote code too (mostly the fun parts).",                                                                      csQuote: '"First, solve the problem. Then, write the code." — John Johnson',                                                                               emoji: "🎉", sprite: ENFPtypies, color: "#e8a020" },
  ISTJ: { title: "The Logistician",  tagline: "Documentation written before the code",       description: "Responsible and detail-oriented, ISTJs are the backbone of every engineering team. They follow the style guide, version control everything, and actually read the docs.",                                                                    csQuote: '"Weeks of coding can save you hours of planning." — Unknown',                                                                                   emoji: "📋", sprite: ISTJtypies, color: "#2e7d7d" },
  ISFJ: { title: "The Defender",     tagline: "Will fix your bugs without being asked",       description: "Warm and meticulous, ISFJs are the unsung heroes of every codebase. They wrote the utility functions everyone uses, and they never broke prod. Not once.",                                                                                  csQuote: '"Make it work, make it right, make it fast." — Kent Beck',                                                                                      emoji: "🛡️", sprite: ISFJtypies, color: "#4a8a6a" },
  ESTJ: { title: "The Executive",    tagline: "Jira tickets assigned before standup ends",    description: "Organized and no-nonsense, ESTJs run a tight ship. They have strong opinions about folder structure and will enforce them. The CI pipeline is green and will stay that way.",                                                               csQuote: '"Simplicity is the soul of efficiency." — Austin Freeman',                                                                                      emoji: "📊", sprite: ESTJtypies, color: "#b03a2e" },
  ESFJ: { title: "The Consul",       tagline: "Brought snacks to the 3am hackathon session", description: "Caring and social, ESFJs make every dev environment warmer. They're the glue of the team, remember everyone's coffee order, and still shipped a feature.",                                                                                  csQuote: '"Good software, like good wine, takes time." — Joel Spolsky',                                                                                   emoji: "☕", sprite: ESFJtypies, color: "#a04060" },
  ISTP: { title: "The Virtuoso",     tagline: "Fixes bugs by instinct, explains nothing",     description: "Practical and observant, ISTPs are the ones who just know why the server crashed. They won't document it — but they'll fix it in 10 minutes flat.",                                                                                        csQuote: '"If it ain\'t broke, add more features until it is." — Unknown',                                                                                emoji: "🔧", sprite: ISTPtypies, color: "#5d6d7e" },
  ISFP: { title: "The Adventurer",   tagline: "Turned the loading screen into a masterpiece", description: "Artistic and gentle, ISFPs bring beauty to everything they touch. Their UI animations are chef's kiss and their color palette choices are genuinely inspired.",                                                                             csQuote: '"Design is not just what it looks like. Design is how it works." — Steve Jobs',                                                                 emoji: "🎨", sprite: ISFPtypies, color: "#9b59b6" },
  ESTP: { title: "The Entrepreneur", tagline: "Deployed to prod on a Friday, no regrets",    description: "Bold and perceptive, ESTPs thrive in chaos. They'll hack together a working demo in 2 hours and present it with full confidence. Ship it now, polish it later.",                                                                           csQuote: '"Real programmers don\'t comment their code. If it was hard to write, it should be hard to understand." — Unknown',                             emoji: "🚀", sprite: ESTPtypies, color: "#ca6f1e" },
  ESFP: { title: "The Entertainer",  tagline: "Made the terminal print in rainbow colors",    description: "Spontaneous and energetic, ESFPs make coding fun. They discovered 3 new libraries this week, added confetti to the submit button, and users absolutely love it.",                                                                          csQuote: '"Any application that can be written in JavaScript, will eventually be written in JavaScript." — Atwood\'s Law',                                emoji: "🎊", sprite: ESFPtypies, color: "#d4437a" },
};

// ─────────────────────────────────────────────────────────
// Score bar
// ─────────────────────────────────────────────────────────
type ScoreBarProps = {
  leftLabel: string;
  rightLabel: string;
  leftVal: number;
  rightVal: number;
  color: string;
  delay: number;
};

function ScoreBar({ leftLabel, rightLabel, leftVal, rightVal, color, delay }: ScoreBarProps) {
  const [animated, setAnimated] = useState(false);
  const total = leftVal + rightVal || 1;
  const leftPct  = Math.round((leftVal  / total) * 100);
  const rightPct = 100 - leftPct;
  const dominantLeft = leftVal >= rightVal;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="rp-bar-row">
      <span className={`rp-bar-label rp-bar-label--left ${dominantLeft ? "rp-bar-label--dominant" : ""}`}>
        {leftLabel} <em>{leftVal}pt</em>
      </span>
      <div className="rp-bar-track">
        <div className="rp-bar-fill rp-bar-fill--left"  style={{ width: animated ? `${leftPct}%`  : "0%", background: dominantLeft  ? color : "#d4c9b0", transitionDelay: `${delay}ms` }} />
        <div className="rp-bar-center" />
        <div className="rp-bar-fill rp-bar-fill--right" style={{ width: animated ? `${rightPct}%` : "0%", background: !dominantLeft ? color : "#d4c9b0", transitionDelay: `${delay}ms` }} />
      </div>
      <span className={`rp-bar-label rp-bar-label--right ${!dominantLeft ? "rp-bar-label--dominant" : ""}`}>
        <em>{rightVal}pt</em> {rightLabel}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────
type ResultPageProps = {
  onRestart: () => void;
};

export function ResultPage({ onRestart }: ResultPageProps) {
  const { scores, getResult, resetScores } = useMBTI();
  const type = getResult();
  const data = MBTI_DATA[type] ?? MBTI_DATA["INTP"];

  function handleRestart() {
    resetScores();
    onRestart();
  }

  return (
    <div className="rp-page">

      {/* Background doodles */}
      <span className="rp-doodle rp-doodle--1">★</span>
      <span className="rp-doodle rp-doodle--2">✦</span>
      <span className="rp-doodle rp-doodle--3">~</span>
      <span className="rp-doodle rp-doodle--4">★</span>
      <span className="rp-doodle rp-doodle--5">✦</span>

      {/* ══ FULL VIEWPORT GRID ══ */}
      <div className="rp-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="rp-left">

          <p className="rp-wake">
            It was all a dream!<br /> You wake up and realize you're an...
          </p>

          <div className="rp-sprite-wrapper">
            <img
              src={data.sprite}
              alt={`${type} sprite`}
              className="rp-sprite"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const fb = (e.target as HTMLImageElement).nextSibling as HTMLElement;
                if (fb) fb.style.display = "flex";
              }}
            />
            <span className="rp-sprite-fallback">{data.emoji}</span>
          </div>

          <div className="rp-identity">
            <span className="rp-type-emoji">{data.emoji}</span>
            <p className="rp-type-code" style={{ color: data.color }}>{type}</p>
            <p className="rp-type-title">{data.title}</p>
            <p className="rp-type-tagline">"{data.tagline}"</p>
          </div>

          

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="rp-right">

          <div className="rp-card rp-card--description">
            <h3 className="rp-card-title">Who you are</h3>
            <p className="rp-card-text">{data.description}</p>
          </div>

          

          <div className="rp-card rp-card--bars">
            <h3 className="rp-card-title">Results breakdown</h3>
            <div className="rp-bars">
              <ScoreBar leftLabel="I" rightLabel="E" leftVal={scores.I} rightVal={scores.E} color={data.color} delay={300} />
              <ScoreBar leftLabel="S" rightLabel="N" leftVal={scores.S} rightVal={scores.N} color={data.color} delay={450} />
              <ScoreBar leftLabel="F" rightLabel="T" leftVal={scores.F} rightVal={scores.T} color={data.color} delay={600} />
              <ScoreBar leftLabel="J" rightLabel="P" leftVal={scores.J} rightVal={scores.P} color={data.color} delay={750} />
            </div>
          </div>

          <div className="rp-card-col-row">
            <div className="rp-card rp-card--quote">
              <h3 className="rp-card-title">Your coding philosophy</h3>
              <blockquote className="rp-quote-text">{data.csQuote}</blockquote>
            </div>

            <div className="rp-card rp-card--links">
              <h3 className="rp-card-title">Learn more about {type}</h3>
              <div className="rp-links">
                <a href={`https://www.16personalities.com/${type.toLowerCase()}-personality`} target="_blank" rel="noopener noreferrer" className="rp-link">🌐 16personalities.com</a>
                <a href={`https://www.truity.com/personality-type/${type}`} target="_blank" rel="noopener noreferrer" className="rp-link">🧠 Truity MBTI Profile</a>
              </div>
            </div>

          </div>
          <button className="rp-btn-restart" onClick={handleRestart}>
            ↩ Play Again
          </button>

        </div>
      </div>
    </div>
  );
}