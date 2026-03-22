# 🧠 Identity Adventure

> A chaotic, story-driven MBTI personality quiz built for BeachHacks 9.0!

---

## What is it?

**Identity Adventure** is a narrative mini-game where every choice you make secretly scores your MBTI personality type. You play as a CS student navigating a wild sequence — from late-night presentations to train rides to finding a million dollars on a bus seat — and at the end, you wake up to discover who you really are.

No boring questionnaires. Just games and fun!

---

## How to Play

Work through a series of story scenes. Each choice you make adds points to one or more MBTI dimensions:

| Dimension | Measures |
|---|---|
| **E / I** | Extraversion vs. Introversion |
| **N / S** | Intuition vs. Sensing |
| **T / F** | Thinking vs. Feeling |
| **J / P** | Judging vs. Perceiving |

At the end, your scores are tallied and you get one of **16 MBTI personality types** — complete with a CS-flavored description, coding philosophy quote, and score breakdown.



## Tech Stack

- **React** + **TypeScript** (Vite)
- **CSS** — hand-styled per component, no UI library
- **Context API** — shared MBTI score state across all scenes via `MBTIProvider`


---

## Running Locally

```bash
cd identityadventure
npm install
npm run dev
```

---

## Team

Built at **BeachHacks 9.0** in 24 hours.
