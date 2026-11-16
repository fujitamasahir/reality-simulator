# Run and deploy

## Local web app

```sh
python3 -m http.server 8000
node --test
```

Open http://localhost:8000. The curated worlds work without a backend.

## Live AI (Cloudflare Worker + OpenAI Responses API)

The browser must never contain an OpenAI API key. The Worker makes the model calls using a server-side secret. Use a dedicated API project and monitor API spend.

1. Create or sign in to a Cloudflare account and enable Workers. Create an OpenAI API project and API key with billing enabled.
2. From the repository root, run (Node.js required):

```sh
cd worker
npx wrangler@4 login
npx wrangler@4 deploy
npx wrangler@4 secret put OPENAI_API_KEY
npx wrangler@4 secret put DEMO_ACCESS_CODE
```

Enter secrets interactively. Never paste the OpenAI key into the website, GitHub, or README. For an initial deployment, the endpoint returns an error until the secrets are set.

3. Copy the HTTPS Worker URL printed by Wrangler, append /api/scenario, and set SCENARIO_API in the repository-root config.js. Commit and push config.js to main. The endpoint URL is public, not a secret.
4. After GitHub Pages updates, open the site, click Create your world, and enter the demo code.

For a no-code public hackathon demo, explicitly set ALLOW_PUBLIC_DEMO to "true" in worker/wrangler.jsonc, remove the DEMO_ACCESS_CODE secret if set (it takes priority), and deploy again. The public endpoint is billable. The Worker enforces per-IP and aggregate rate limits, but those limits are approximate, per Cloudflare location, and do not provide a hard global spending cap. CORS is not authentication. Keep the access code on unless you specifically choose public access; monitor usage, set alerts, and disable the endpoint after judging. Do not commit the access code.

Local development: put OPENAI_API_KEY and DEMO_ACCESS_CODE in worker/.dev.vars (ignored by Git), then run npx wrangler@4 dev inside worker; the frontend automatically targets localhost:8787 on localhost. No scanned-PDF OCR. Live mode sends a bounded extract (first 20 pages, 18,000 characters), topic and decisions to the backend/model. Do not submit confidential content. The request sets store:false; that does not guarantee zero provider retention. No live session is stored by the frontend. Curated mode uses browser storage.

The AI generates a scenario at start and, for each free response, returns feedback plus a new scene. Structured outputs and runtime checks enforce response shape; exact source quotes are checked against the supplied text. Fictional evidence and scores can still be wrong. There is no secure credential issuance; client history is untrusted. Unit tests mock the model response and do not validate real model quality.

References: https://developers.openai.com/api/docs/guides/structured-outputs and https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
