"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Shuffle } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import { TopicBadge } from "@/components/ui/Badges";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import type { Question } from "@/types";

const QUESTIONS_PER_PAGE = 20;

function getVisiblePages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, currentPage]);
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(sorted[i]);
  }
  return result;
}

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
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / QUESTIONS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [topics, difficulties]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    return filtered.slice(start, start + QUESTIONS_PER_PAGE);
  }, [filtered, currentPage]);

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * QUESTIONS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * QUESTIONS_PER_PAGE, filtered.length);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          {rangeStart}–{rangeEnd} из {filtered.length} вопросов
          {totalPages > 1 && ` · страница ${currentPage} из ${totalPages}`}
        </p>
      )}

      {/* Questions grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Нет вопросов с выбранными фильтрами</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map(q => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    size="default"
                    aria-label="Предыдущая страница"
                    className={`gap-1 px-2.5 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage > 1) goToPage(currentPage - 1);
                    }}
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Назад</span>
                  </PaginationLink>
                </PaginationItem>

                {getVisiblePages(currentPage, totalPages).map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={e => {
                          e.preventDefault();
                          goToPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    size="default"
                    aria-label="Следующая страница"
                    className={`gap-1 px-2.5 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage < totalPages) goToPage(currentPage + 1);
                    }}
                  >
                    <span className="hidden sm:inline">Вперёд</span>
                    <ChevronRight className="size-4" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
