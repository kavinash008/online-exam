import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { Exam, Question, QuestionType } from '../types';
import {
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Download,
  Users,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Code2,
  Loader2,
  Check,
  X,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FacultyDashboardProps {
  onGoToLiveProctoring: (examId: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onGoToLiveProctoring }) => {
  const {
    exams,
    questions,
    attempts,
    createExam,
    deleteExam,
    addQuestion,
    deleteQuestion,
    generateAiQuestions,
    isAiLoading,
    user,
    searchQuery,
  } = useExam();

  const [activeTab, setActiveTab] = useState<'exams' | 'question_bank' | 'results'>('exams');
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // New Exam Form State
  const [examForm, setExamForm] = useState({
    title: '',
    subject: 'Computer Science',
    department: user.department || 'Computer Science',
    durationMinutes: 45,
    passMarks: 40,
    totalMarks: 75,
    description: '',
    enableWebcam: true,
    enableFullScreen: true,
    strictAntiCheat: true,
    negativeMarking: false,
    negativeMarkValue: 0.5,
    sections: 'Core, Advanced',
  });

  // New Question Form State
  const [questionForm, setQuestionForm] = useState<{
    section: string;
    type: QuestionType;
    text: string;
    options: string;
    correctAnswer: string;
    explanation: string;
    marks: number;
    difficulty: 'easy' | 'medium' | 'hard';
    starterCode: string;
  }>({
    section: 'General',
    type: 'multiple_choice',
    text: '',
    options: 'Option A\nOption B\nOption C\nOption D',
    correctAnswer: 'Option A',
    explanation: '',
    marks: 5,
    difficulty: 'medium',
    starterCode: '',
  });

  // AI Generator Form State
  const [aiForm, setAiForm] = useState({
    topic: 'Distributed Database Concurrency and Raft Consensus',
    count: 3,
    difficulty: 'medium',
    types: ['multiple_choice', 'true_false'],
  });
  const [aiPreviewQuestions, setAiPreviewQuestions] = useState<Question[]>([]);

  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const currentQuestions = questions[selectedExamId] || [];

  // Filtered exams by global search query
  const filteredExams = exams.filter(
    (ex) =>
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = await createExam({
      ...examForm,
      sections: examForm.sections.split(',').map((s) => s.trim()),
    });
    setSelectedExamId(newId);
    setIsExamModalOpen(false);
  };

  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;

    const opts =
      questionForm.type === 'multiple_choice' || questionForm.type === 'multiple_select'
        ? questionForm.options.split('\n').map((s) => s.trim()).filter(Boolean)
        : questionForm.type === 'true_false'
        ? ['True', 'False']
        : [];

    await addQuestion(selectedExamId, {
      section: questionForm.section,
      type: questionForm.type,
      text: questionForm.text,
      options: opts,
      correctAnswer: questionForm.correctAnswer,
      explanation: questionForm.explanation,
      marks: Number(questionForm.marks),
      difficulty: questionForm.difficulty,
      starterCode: questionForm.starterCode,
    });

    setIsQuestionModalOpen(false);
  };

  const handleRunAiQuestionGen = async () => {
    if (!currentExam) return;
    try {
      const generated = await generateAiQuestions({
        topic: aiForm.topic,
        subject: currentExam.subject,
        count: aiForm.count,
        difficulty: aiForm.difficulty,
        types: aiForm.types,
      });
      setAiPreviewQuestions(generated);
    } catch {
      alert('AI Generation encountered an error. Please try again.');
    }
  };

  const handleAddAiQuestionsToExam = async () => {
    if (!selectedExamId) return;
    for (const q of aiPreviewQuestions) {
      await addQuestion(selectedExamId, q);
    }
    setAiPreviewQuestions([]);
    setIsAiModalOpen(false);
  };

  // Export submissions to CSV
  const handleExportSubmissions = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Candidate,Email,Exam,Score,Total,Percentage,Violations,Status']
        .concat(
          attempts.map(
            (a) =>
              `"${a.studentName}","${a.studentEmail}","${a.examTitle}",${a.score},${a.totalMarks},${a.percentage}%,${a.violationCount},"${a.status}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `exampro_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Faculty Command</span>
            <span aria-hidden="true">&bull;</span>
            <span>{user.department || 'Computer Science & Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Exam & Assessment Management
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Exam
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 w-fit">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'exams'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Examinations ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab('question_bank')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'question_bank'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Question Bank & AI
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'results'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Submissions ({attempts.length})
        </button>
      </div>

      {/* TAB 1: EXAMINATIONS */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((ex) => {
            const exAttempts = attempts.filter((a) => a.examId === ex.id);
            const liveCount = exAttempts.filter((a) => a.status === 'in_progress').length;

            return (
              <div
                key={ex.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{ex.subject}</span>
                    <div className="flex items-center gap-2">
                      {liveCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          {liveCount} Live
                        </span>
                      )}
                      <span>{ex.durationMinutes}m</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {ex.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <div>Questions: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{(questions[ex.id] || []).length}</strong></div>
                    <div>Pass Mark: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{ex.passMarks}/{ex.totalMarks}</strong></div>
                    <div>Attempts: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{exAttempts.length}</strong></div>
                    <div>Anti-Cheat: <strong className="text-emerald-600 dark:text-emerald-400">Enforced</strong></div>
                  </div>
                </div>

                <div className="mt-6 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onGoToLiveProctoring(ex.id)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Proctoring Monitor
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExamId(ex.id);
                      setActiveTab('question_bank');
                    }}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    Questions
                  </button>
                  <button
                    onClick={() => deleteExam(ex.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: QUESTION BANK */}
      {activeTab === 'question_bank' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Exam:</span>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Gemini Question Generator
              </button>
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-white">#{idx + 1}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span className="capitalize">{q.type.replace('_', ' ')}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>{q.marks} Marks</span>
                    <span aria-hidden="true">&bull;</span>
                    <span className="capitalize">{q.difficulty}</span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.text}
                  </p>

                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                    Answer: {q.correctAnswer}
                  </div>
                </div>

                <button
                  onClick={() => deleteQuestion(selectedExamId, q.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESULTS & SUBMISSIONS */}
      {activeTab === 'results' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Exam Submissions & Violation Counter
            </h3>
            <button
              onClick={handleExportSubmissions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Exam</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Warnings</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{att.studentName}</div>
                      <div className="text-slate-400 text-[11px]">{att.studentEmail}</div>
                    </td>
                    <td className="py-3 px-4">{att.examTitle}</td>
                    <td className="py-3 px-4 font-bold tabular-nums text-slate-900 dark:text-white">
                      {att.score}/{att.totalMarks}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-indigo-600 dark:text-indigo-400 font-medium">
                      {att.percentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={att.violationCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                        {att.violationCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize">{att.status.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE EXAM MODAL */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create Assessment
              </h3>
              <button onClick={() => setIsExamModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Exam Title</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. Distributed Systems Midterm"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    required
                    value={examForm.subject}
                    onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={examForm.durationMinutes}
                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Pass Marks</label>
                  <input
                    type="number"
                    required
                    value={examForm.passMarks}
                    onChange={(e) => setExamForm({ ...examForm, passMarks: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={examForm.totalMarks}
                    onChange={(e) => setExamForm({ ...examForm, totalMarks: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Instructions</label>
                <textarea
                  rows={3}
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  placeholder="Rules, syllabus coverage, and requirements..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GEMINI AI QUESTION GENERATOR MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Gemini Question Generator
              </h3>
              <button onClick={() => setIsAiModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Topic / Objective</label>
                <input
                  type="text"
                  value={aiForm.topic}
                  onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Number of Questions</label>
                  <select
                    value={aiForm.count}
                    onChange={(e) => setAiForm({ ...aiForm, count: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    <option value={2}>2 Questions</option>
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Difficulty</label>
                  <select
                    value={aiForm.difficulty}
                    onChange={(e) => setAiForm({ ...aiForm, difficulty: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleRunAiQuestionGen}
                disabled={isAiLoading || !aiForm.topic}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Questions
                  </>
                )}
              </button>

              {aiPreviewQuestions.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="font-bold block text-slate-900 dark:text-white">
                    Generated Preview ({aiPreviewQuestions.length})
                  </span>
                  {aiPreviewQuestions.map((pq, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="font-semibold">{i + 1}. {pq.text}</div>
                      <div className="text-emerald-600 text-[11px] mt-1">Answer: {pq.correctAnswer}</div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleAddAiQuestionsToExam}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Add All to Exam
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Question
              </h3>
              <button onClick={() => setIsQuestionModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Type</label>
                  <select
                    value={questionForm.type}
                    onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value as QuestionType })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 capitalize"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="multiple_select">Multiple Select</option>
                    <option value="true_false">True or False</option>
                    <option value="fill_blank">Fill in Blank</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="essay">Essay</option>
                    <option value="coding">Programming Code</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Marks</label>
                  <input
                    type="number"
                    required
                    value={questionForm.marks}
                    onChange={(e) => setQuestionForm({ ...questionForm, marks: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Question Prompt</label>
                <textarea
                  rows={3}
                  required
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              {(questionForm.type === 'multiple_choice' || questionForm.type === 'multiple_select') && (
                <div>
                  <label className="font-semibold block mb-1">Options (One per line)</label>
                  <textarea
                    rows={4}
                    value={questionForm.options}
                    onChange={(e) => setQuestionForm({ ...questionForm, options: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">Correct Answer</label>
                <input
                  type="text"
                  required
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
