"use client";
import { useState } from "react";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Loader2,
  BookOpen,
  ChevronRight,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { AiAnswer } from "@/lib/types";

const SAMPLE_QUESTIONS = [
  "What is the limitation period for recovery of land in Ghana?",
  "What are the grounds for setting aside an arbitral award under the ADR Act 2010?",
  "How do I enforce a foreign judgment in Ghana under the Courts Act 1993?",
  "What is the test for interlocutory injunction in Ghana?",
];

export function AiSearchView() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiAnswer | null>(null);
  const [history, setHistory] = useState<AiAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function ask(q?: string) {
    const query = (q ?? question).trim();
    if (!query) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Request failed");
      }
      const data: AiAnswer = await res.json();
      setResult(data);
      setHistory((h) => [data, ...h].slice(0, 8));
      if (q) setQuestion(q);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
          <Sparkles className="mr-1 h-3 w-3" /> Open to the public · legal fraternity
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">AI Legal Search</h1>
        <p className="text-muted-foreground">
          Ask any question on Ghanaian law — statutes, procedure, case authority.
          Each answer is clearly marked <strong>Verified</strong> or{" "}
          <strong>Unverified</strong>.
        </p>
      </div>

      <Card className="mt-6 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-primary" /> Ask GhanaLex AI
          </CardTitle>
          <CardDescription>
            Be specific. Cite a statute, court or area of law for the most accurate answer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. What is the limitation period for recovery of land in Ghana?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="resize-none"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") ask();
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => ask()} disabled={loading || !question.trim()}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Reasoning…" : "Ask GhanaLex AI"}
            </Button>
            <span className="text-xs text-muted-foreground">
              Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘ + Enter</kbd> to send
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Try one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start py-1.5 text-left text-xs"
                  onClick={() => ask(q)}
                  disabled={loading}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Could not complete the search.</p>
            <p className="text-rose-800">{error}</p>
          </div>
        </div>
      )}

      {result && <AnswerCard answer={result} />}

      {history.length > 1 && (
        <div className="mt-10">
          <div className="mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Recent questions this session</h2>
          </div>
          <div className="space-y-3">
            {history.slice(1).map((h, i) => (
              <button
                key={i}
                onClick={() => setResult(h)}
                className="flex w-full items-center justify-between rounded-md border border-border bg-card p-3 text-left transition hover:border-primary/40"
              >
                <div className="flex-1 truncate pr-3">
                  <p className="truncate text-sm font-medium">{h.question}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {h.answer}
                  </p>
                </div>
                <VerifiedBadge verified={h.verified} small />
                <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnswerCard({ answer }: { answer: AiAnswer }) {
  return (
    <Card className="mt-6 border-primary/40 shadow-md">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardDescription>Your question</CardDescription>
            <CardTitle className="text-base font-semibold leading-snug">
              {answer.question}
            </CardTitle>
          </div>
          <VerifiedBadge verified={answer.verified} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border bg-background p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {answer.answer}
          </p>
        </div>

        {answer.sources && (
          <>
            <Separator className="my-4" />
            <div className="flex items-start gap-2">
              <BookOpen className="mt-0.5 h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Sources &amp; authorities cited
                </p>
                <p className="mt-1 text-sm text-foreground">{answer.sources}</p>
              </div>
            </div>
          </>
        )}

        <div
          className={`mt-4 rounded-md border p-3 text-xs ${
            answer.verified
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-amber-300 bg-amber-50 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {answer.verified ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span className="font-semibold">
              {answer.verified ? "Verified answer" : "Unverified answer"}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed">
            {answer.disclaimer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function VerifiedBadge({
  verified,
  small = false,
}: {
  verified: boolean;
  small?: boolean;
}) {
  return (
    <Badge
      className={`gap-1 ${
        verified
          ? "bg-emerald-600 text-white verified-glow"
          : "bg-amber-500 text-white"
      } ${small ? "text-[10px]" : ""}`}
      variant="default"
    >
      {verified ? (
        <ShieldCheck className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      {verified ? "Verified" : "Unverified"}
    </Badge>
  );
}
