import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { Exam, ExamAttempt, Certificate } from '../types';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Play,
  Search,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentDashboardProps {
  onSelectExam: (exam: Exam) => void;
  onViewResult: (attempt: ExamAttempt) => void;
  onViewCert: (cert: Certificate) => void;
  onOpenAiTutor: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectExam,
  onViewResult,
  onViewCert,
  onOpenAiTutor,
}) => {
  const { user, exams, attempts, certificates, searchQuery } = useExam();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const myAttempts = attempts.filter((a) => a.studentId === user.id);
  const activeAttempt = myAttempts.find((a) => a.status === 'in_progress');
  const myCompletedAttempts = myAttempts.filter((a) => a.status === 'submitted' || a.status === 'auto_submitted');
  const myCerts = certificates.filter((c) => c.studentId === user.id);

  // Filter exams by category and global search query
  const filteredExams = exams.filter((ex) => {
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || ex.subject.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Subjects' },
    { id: 'computer', label: 'Computer Science' },
    { id: 'cyber', label: 'Cybersecurity' },
    { id: 'artificial', label: 'Artificial Intelligence' },
  ];

  const avgScore =
    myCompletedAttempts.length > 0
      ? Math.round(
          myCompletedAttempts.reduce((acc, curr) => acc + curr.percentage, 0) /
            myCompletedAttempts.length
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Active Exam Resume Banner */}
      {activeAttempt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/30">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                ACTIVE EXAMINATION IN PROGRESS
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeAttempt.examTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Session was preserved. You can resume with full anti-cheat compliance.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const ex = exams.find((e) => e.id === activeAttempt.examId);
              if (ex) onSelectExam(ex);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Resume Exam Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Hero Welcome & Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Student Portal</span>
            <span aria-hidden="true">&bull;</span>
            <span>{user.department || 'School of Computing'}</span>
            <span aria-hidden="true">&bull;</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Candidate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Academic Performance & Assessments
          </h1>
        </div>

        <button
          onClick={onOpenAiTutor}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Ask AI Study Mentor</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Available Assessments
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {exams.length}
          </div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            Across active terms
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Completed Exams
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {myCompletedAttempts.length}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Proctored
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Average Score
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {avgScore}%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Grade A Standard
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Certificates Issued
          </span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {myCerts.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            QR Validated
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredExams.length} assessments
        </span>
      </div>

      {/* Exams Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredExams.map((exam) => {
            const existingAttempt = myAttempts.find((a) => a.examId === exam.id);
            const isCompleted =
              existingAttempt?.status === 'submitted' || existingAttempt?.status === 'auto_submitted';
            const inProgress = existingAttempt?.status === 'in_progress';

            return (
              <motion.div
                key={exam.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {exam.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.durationMinutes}m
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {exam.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span>{exam.totalMarks} Marks</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>Pass: {exam.passMarks}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Anti-Cheat On
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  {isCompleted ? (
                    <button
                      onClick={() => onViewResult(existingAttempt!)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      View Score &bull; {existingAttempt?.percentage}%
                    </button>
                  ) : inProgress ? (
                    <button
                      onClick={() => onSelectExam(exam)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Resume Session
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectExam(exam)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      Start Assessment &rarr;
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Earned Certificates Section */}
      {myCerts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Verified Institutional Credentials
            </h2>
            <p className="text-xs text-slate-500">
              Downloadable certificates equipped with verification hashes and honors classification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() => onViewCert(cert)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono text-[11px]">{cert.id}</span>
                  <span className="text-amber-600 font-bold">Grade {cert.grade}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cert.examTitle}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span>Score: {cert.score}/{cert.totalMarks} ({cert.percentage}%)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">View PDF &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
