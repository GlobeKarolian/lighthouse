"use client";

import { useState, useRef, useCallback } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── Constants ───────────────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  "Reading your story...",
  "Weighing the facts...",
  "Considering the angles...",
  "Building assessment...",
];

const DIMENSION_COLORS = {
  Inform: "#cc0000",
  Connect: "#b35900",
  Explain: "#7a6800",
  Investigate: "#2d6a2e",
  Enrich: "#1a5276",
  Provoke: "#6c3483",
};

const DIMENSION_DESCRIPTIONS = {
  Inform: "The basic facts. Who, what, when, where.",
  Connect: "Links to broader context, trends, or patterns.",
  Explain: "How or why something happened. Cause and effect.",
  Investigate: "Uncovering information not previously public.",
  Enrich: "Depth through voice, narrative, or human experience.",
  Provoke: "Challenging assumptions or sparking debate.",
};

// ─── Prototype Banner ────────────────────────────────────────────────────────

function PrototypeBanner() {
  return (
    <div className="bg-yellow-400 text-yellow-900 text-center py-2 px-4 font-sans text-sm font-bold tracking-widest uppercase no-print">
      Prototype - Internal Use Only
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="border-b-2 border-globe-text py-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-globe-text tracking-tight">
            Lighthouse
          </h1>
          <p className="font-sans text-xs text-globe-muted mt-1 tracking-wide uppercase">
            Editorial Assessment Tool
          </p>
        </div>
      </div>
    </header>
  );
}

// ─── Score Bar ───────────────────────────────────────────────────────────────

function ScoreBar({ score, color }) {
  const pct = (score / 5) * 100;
  return (
    <div className="w-full h-2 bg-globe-warmgray rounded-full overflow-hidden">
      <div
        className="h-full rounded-full animate-fill-bar"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Dimension Card ──────────────────────────────────────────────────────────

function DimensionCard({ dimension }) {
  const color = DIMENSION_COLORS[dimension.name] || "#cc0000";
  const description = DIMENSION_DESCRIPTIONS[dimension.name] || "";

  return (
    <div className="py-4 border-b border-globe-rule last:border-b-0">
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <span className="font-serif font-bold text-lg text-globe-text">
            {dimension.name}
          </span>
          <span className="font-sans text-xs text-globe-light ml-2">
            {description}
          </span>
        </div>
        <span
          className="font-sans font-bold text-lg tabular-nums"
          style={{ color }}
        >
          {dimension.score.toFixed(1)}
        </span>
      </div>
      <ScoreBar score={dimension.score} color={color} />
      <p className="font-serif text-sm text-globe-muted mt-2 leading-relaxed">
        {dimension.explanation}
      </p>
    </div>
  );
}

// ─── Radar Chart Section ─────────────────────────────────────────────────────

function AssessmentRadar({ dimensions }) {
  const data = dimensions.map((d) => ({
    dimension: d.name,
    score: d.score,
    fullMark: 5,
  }));

  return (
    <div className="flex justify-center py-4">
      <ResponsiveContainer width={340} height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#c4bfb6" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#1d1d1b", fontSize: 13, fontFamily: "Georgia" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: "#888", fontSize: 10 }}
            tickCount={6}
          />
          <Tooltip
            contentStyle={{
              fontFamily: "Georgia",
              fontSize: "13px",
              border: "1px solid #c4bfb6",
              borderRadius: "4px",
            }}
            formatter={(value) => [value.toFixed(1), "Score"]}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#cc0000"
            fill="#cc0000"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ r: 4, fill: "#cc0000" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Information Gaps ────────────────────────────────────────────────────────

function InformationGaps({ gaps }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-serif text-xl font-bold text-globe-text border-b-2 border-globe-text pb-1 mb-4">
        Questions a Reader Might Ask
      </h2>
      <p className="font-serif text-sm text-globe-muted mb-4 leading-relaxed">
        These are questions the story does not currently answer that a reader
        might reasonably wonder about. They may point to opportunities for
        additional reporting, or they may be outside the scope of this
        particular story.
      </p>
      <div className="stagger-children space-y-3">
        {gaps.map((gap, i) => (
          <div
            key={i}
            className="flex gap-3 py-2 border-b border-globe-rule last:border-b-0"
          >
            <span className="font-sans text-xs font-bold text-globe-red mt-1 shrink-0">
              {i + 1}
            </span>
            <p className="font-serif text-sm text-globe-text leading-relaxed">
              {gap}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Follow-up Suggestions ───────────────────────────────────────────────────

function FollowUpSuggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-serif text-xl font-bold text-globe-text border-b-2 border-globe-text pb-1 mb-4">
        Follow-up Story Ideas
      </h2>
      <p className="font-serif text-sm text-globe-muted mb-4 leading-relaxed">
        Based on dimensions where the story scored below 3.0, here are
        potential follow-up angles that could develop those areas further.
      </p>
      <div className="stagger-children space-y-4">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="border-l-4 pl-4 py-2"
            style={{
              borderColor: DIMENSION_COLORS[s.dimension] || "#cc0000",
            }}
          >
            <span
              className="font-sans text-xs font-bold uppercase tracking-wide"
              style={{
                color: DIMENSION_COLORS[s.dimension] || "#cc0000",
              }}
            >
              {s.dimension}
            </span>
            <p className="font-serif text-base text-globe-text mt-1 leading-snug font-bold">
              {s.headline}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Copy Results ────────────────────────────────────────────────────────────

function formatResultsAsText(assessment) {
  let text = "EDITORIAL ASSESSMENT\n";
  text += "====================\n\n";

  text += "DIMENSION SCORES\n";
  text += "----------------\n";
  for (const d of assessment.dimensions) {
    text += `${d.name}: ${d.score.toFixed(1)} / 5.0\n`;
    text += `  ${d.explanation}\n\n`;
  }

  if (assessment.information_gaps?.length > 0) {
    text += "QUESTIONS A READER MIGHT ASK\n";
    text += "----------------------------\n";
    assessment.information_gaps.forEach((gap, i) => {
      text += `${i + 1}. ${gap}\n`;
    });
    text += "\n";
  }

  if (assessment.follow_up_suggestions?.length > 0) {
    text += "FOLLOW-UP STORY IDEAS\n";
    text += "---------------------\n";
    for (const s of assessment.follow_up_suggestions) {
      text += `[${s.dimension}] ${s.headline}\n`;
    }
    text += "\n";
  }

  text += "---\n";
  text += "Generated by Lighthouse";
  return text;
}

// ─── Loading State ───────────────────────────────────────────────────────────

function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useState(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = Math.min(i + 1, LOADING_MESSAGES.length - 1);
      setMsgIndex(i);
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex space-x-2 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-globe-red"
            style={{
              animation: "pulse-slow 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <p className="font-serif text-lg text-globe-muted animate-pulse-slow">
        {LOADING_MESSAGES[msgIndex]}
      </p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [storyText, setStoryText] = useState("");
  const [headline, setHeadline] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const wordCount = storyText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const handleSubmit = useCallback(async () => {
    if (!storyText.trim()) return;

    setLoading(true);
    setError(null);
    setAssessment(null);
    setCopied(false);

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyText: storyText.trim(),
          headline: headline.trim() || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.error || `Request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      setAssessment(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storyText, headline]);

  const handleReset = useCallback(() => {
    setAssessment(null);
    setError(null);
    setCopied(false);
    // Keep the story text so they can re-run if needed
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!assessment) return;
    const text = formatResultsAsText(assessment);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [assessment]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // ─── Results View ──────────────────────────────────────────────────────────

  if (assessment) {
    return (
      <div className="min-h-screen">
        <PrototypeBanner />
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-6 no-print">
            <button
              onClick={handleReset}
              className="font-sans text-sm text-globe-red hover:text-globe-darkred transition-colors underline underline-offset-2"
            >
              &larr; New assessment
            </button>
            <button
              onClick={handleCopy}
              className="font-sans text-sm px-4 py-2 border border-globe-rule rounded hover:bg-globe-warmgray transition-colors"
            >
              {copied ? "Copied!" : "Copy results"}
            </button>
          </div>

          {/* Headline echo */}
          {headline && (
            <p className="font-sans text-xs text-globe-light uppercase tracking-wide mb-2">
              Assessing: {headline}
            </p>
          )}

          {/* Radar chart */}
          <div className="bg-white border border-globe-rule rounded-lg p-4 mb-6">
            <AssessmentRadar dimensions={assessment.dimensions} />
          </div>

          {/* Intro note */}
          <div className="bg-white border border-globe-rule rounded-lg p-4 mb-6">
            <p className="font-serif text-sm text-globe-muted leading-relaxed">
              This assessment reflects what the story accomplishes across six
              editorial dimensions. Not every story needs to score high in
              every area. A straightforward news report should look very
              different from a long-form feature. Use these scores to check
              whether the story matches your intent.
            </p>
          </div>

          {/* Dimension scores */}
          <div className="bg-white border border-globe-rule rounded-lg px-5">
            {assessment.dimensions.map((d, i) => (
              <DimensionCard key={i} dimension={d} />
            ))}
          </div>

          {/* Information gaps */}
          <InformationGaps gaps={assessment.information_gaps} />

          {/* Follow-up suggestions */}
          <FollowUpSuggestions suggestions={assessment.follow_up_suggestions} />

          {/* Footer */}
          <footer className="mt-12 pt-4 border-t border-globe-rule text-center">
            <p className="font-sans text-xs text-globe-light">
              Lighthouse is an editorial reflection tool. It does not
              replace editorial judgment.
            </p>
          </footer>
        </main>
      </div>
    );
  }

  // ─── Input View ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <PrototypeBanner />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro copy */}
        <div className="text-center mb-8">
          <p className="font-serif text-base text-globe-muted leading-relaxed max-w-xl mx-auto">
            Paste your story below. Lighthouse will assess what it
            accomplishes across six editorial dimensions and surface
            opportunities for further reporting.
          </p>
        </div>

        {/* Headline (optional) */}
        <div className="mb-4">
          <label
            htmlFor="headline"
            className="block font-sans text-xs text-globe-light uppercase tracking-wide mb-1"
          >
            Working headline{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="headline"
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g., City Council approves new housing ordinance in 5-2 vote"
            className="w-full px-4 py-2.5 border border-globe-rule rounded bg-white font-serif text-base text-globe-text placeholder:text-globe-light focus:outline-none focus:ring-2 focus:ring-globe-red/30 focus:border-globe-red transition-colors"
            disabled={loading}
          />
        </div>

        {/* Story text area */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <label
              htmlFor="story"
              className="block font-sans text-xs text-globe-light uppercase tracking-wide"
            >
              Story text
            </label>
            {wordCount > 0 && (
              <span className="font-sans text-xs text-globe-light">
                {wordCount.toLocaleString()} words
              </span>
            )}
          </div>
          <textarea
            ref={textareaRef}
            id="story"
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your story here..."
            rows={18}
            className="w-full px-4 py-3 border border-globe-rule rounded bg-white font-serif text-base text-globe-text placeholder:text-globe-light leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-globe-red/30 focus:border-globe-red transition-colors"
            disabled={loading}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded">
            <p className="font-sans text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit button */}
        {!loading ? (
          <button
            onClick={handleSubmit}
            disabled={!storyText.trim()}
            className="w-full py-3 font-sans text-base font-bold text-white bg-globe-red rounded hover:bg-globe-darkred transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Run assessment
          </button>
        ) : (
          <LoadingState />
        )}

        {/* Keyboard shortcut hint */}
        {!loading && storyText.trim() && (
          <p className="text-center font-sans text-xs text-globe-light mt-2">
            or press{" "}
            <kbd className="px-1.5 py-0.5 border border-globe-rule rounded text-xs bg-white">
              Cmd
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 border border-globe-rule rounded text-xs bg-white">
              Enter
            </kbd>
          </p>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-4 border-t border-globe-rule text-center">
          <p className="font-sans text-xs text-globe-light">
            Lighthouse does not store stories or results. It does not
            edit, rewrite, or replace editorial judgment.
          </p>
        </footer>
      </main>
    </div>
  );
}
