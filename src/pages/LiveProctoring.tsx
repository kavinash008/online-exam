import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { ExamAttempt, ViolationLog, Exam } from '../types';
import {
  Eye,
  ShieldAlert,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Filter,
  Brain,
  Camera,
  Activity,
  Loader2
} from 'lucide-react';

interface LiveProctoringProps {
  examId: string;
  onBack: () => void;
}

export const LiveProctoring: React.FC<LiveProctoringProps> = ({ examId, onBack }) => {
  const { exams, attempts, violations, auditProctoring, submitAttempt } = useExam();
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [aiAuditReport, setAiAuditReport] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const exam: Exam | undefined = exams.find((e) => e.id === examId);
  const liveAttempts: ExamAttempt[] = attempts.filter((a) => a.examId === examId);

  // Selected student's violation list
  const selectedAttempt = liveAttempts.find((a) => a.id === selectedAttemptId) || liveAttempts[0];
  const studentViolations: ViolationLog[] = violations.filter(
    (v) => v.attemptId === selectedAttempt?.id
  );

  const handleRunAiProctorAudit = async (attempt: ExamAttempt) => {
    setIsAuditing(true);
    setAiAuditReport(null);
    try {
      const studentViols = violations.filter((v) => v.attemptId === attempt.id);
      const audit = await auditProctoring({
        violations: studentViols,
        examTitle: attempt.examTitle,
        studentName: attempt.studentName,
      });
      setAiAuditReport(audit);
    } catch (err) {
      console.error('Proctor audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleForceSubmit = async (attemptId: string) => {
    if (confirm('Are you sure you want to force-submit and terminate this candidate session?')) {
      await submitAttempt(attemptId, true);
    }
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">
                LIVE PROCTORING CONSOLE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {exam?.title || 'Examination Session'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 border border-slate-700">
            <Activity className="w-4 h-4 text-emerald-400" />
            Active Examinees: <span className="font-bold text-white">{liveAttempts.length}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Live Student Cards & Incident Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Student Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              Candidates in Session ({liveAttempts.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveAttempts.map((att) => {
              const isSelected = selectedAttempt?.id === att.id;
              const hasWarnings = (att.violationCount || 0) > 0;
              const isCrit = (att.violationCount || 0) >= 3;

              return (
                <div
                  key={att.id}
                  onClick={() => {
                    setSelectedAttemptId(att.id);
                    setAiAuditReport(null);
                  }}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {att.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {att.studentName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Online &bull; 42ms ping</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        att.status === 'in_progress'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {att.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Metrics bar */}
                  <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs mb-3">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Question</span>
                      <strong className="text-slate-900 dark:text-white font-bold">
                        #{(att.currentQuestionIndex || 0) + 1}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Timer</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                        {formatSeconds(att.remainingSeconds || 1800)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Warnings</span>
                      <strong
                        className={`font-bold ${
                          isCrit
                            ? 'text-rose-600 animate-pulse'
                            : hasWarnings
                            ? 'text-amber-500'
                            : 'text-emerald-600'
                        }`}
                      >
                        {att.violationCount || 0} / 4
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunAiProctorAudit(att);
                      }}
                      className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      AI Audit
                    </button>

                    {att.status === 'in_progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleForceSubmit(att.id);
                        }}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                      >
                        Force Submit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Candidate Integrity Audit & Live Logs */}
        <div className="space-y-5">
          {selectedAttempt ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Integrity Audit Dossier
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Candidate: {selectedAttempt.studentName}
                  </p>
                </div>
                <button
                  onClick={() => handleRunAiProctorAudit(selectedAttempt)}
                  disabled={isAuditing}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs hover:brightness-110 disabled:opacity-50"
                >
                  {isAuditing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Brain className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  Run AI Audit
                </button>
              </div>

              {/* Gemini AI Psychometric / Integrity Verdict */}
              {aiAuditReport && (
                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Gemini Integrity Score
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100">
                      {aiAuditReport.integrityScore} / 100 ({aiAuditReport.riskLevel} Risk)
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    {aiAuditReport.summary}
                  </p>
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold pt-1">
                    Faculty Verdict: {aiAuditReport.verdict}
                  </div>
                </div>
              )}

              {/* Live Violation Stream */}
              <div>
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recorded Integrity Breaches ({studentViolations.length})
                </h5>

                {studentViolations.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Pristine Session &bull; No violations recorded
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {studentViolations.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-600 dark:text-rose-400 text-[10px]">
                            Warning #{v.warningLevel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(v.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{v.reason}</p>
                        <div className="text-[9px] text-slate-400 truncate">{v.browserInfo}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
              Select a candidate from the left panel to review live proctor stream and anti-cheat event logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
