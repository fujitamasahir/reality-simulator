# Development and deployment

The hackathon MVP is a static website hosted on GitHub Pages from main, repository root. No server, account, or LLM API key is required.

```sh
python3 -m http.server 8000
node --test
```

Open http://localhost:8000. The only playable world is Robotics Engineer, with four assignments selected from a curated scenario pool. The adaptive engine chooses follow-up missions using rule-based estimates; scores are not validated credentials. Progress stays in browser storage.

The earlier experimental live LLM implementation (live.js, worker/, config.js) is retained for future development but is not loaded or invoked by the current MVP. Do not deploy the Worker for the hackathon build. Create your world displays a coming-soon message.
