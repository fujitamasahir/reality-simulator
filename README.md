# Reality Simulator

**Experience anything. Learn by doing. Prove your skills.**

## Problem

People learn through work, experimentation, failure, and interaction. Yet the experiences they need to grow do not always occur at the right time.

## Solution

Reality Simulator turns learning into simulated workplace experiences. Instead of answering isolated questions, learners investigate evidence, make decisions, and receive contextual feedback.

Try working as a robotics engineer or security analyst. A rule-based adaptive engine chooses the next assignment using evidence of your strengths and weaknesses. See how your decisions change the path, then download a personal experience report.

## What makes it different?

Traditional adaptive learning optimizes which question a learner should answer next. Reality Simulator aims to optimize which **experience** a learner should have next.

## Future vision

Generate authentic scenarios from arbitrary learning materials using AI, maximize practical knowledge gained per unit of time, and provide verifiable skill certificates that help learners demonstrate their abilities to employers.

**Prototype status:** two curated workplaces, local text/PDF evidence-review preview, adaptive routing and downloadable reports. Live generative AI and verified credentials are not yet integrated.

## Run locally

```sh
python3 -m http.server 8000
# Open http://localhost:8000
node --test
```

The static site can be hosted on GitHub Pages. Text-based PDF import uses PDF.js from a CDN and reads the first 20 pages locally; scanned PDFs are not supported. Imported passages remain in local browser storage until reset. The custom scenario generator is a deterministic evidence-review exercise, not a subject-specific simulation.
