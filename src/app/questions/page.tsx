"use client";

import { useState, useMemo } from "react";
import { Eye, EyeOff, Shuffle } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import { TopicBadge } from "@/components/ui/Badges";
import type { Question, QuestionTopic } from "@/types";

const topicOpts: { value: string; label: string }[] = [
  { value: "Все", label: "Все" },
  { value: "История", label: "История" },
  { value: "Игры", label: "Игры" },
  { value: "Математика", label: "Математика" },
  { value: "Философия", label: "Философия" },
  { value: "Химия", label: "Химия" },
  { value: "Литература", label: "Литература" },
  { value: "Технологии", label: "Технологии" },
  { value: "Другое", label: "Другое" },
];

const difficultyOpts = [
  { value: "Все", label: "Все" },
  { value: "1", label: "1/5" },
  { value: "2", label: "2/5" },
  { value: "3", label: "3/5" },
  { value: "4", label: "4/5" },
  { value: "5", label: "5/5" },
];

const difficultyColors = ["", "bg-green-50 text-green-700", "bg-lime-50 text-lime-700", "bg-amber-50 text-amber-700", "bg-orange-50 text-orange-700", "bg-red-50 text-red-700"];

function QuestionCard({ question }: { question: Question }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <GlassCard className="flex flex-col gap-3 hover:shadow-glass-lg transition-all">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-medium">№ {question.number}</span>
        <TopicBadge topic={question.topic} />
      </div>

      <p className="text-sm font-medium text-foreground leading-relaxed">{question.text}</p>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColors[question.difficulty]} border-current/20`}>
          Сложность: {question.difficulty}/5
        </span>
        <span>· {question.tournamentType}</span>
        <span>· {question.date}</span>
      </div>

      {revealed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-700 mb-1">Ответ:</p>
          <p className="text-sm text-green-800 font-medium">{question.answer}</p>
          {question.explanation && (
            <p className="text-xs text-green-600 mt-1">{question.explanation}</p>
          )}
        </div>
      ) : null}

      <button
        onClick={() => setRevealed(r => !r)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        {revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        {revealed ? "Скрыть ответ" : "Показать ответ"}
      </button>
    </GlassCard>
  );
}

export default function QuestionsPage() {
  const { questions } = useStore();
  const [topics, setTopics] = useState(["Все"]);
  const [difficulties, setDifficulties] = useState(["Все"]);
  const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);
  const [randomRevealed, setRandomRevealed] = useState(false);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (val: string) => {
      setter(prev => {
        if (val === "Все") return ["Все"];
        const next = prev.includes(val) ? prev.filter(v => v !== val) : [...prev.filter(v => v !== "Все"), val];
        return next.length ? next : ["Все"];
      });
    };

  const pickRandom = () => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    setRandomQuestion(q);
    setRandomRevealed(false);
  };

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (!topics.includes("Все") && !topics.includes(q.topic)) return false;
      if (!difficulties.includes("Все") && !difficulties.includes(String(q.difficulty))) return false;
      return true;
    });
  }, [questions, topics, difficulties]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Архив вопросов"
        subtitle="Образовательная база вопросов прошлых турниров."
        actions={
          <button
            onClick={pickRandom}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Shuffle className="size-4" />
            Случайный вопрос
          </button>
        }
      />

      {/* Random question block */}
      {randomQuestion && (
        <GlassCard className="mb-6 border-emerald-200 bg-emerald-50/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Случайный вопрос</span>
            <div className="flex items-center gap-2">
              <TopicBadge topic={randomQuestion.topic} />
              <button onClick={pickRandom} className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                <Shuffle className="size-3" /> Другой
              </button>
            </div>
          </div>
          <p className="text-sm font-medium text-foreground mb-2 leading-relaxed">{randomQuestion.text}</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
            <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${difficultyColors[randomQuestion.difficulty]}`}>
              {randomQuestion.difficulty}/5
            </span>
            <span>· {randomQuestion.tournamentType} · {randomQuestion.season} · {randomQuestion.date}</span>
          </div>
          {randomRevealed ? (
            <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-2">
              <p className="text-xs font-semibold text-green-700">Ответ: <span className="font-bold">{randomQuestion.answer}</span></p>
              {randomQuestion.explanation && <p className="text-xs text-green-600 mt-1">{randomQuestion.explanation}</p>}
            </div>
          ) : null}
          <button
            onClick={() => setRandomRevealed(r => !r)}
            className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-medium"
          >
            {randomRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {randomRevealed ? "Скрыть" : "Показать ответ"}
          </button>
        </GlassCard>
      )}

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Тема</p>
          <InlineChipFilter options={topicOpts} selected={topics} onToggle={toggle(setTopics)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Сложность</p>
          <InlineChipFilter options={difficultyOpts} selected={difficulties} onToggle={toggle(setDifficulties)} />
        </div>
      </div>

      {/* Questions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(q => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Нет вопросов с выбранными фильтрами</p>
        </div>
      )}
    </div>
  );
}
