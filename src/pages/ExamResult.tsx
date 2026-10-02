import React, { useState } from 'react';
import { ExamAttempt, Exam, Question, Certificate } from '../types';
import { useExam } from '../context/ExamContext';
import { CertificateView } from '../components/CertificateView';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  BookOpen,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Brain
} from 'lucide-react';

interface ExamResultProps {
  attempt: ExamAttempt;
  onBack: () => void;
}

export const ExamResult: React.FC<ExamResultProps> = ({ attempt, onBack }) => {
  const { exams, questions, certificates, evaluateEssay } = useExam();
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [aiEvaluations, setAiEvaluations] = useState<Record<string, any>>({});
  const [evaluatingQId, setEvaluatingQId] = useState<string | null>(null);

  const exam: Exam | undefined = exams.find((e) => e.id === attempt.examId);
  const examQuestions: Question[] = questions[attempt.examId] || [];
  const cert = certificates.find((c) => c.attemptId === attempt.id);

  // Analyze Weak & Strong topics
  const topicsAnalysis = Object.entries(attempt.subjectBreakdown || {}).map(([topic, data]) => {
    const pct = data.total > 0 ? (data.scored / data.total) * 100 : 0;
    return {
      topic,
      total: data.total,
      scored: data.scored,
      percentage: Math.round(pct),
      isStrong: pct >= 75,
    };
  });

  const handleAiGradeEssay = async (q: Question) => {
    setEvaluatingQId(q.id);
    try {
      const studentAns = String(attempt.answers[q.id] || '');
      const result = await evaluateEssay({
        question: q.text,
        studentAnswer: studentAns,
        modelAnswer: q.correctAnswer,
        maxMarks: q.marks,
      });
      setAiEvaluations((prev) => ({ ...prev, [q.id]: result }));
    } catch (err) {
      console.error('AI evaluation error:', err);
    } finally {
      setEvaluatingQId(null);
    }
  };

  if (showCertificate && cert) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => setShowCertificate(false)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 mb-6 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Performance Breakdown
        </button>
        <CertificateView certificate={cert} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  attempt.passed
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                }`}
              >
                {attempt.passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Completed on {new Date(attempt.submittedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {attempt.examTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Candidate: {attempt.studentName} ({attempt.studentEmail})
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              Dashboard
            </button>
            {cert && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
              >
                <Award className="w-4 h-4" />
                View Certificate
              </button>
            )}
          </div>
        </div>

        {/* Score & Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
              Total Score
            </span>
            <div className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
              {attempt.score} <span className="text-xs text-slate-400 font-medium">/ {attempt.totalMarks}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Percentage
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {attempt.percentage}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Correct
            </span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {attempt.correctCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
              Incorrect
            </span>
            <div className="text-2xl font-black text-rose-700 dark:text-rose-300">
              {attempt.wrongCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Violations
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {attempt.violationCount}
            </div>
          </div>
        </div>
      </div>

      {/* Subject & Topic Mastery Analysis */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          Topic Mastery & Skill Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topicsAnalysis.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 truncate">{item.topic}</span>
                {item.isStrong ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" /> Strong
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <TrendingDown className="w-3.5 h-3.5" /> Review
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.isStrong ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>{item.scored} / {item.total} pts</span>
                <span>{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Question Review */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Detailed Question Review
          </h3>
          <span className="text-xs text-slate-400">
            {examQuestions.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {examQuestions.map((q, idx) => {
            const givenAnswer = attempt.answers[q.id];
            const isAnswered = givenAnswer !== undefined && givenAnswer !== '';
            const isCorrect =
              isAnswered &&
              String(givenAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
            const isExpanded = expandedQuestion === q.id;
            const aiEval = aiEvaluations[q.id];

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 sm:p-5 transition-all"
              >
                {/* Question item row */}
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : isAnswered
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {q.text}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 capitalize">
                        <span>{q.section}</span>
                        <span>&bull;</span>
                        <span>{q.type.replace('_', ' ')}</span>
                        <span>&bull;</span>
                        <span>{q.marks} Marks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : isAnswered
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isCorrect ? `+${q.marks}` : isAnswered ? '0' : 'Skipped'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Answer Analysis & Model solution */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/80 text-xs space-y-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Your Submitted Response:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono text-[11px]">
                        {givenAnswer !== undefined && givenAnswer !== ''
                          ? Array.isArray(givenAnswer)
                            ? givenAnswer.join(', ')
                            : String(givenAnswer)
                          : '(No response provided)'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                        Model Solution / Correct Answer:
                      </span>
                      <p className="text-emerald-900 dark:text-emerald-200 whitespace-pre-wrap font-mono text-[11px]">
                        {q.correctAnswer}
                      </p>
                    </div>

                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Conceptual Explanation:
                        </span>
                        <p className="text-indigo-950 dark:text-indigo-200 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                    {/* AI Essay / Short answer Evaluator trigger */}
                    {(q.type === 'essay' || q.type === 'short_answer') && (
                      <div className="pt-2">
                        {aiEval ? (
                          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
                            <div className="flex items-center justify-between font-bold text-purple-700 dark:text-purple-300">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                Gemini AI Essay Rubric Grading
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px]">
                                Awarded: {aiEval.awardedMarks} / {q.marks} Marks
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {aiEval.feedback}
                            </p>
                            {aiEval.matchedKeyConcepts && (
                              <div className="text-[10px] text-slate-500">
                                <strong className="text-emerald-600 dark:text-emerald-400">Concepts Covered:</strong>{' '}
                                {aiEval.matchedKeyConcepts.join(', ')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAiGradeEssay(q)}
                            disabled={evaluatingQId === q.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                          >
                            <Brain className="w-3.5 h-3.5" />
                            {evaluatingQId === q.id ? 'Evaluating with Gemini...' : 'Request AI Rubric Evaluation'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
