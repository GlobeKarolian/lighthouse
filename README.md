# Lighthouse

An AI-powered editorial assessment tool that scores stories across six journalism dimensions and surfaces opportunities for further reporting.

Built for the Boston Globe newsroom. **Prototype / Internal Use Only.**

## What it does

A reporter pastes their story text. The tool returns:

1. **Dimension scores (0-5)** across six editorial dimensions: Inform, Connect, Explain, Investigate, Enrich, Provoke
2. **Information gap analysis** -- questions a reader might ask that the story doesn't currently answer
3. **Follow-up story suggestions** -- headline ideas for dimensions scoring below 3.0

The tool is reflective, not evaluative. It tells reporters what their story accomplishes so they can decide whether that matches their intent.

## Setup

### Prerequisites

- Node.js 18+
- An Anthropic API key

### Install

```bash
git clone https://github.com/YOUR_ORG/lighthouse.git
cd lighthouse
npm install
```

### Configure

Copy the example environment file and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

The easiest path to a live URL:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add `ANTHROPIC_API_KEY` as an environment variable in the Vercel project settings
4. Deploy

Vercel will auto-detect Next.js and handle the rest.

## Tech stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** for styling
- **Recharts** for the radar chart
- **Anthropic Claude** (claude-sonnet-4-20250514) for the editorial assessment

## Architecture

```
app/
  page.js          -- Main UI (input state, results state)
  layout.js        -- Root layout
  globals.css      -- Tailwind + custom styles
  api/
    assess/
      route.js     -- API route: receives story text, calls Claude, returns JSON
```

The system prompt in `route.js` contains the full scoring rubric and calibration guidance. If scores feel off, that is the file to tune.

## Known limitations

- No authentication (prototype)
- No persistent storage
- No integration with Arc or other CMS
- Desktop-first layout (mobile works but is not optimized)
- No style guide checking (planned for v2)
