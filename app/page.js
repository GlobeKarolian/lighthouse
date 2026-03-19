"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
} from "recharts";

// ─── Constants ───────────────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  "Reading your story...",
  "Weighing the facts...",
  "Considering the angles...",
  "Crafting headlines...",
  "Writing the TikTok script...",
  "Building assessment...",
];

const DIMENSION_COLORS = {
  Inform: "#cc0000", Connect: "#b35900", Explain: "#7a6800",
  Investigate: "#2d6a2e", Enrich: "#1a5276", Provoke: "#6c3483",
};

const DIMENSION_DESCRIPTIONS = {
  Inform: "The basic facts. Who, what, when, where.",
  Connect: "Links to broader context, trends, or patterns.",
  Explain: "How or why something happened. Cause and effect.",
  Investigate: "Uncovering information not previously public.",
  Enrich: "Depth through voice, narrative, or human experience.",
  Provoke: "Challenging assumptions or sparking debate.",
};

const TABS = [
  { id: "scores", label: "Scores" },
  { id: "writing", label: "Writing" },
  { id: "gaps", label: "Gaps" },
  { id: "headlines", label: "Headlines" },
  { id: "deck", label: "Arc Deck" },
  { id: "video", label: "Video" },
];

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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

// ─── Tab Navigation ──────────────────────────────────────────────────────────

function TabNav({ activeTab, onTabChange, assessment }) {
  return (
    <div className="flex overflow-x-auto gap-1 border-b border-globe-rule mb-6 no-print">
      {TABS.map((tab) => {
        const hasContent = tab.id === "scores" ||
          (tab.id === "writing" && assessment?.writing_feedback?.length > 0) ||
          (tab.id === "gaps" && (assessment?.information_gaps?.length > 0 || assessment?.follow_up_suggestions?.length > 0)) ||
          (tab.id === "headlines" && assessment?.seo_headlines) ||
          (tab.id === "deck" && assessment?.arc_decks?.length > 0) ||
          (tab.id === "video" && assessment?.social_video);

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 font-sans text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-globe-red text-globe-red font-bold"
                : hasContent
                ? "border-transparent text-globe-muted hover:text-globe-text hover:border-globe-rule"
                : "border-transparent text-globe-light/50 cursor-default"
            }`}
            disabled={!hasContent}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Score Bar ───────────────────────────────────────────────────────────────

function ScoreBar({ score, color }) {
  const pct = (score / 5) * 100;
  return (
    <div className="w-full h-2 bg-globe-warmgray rounded-full overflow-hidden">
      <div className="h-full rounded-full animate-fill-bar" style={{ width: `${pct}%`, backgroundColor: color }} />
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
          <span className="font-serif font-bold text-lg text-globe-text">{dimension.name}</span>
          <span className="font-sans text-xs text-globe-light ml-2">{description}</span>
        </div>
        <span className="font-sans font-bold text-lg tabular-nums" style={{ color }}>{dimension.score.toFixed(1)}</span>
      </div>
      <ScoreBar score={dimension.score} color={color} />
      <p className="font-serif text-sm text-globe-muted mt-2 leading-relaxed">{dimension.explanation}</p>
    </div>
  );
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────

function AssessmentRadar({ dimensions }) {
  const data = dimensions.map((d) => ({ dimension: d.name, score: d.score, fullMark: 5 }));
  return (
    <div className="flex justify-center py-4">
      <ResponsiveContainer width={340} height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#c4bfb6" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#1d1d1b", fontSize: 13, fontFamily: "Georgia" }} />
          <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#888", fontSize: 10 }} tickCount={6} />
          <Tooltip contentStyle={{ fontFamily: "Georgia", fontSize: "13px", border: "1px solid #c4bfb6", borderRadius: "4px" }} formatter={(v) => [v.toFixed(1), "Score"]} />
          <Radar name="Score" dataKey="score" stroke="#cc0000" fill="#cc0000" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: "#cc0000" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Scores Tab ──────────────────────────────────────────────────────────────

function ScoresTab({ assessment }) {
  const totalScore = assessment.dimensions.reduce((sum, d) => sum + d.score, 0);
  const maxScore = assessment.dimensions.length * 5;

  return (
    <div className="animate-fade-in-up">
      {/* Total Score */}
      <div className="bg-white border border-globe-rule rounded-lg p-6 mb-6 text-center">
        <span className="font-sans text-xs text-globe-light uppercase tracking-widest">Total Score</span>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="font-serif text-5xl font-bold text-globe-text">{totalScore.toFixed(1)}</span>
          <span className="font-sans text-lg text-globe-light">/ {maxScore}</span>
        </div>
        <div className="w-48 mx-auto mt-3 h-2 bg-globe-warmgray rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-globe-red animate-fill-bar" style={{ width: `${(totalScore / maxScore) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white border border-globe-rule rounded-lg p-4 mb-6">
        <AssessmentRadar dimensions={assessment.dimensions} />
      </div>
      <div className="bg-white border border-globe-rule rounded-lg p-4 mb-6">
        <p className="font-serif text-sm text-globe-muted leading-relaxed">
          This assessment reflects what the story accomplishes across six editorial dimensions.
          Not every story needs to score high in every area. A straightforward news report should
          look very different from a long-form feature. Use these scores to check whether the
          story matches your intent.
        </p>
      </div>
      <div className="bg-white border border-globe-rule rounded-lg px-5">
        {assessment.dimensions.map((d, i) => <DimensionCard key={i} dimension={d} />)}
      </div>
    </div>
  );
}

// ─── Writing Tab ─────────────────────────────────────────────────────────────

function WritingTab({ assessment }) {
  const feedback = assessment.writing_feedback || [];
  if (feedback.length === 0) return <p className="font-serif text-globe-muted">No writing suggestions for this story.</p>;

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="bg-white border border-globe-rule rounded-lg p-4 mb-4">
        <p className="font-serif text-sm text-globe-muted leading-relaxed">
          Sentence-level suggestions on clarity, structure, and readability. These are patterns to
          consider, not rules to follow.
        </p>
      </div>
      {feedback.map((item, i) => (
        <div key={i} className="bg-white border border-globe-rule rounded-lg p-5">
          <div className="mb-3">
            <span className="font-sans text-xs font-bold text-globe-red uppercase tracking-wide">Original</span>
            <p className="font-serif text-sm text-globe-text mt-1 italic bg-globe-cream/50 px-3 py-2 rounded border-l-2 border-globe-rule">
              &ldquo;{item.original}&rdquo;
            </p>
          </div>
          <div className="mb-3">
            <span className="font-sans text-xs font-bold text-globe-muted uppercase tracking-wide">Issue</span>
            <p className="font-serif text-sm text-globe-muted mt-1">{item.issue}</p>
          </div>
          <div>
            <span className="font-sans text-xs font-bold text-green-700 uppercase tracking-wide">Suggestion</span>
            <p className="font-serif text-sm text-globe-text mt-1 bg-green-50 px-3 py-2 rounded border-l-2 border-green-600">
              {item.suggestion}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Gaps Tab (Info Gaps + Follow-ups) ───────────────────────────────────────

function GapsTab({ assessment }) {
  const gaps = assessment.information_gaps || [];
  const followups = assessment.follow_up_suggestions || [];

  return (
    <div className="animate-fade-in-up">
      {gaps.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-xl font-bold text-globe-text border-b-2 border-globe-text pb-1 mb-4">
            Questions a Reader Might Ask
          </h2>
          <p className="font-serif text-sm text-globe-muted mb-4 leading-relaxed">
            Questions the story does not currently answer that a reader might reasonably wonder about.
          </p>
          <div className="space-y-3">
            {gaps.map((gap, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-globe-rule last:border-b-0">
                <span className="font-sans text-xs font-bold text-globe-red mt-1 shrink-0">{i + 1}</span>
                <p className="font-serif text-sm text-globe-text leading-relaxed">{gap}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {followups.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-bold text-globe-text border-b-2 border-globe-text pb-1 mb-4">
            Follow-up Story Ideas
          </h2>
          <p className="font-serif text-sm text-globe-muted mb-4 leading-relaxed">
            Based on dimensions where the story scored below 3.0.
          </p>
          <div className="space-y-4">
            {followups.map((s, i) => (
              <div key={i} className="border-l-4 pl-4 py-2" style={{ borderColor: DIMENSION_COLORS[s.dimension] || "#cc0000" }}>
                <span className="font-sans text-xs font-bold uppercase tracking-wide" style={{ color: DIMENSION_COLORS[s.dimension] || "#cc0000" }}>
                  {s.dimension}
                </span>
                <p className="font-serif text-base text-globe-text mt-1 leading-snug font-bold">{s.headline}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Headlines Tab ───────────────────────────────────────────────────────────

function HeadlinesTab({ assessment, seoSource }) {
  const seo = assessment.seo_headlines;
  if (!seo) return null;

  const sections = [
    { key: "search", label: "Search", description: "Optimized for Google Search results (55-65 chars)", color: "#2563eb" },
    { key: "discover", label: "Google Discover", description: "Optimized for Discover feeds (40-90 chars)", color: "#dc2626" },
    { key: "news", label: "Google News", description: "Optimized for Top Stories carousel (90-110 chars)", color: "#059669" },
  ];

  const copyHeadline = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in-up">
      {seoSource && (
        <div className="bg-white border border-globe-rule rounded-lg p-4 mb-6">
          <p className="font-sans text-xs text-globe-light">
            SEO guidelines source: {seoSource === "google_doc" ? (
              <span className="text-green-700 font-bold">Synced from Google Doc</span>
            ) : (
              <span>Built-in defaults</span>
            )}
            {seoSource !== "google_doc" && (
              <span className="text-globe-light"> (set SEO_GUIDELINES_DOC_ID env var to sync from a Google Doc)</span>
            )}
          </p>
        </div>
      )}
      {sections.map(({ key, label, description, color }) => {
        const headlines = seo[key] || [];
        if (headlines.length === 0) return null;
        return (
          <div key={key} className="mb-8">
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="font-serif text-lg font-bold text-globe-text">{label}</h2>
              <span className="font-sans text-xs text-globe-light">{description}</span>
            </div>
            <div className="space-y-3">
              {headlines.map((h, i) => (
                <div key={i} className="bg-white border border-globe-rule rounded-lg p-4 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-serif text-base text-globe-text font-bold leading-snug">{h.headline}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-sans text-xs text-globe-light">{h.headline.length} chars</span>
                        <span className="font-sans text-xs text-globe-muted">{h.strategy}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyHeadline(h.headline)}
                      className="font-sans text-xs text-globe-light hover:text-globe-red transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-1"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Arc Deck Tab ────────────────────────────────────────────────────────────

function DeckTab({ assessment }) {
  const decks = assessment.arc_decks || [];
  if (decks.length === 0) return null;

  const copyDeck = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="bg-white border border-globe-rule rounded-lg p-4 mb-6">
        <p className="font-serif text-sm text-globe-muted leading-relaxed">
          Short summaries for the Arc CMS &ldquo;deck&rdquo; field. This appears below the headline
          on article pages, in social cards, and in search results. Pick the one that fits best.
        </p>
      </div>
      <div className="space-y-4">
        {decks.map((deck, i) => (
          <div key={i} className="bg-white border border-globe-rule rounded-lg p-5 group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="font-sans text-xs font-bold text-globe-red">Option {i + 1}</span>
                <p className="font-serif text-base text-globe-text mt-2 leading-relaxed">{deck}</p>
                <span className="font-sans text-xs text-globe-light mt-2 block">{deck.length} characters</span>
              </div>
              <button
                onClick={() => copyDeck(deck)}
                className="font-sans text-xs text-globe-light hover:text-globe-red transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Video Tab ───────────────────────────────────────────────────────────────

function VideoTab({ assessment }) {
  const video = assessment.social_video;
  if (!video) return null;

  const copyScript = () => {
    navigator.clipboard.writeText(video.script);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Video Angle */}
      <div className="bg-white border border-globe-rule rounded-lg p-5 mb-6">
        <span className="font-sans text-xs font-bold text-globe-red uppercase tracking-wide">Video Angle</span>
        <p className="font-serif text-base text-globe-text mt-2 leading-relaxed font-bold">{video.video_angle}</p>
      </div>

      {/* Hook Options */}
      {video.hooks && video.hooks.length > 0 && (
        <div className="mb-6">
          <h3 className="font-serif text-lg font-bold text-globe-text mb-3">Hook Options</h3>
          <div className="space-y-3">
            {video.hooks.map((hook, i) => (
              <div key={i} className="bg-white border border-globe-rule rounded-lg p-4 flex gap-3">
                <span className="font-sans text-xs font-bold text-globe-red mt-0.5 shrink-0">{i + 1}</span>
                <p className="font-serif text-sm text-globe-text leading-relaxed">{hook}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Script */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-serif text-lg font-bold text-globe-text">Script</h3>
          <button onClick={copyScript} className="font-sans text-xs text-globe-light hover:text-globe-red transition-colors">
            Copy script
          </button>
        </div>
        <div className="bg-white border border-globe-rule rounded-lg p-5">
          <p className="font-serif text-sm text-globe-text leading-relaxed whitespace-pre-wrap">{video.script}</p>
        </div>
      </div>

      {/* On-screen text */}
      {video.on_screen_text && video.on_screen_text.length > 0 && (
        <div>
          <h3 className="font-serif text-lg font-bold text-globe-text mb-3">On-Screen Text Overlays</h3>
          <div className="space-y-2">
            {video.on_screen_text.map((text, i) => (
              <div key={i} className="bg-globe-text text-white rounded px-4 py-2 font-sans text-sm font-bold text-center">
                {text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Copy All Results ────────────────────────────────────────────────────────

function formatResultsAsText(assessment) {
  let text = "LIGHTHOUSE EDITORIAL ASSESSMENT\n";
  text += "================================\n\n";

  text += "DIMENSION SCORES\n";
  text += "----------------\n";
  for (const d of assessment.dimensions) {
    text += `${d.name}: ${d.score.toFixed(1)} / 5.0\n  ${d.explanation}\n\n`;
  }

  if (assessment.writing_feedback?.length > 0) {
    text += "WRITING FEEDBACK\n";
    text += "----------------\n";
    assessment.writing_feedback.forEach((f) => {
      text += `Original: "${f.original}"\nIssue: ${f.issue}\nSuggestion: ${f.suggestion}\n\n`;
    });
  }

  if (assessment.information_gaps?.length > 0) {
    text += "INFORMATION GAPS\n";
    text += "----------------\n";
    assessment.information_gaps.forEach((gap, i) => { text += `${i + 1}. ${gap}\n`; });
    text += "\n";
  }

  if (assessment.follow_up_suggestions?.length > 0) {
    text += "FOLLOW-UP IDEAS\n";
    text += "---------------\n";
    for (const s of assessment.follow_up_suggestions) { text += `[${s.dimension}] ${s.headline}\n`; }
    text += "\n";
  }

  if (assessment.seo_headlines) {
    text += "SEO HEADLINES\n";
    text += "-------------\n";
    for (const [cat, items] of Object.entries(assessment.seo_headlines)) {
      text += `\n${cat.toUpperCase()}:\n`;
      (items || []).forEach((h) => { text += `  - ${h.headline}\n`; });
    }
    text += "\n";
  }

  if (assessment.arc_decks?.length > 0) {
    text += "ARC DECK OPTIONS\n";
    text += "----------------\n";
    assessment.arc_decks.forEach((d, i) => { text += `${i + 1}. ${d}\n`; });
    text += "\n";
  }

  if (assessment.social_video) {
    text += "TIKTOK/REELS SCRIPT\n";
    text += "-------------------\n";
    text += `Angle: ${assessment.social_video.video_angle}\n\n`;
    text += `${assessment.social_video.script}\n\n`;
  }

  text += "---\nGenerated by Lighthouse";
  return text;
}

// ─── Loading State ───────────────────────────────────────────────────────────

function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = Math.min(i + 1, LOADING_MESSAGES.length - 1);
      setMsgIndex(i);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex space-x-2 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-globe-red"
            style={{ animation: "pulse-slow 1.4s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <p className="font-serif text-lg text-globe-muted animate-pulse-slow">{LOADING_MESSAGES[msgIndex]}</p>
      <p className="font-sans text-xs text-globe-light mt-3">This takes 15-30 seconds</p>
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
  const [activeTab, setActiveTab] = useState("scores");
  const [seoSource, setSeoSource] = useState(null);
  const textareaRef = useRef(null);

  const wordCount = storyText.trim().split(/\s+/).filter((w) => w.length > 0).length;

  const handleSubmit = useCallback(async () => {
    if (!storyText.trim()) return;
    setLoading(true);
    setError(null);
    setAssessment(null);
    setCopied(false);
    setActiveTab("scores");

    try {
      // Fetch SEO guidelines from Google Doc (if configured)
      let seoGuidelines = null;
      try {
        const seoRes = await fetch("/api/seo-guidelines");
        const seoData = await seoRes.json();
        seoGuidelines = seoData.guidelines;
        setSeoSource(seoData.source);
      } catch { /* use defaults */ }

      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyText: storyText.trim(),
          headline: headline.trim() || null,
          seoGuidelines,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Request failed with status ${res.status}`);
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
    setActiveTab("scores");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!assessment) return;
    await navigator.clipboard.writeText(formatResultsAsText(assessment));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [assessment]);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleSubmit(); }
  }, [handleSubmit]);

  // ─── Results View ──────────────────────────────────────────────────────────

  if (assessment) {
    return (
      <div className="min-h-screen">
        <PrototypeBanner />
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-4 no-print">
            <button onClick={handleReset}
              className="font-sans text-sm text-globe-red hover:text-globe-darkred transition-colors underline underline-offset-2">
              &larr; New assessment
            </button>
            <button onClick={handleCopy}
              className="font-sans text-sm px-4 py-2 border border-globe-rule rounded hover:bg-globe-warmgray transition-colors">
              {copied ? "Copied!" : "Copy all results"}
            </button>
          </div>

          {headline && (
            <p className="font-sans text-xs text-globe-light uppercase tracking-wide mb-4">Assessing: {headline}</p>
          )}

          <TabNav activeTab={activeTab} onTabChange={setActiveTab} assessment={assessment} />

          {activeTab === "scores" && <ScoresTab assessment={assessment} />}
          {activeTab === "writing" && <WritingTab assessment={assessment} />}
          {activeTab === "gaps" && <GapsTab assessment={assessment} />}
          {activeTab === "headlines" && <HeadlinesTab assessment={assessment} seoSource={seoSource} />}
          {activeTab === "deck" && <DeckTab assessment={assessment} />}
          {activeTab === "video" && <VideoTab assessment={assessment} />}

          <footer className="mt-12 pt-4 border-t border-globe-rule text-center">
            <p className="font-sans text-xs text-globe-light">
              Lighthouse is an editorial reflection tool. It does not replace editorial judgment.
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
        <div className="text-center mb-8">
          <p className="font-serif text-base text-globe-muted leading-relaxed max-w-xl mx-auto">
            Paste your story below. Lighthouse will assess what it accomplishes, suggest writing improvements,
            generate SEO headlines, write an Arc deck, and draft a TikTok script.
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="headline" className="block font-sans text-xs text-globe-light uppercase tracking-wide mb-1">
            Working headline <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="headline" type="text" value={headline} onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g., City Council approves new housing ordinance in 5-2 vote"
            className="w-full px-4 py-2.5 border border-globe-rule rounded bg-white font-serif text-base text-globe-text placeholder:text-globe-light focus:outline-none focus:ring-2 focus:ring-globe-red/30 focus:border-globe-red transition-colors"
            disabled={loading} />
        </div>

        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="story" className="block font-sans text-xs text-globe-light uppercase tracking-wide">Story text</label>
            {wordCount > 0 && <span className="font-sans text-xs text-globe-light">{wordCount.toLocaleString()} words</span>}
          </div>
          <textarea ref={textareaRef} id="story" value={storyText}
            onChange={(e) => setStoryText(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Paste your story here..."
            rows={18}
            className="w-full px-4 py-3 border border-globe-rule rounded bg-white font-serif text-base text-globe-text placeholder:text-globe-light leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-globe-red/30 focus:border-globe-red transition-colors"
            disabled={loading} />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded">
            <p className="font-sans text-sm text-red-800">{error}</p>
          </div>
        )}

        {!loading ? (
          <button onClick={handleSubmit} disabled={!storyText.trim()}
            className="w-full py-3 font-sans text-base font-bold text-white bg-globe-red rounded hover:bg-globe-darkred transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Run assessment
          </button>
        ) : (
          <LoadingState />
        )}

        {!loading && storyText.trim() && (
          <p className="text-center font-sans text-xs text-globe-light mt-2">
            or press <kbd className="px-1.5 py-0.5 border border-globe-rule rounded text-xs bg-white">Cmd</kbd> + <kbd className="px-1.5 py-0.5 border border-globe-rule rounded text-xs bg-white">Enter</kbd>
          </p>
        )}

        <footer className="mt-16 pt-4 border-t border-globe-rule text-center">
          <p className="font-sans text-xs text-globe-light">
            Lighthouse does not store stories or results. It does not edit, rewrite, or replace editorial judgment.
          </p>
        </footer>
      </main>
    </div>
  );
}
