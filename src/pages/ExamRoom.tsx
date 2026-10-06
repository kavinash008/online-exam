import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExam } from '../context/ExamContext';
import { Exam, Question, ExamAttempt } from '../types';
import { AntiCheatModal } from '../components/AntiCheatModal';
import { CodeEditor } from '../components/CodeEditor';
import { KvellLogo } from '../components/KvellLogo';
import {
  Clock,
  ShieldAlert,
  Save,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  AlertOctagon,
  HelpCircle,
  Sparkles,
  Lock,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

interface ExamRoomProps {
  exam: Exam;
  onExit: () => void;
  onFinished: (attempt: ExamAttempt) => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({ exam, onExit, onFinished }) => {
  const {
    user,
    questions,
    startAttempt,
    saveAttemptProgress,
    logViolation,
    submitAttempt,
  } = useExam();

  const [hasStarted, setHasStarted] = useState(false);
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [webcamAllowed, setWebcamAllowed] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(exam.durationMinutes * 60);
  const [activeWarning, setActiveWarning] = useState<{ level: number; reason: string } | null>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  const examQuestions: Question[] = questions[exam.id] || [];
  const currentQ = examQuestions[currentIndex];

  // Request webcam on pre-exam screen
  const requestWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
      setWebcamAllowed(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // If no physical camera exists in environment, permit proctor simulation
      setWebcamAllowed(true);
    }
  };

  // Enter Fullscreen
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // browser permissions
    }
  };

  // Begin Examination
  const handleStartExam = async () => {
    await enterFullscreen();
    const newAttempt = startAttempt(exam.id);
    setAttempt(newAttempt);
    setAnswers(newAttempt.answers || {});
    setMarkedForReview(newAttempt.markedForReview || []);
    setRemainingSeconds(newAttempt.remainingSeconds || exam.durationMinutes * 60);
    setCurrentIndex(newAttempt.currentQuestionIndex || 0);
    setHasStarted(true);
  };

  // Trigger Violation handler
  const triggerViolation = useCallback(
    async (reason: string) => {
      if (!hasStarted || autoSubmitted || !attempt) return;

      const currentCount = (attempt.violationCount || 0) + 1;
      await logViolation(attempt.id, exam.id, reason, currentCount);

      setAttempt((prev) => (prev ? { ...prev, violationCount: currentCount } : null));

      if (currentCount >= 4 && exam.strictAntiCheat) {
        setAutoSubmitted(true);
        setActiveWarning({ level: 4, reason });
        const finalized = await submitAttempt(attempt.id, true);
        onFinished(finalized);
      } else {
        setActiveWarning({ level: currentCount, reason });
      }
    },
    [hasStarted, autoSubmitted, attempt, exam.id, exam.strictAntiCheat, logViolation, submitAttempt, onFinished]
  );

  // Anti-Cheating Event Listeners
  useEffect(() => {
    if (!hasStarted || autoSubmitted) return;

    // 1. Page Visibility API (Tab Switch Detection)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab switch or browser window minimized');
      }
    };

    // 2. Fullscreen Exit Detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && exam.enableFullScreen) {
        triggerViolation('Exited fullscreen examination environment');
      }
    };

    // 3. Right Click context menu block
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation('Attempted to open context menu (Right-click)');
    };

    // 4. Copy & Paste blocks
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation('Unauthorized copy action detected');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation('Unauthorized paste action detected');
    };

    // 5. Keyboard shortcut locks
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 or Inspect shortcuts
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
      ) {
        e.preventDefault();
        triggerViolation(`Developer tools inspection attempt (${e.key})`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasStarted, autoSubmitted, exam.enableFullScreen, triggerViolation]);

  // Countdown Timer
  useEffect(() => {
    if (!hasStarted || autoSubmitted) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, autoSubmitted]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (!hasStarted || autoSubmitted || !attempt) return;

    const autoSaveInterval = setInterval(async () => {
      setIsSaving(true);
      await saveAttemptProgress(attempt.id, answers, markedForReview, currentIndex, remainingSeconds);
      setIsSaving(false);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [hasStarted, autoSubmitted, attempt, answers, markedForReview, currentIndex, remainingSeconds, saveAttemptProgress]);

  // Handle Answer selection
  const handleSelectAnswer = (qId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  // Toggle Mark for review
  const toggleMarkForReview = (qId: string) => {
    setMarkedForReview((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Final submit
  const handleFinalSubmit = async (isAuto = false) => {
    if (!attempt) return;
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    const finalized = await submitAttempt(attempt.id, isAuto);
    onFinished(finalized);
  };

  // Format seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // PRE-EXAM INSTRUCTIONS SCREEN
  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                PROCTORING LOCK & INTEGRITY GATEWAY
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {exam.title}
              </h1>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {exam.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{exam.durationMinutes} Minutes</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Questions</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{examQuestions.length} Questions</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passing Score</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{exam.passMarks} / {exam.totalMarks} Marks</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Negative Marking</span>
              <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                {exam.negativeMarking ? `-${exam.negativeMarkValue} per wrong` : 'None'}
              </span>
            </div>
          </div>

          {/* Mandatory Anti-Cheating Protocol */}
          <div className="rounded-2xl p-5 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 mb-6">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-300 mb-2">
              <ShieldAlert className="w-5 h-5" />
              Automated Integrity & Anti-Cheating System Enforced
            </div>
            <ul className="text-xs space-y-2 list-disc list-inside leading-relaxed text-amber-800 dark:text-amber-300">
              <li>Full-screen mode is strictly required throughout the assessment.</li>
              <li>Switching tabs, minimizing the browser, or losing window focus triggers an immediate violation warning.</li>
              <li>Right-click, copy, paste, text selection, and keyboard inspection shortcuts are disabled.</li>
              <li>
                <strong>4-Warning Rule:</strong> Warnings 1-3 alert you to breaches. On the 4th violation, your exam will be automatically locked and submitted.
              </li>
            </ul>
          </div>

          {/* Webcam Verification Step */}
          {exam.enableWebcam && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Webcam & Microphone Proctor Check</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Verify camera presence for candidate authentication during the session.
                  </p>
                </div>
              </div>

              {webcamAllowed ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" /> Ready & Connected
                </div>
              ) : (
                <button
                  type="button"
                  onClick={requestWebcam}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-all"
                >
                  Enable Camera
                </button>
              )}
            </div>
          )}

          {/* Honor Pledge Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 mb-6">
            <input
              type="checkbox"
              checked={pledgeChecked}
              onChange={(e) => setPledgeChecked(e.target.checked)}
              className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              I affirm on my personal honor that I will complete this examination independently without assistance,
              external materials, unauthorized browsing, or AI tools. I agree to automated proctoring monitoring.
            </span>
          </label>

          {/* Start Actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onExit}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel & Return
            </button>
            <button
              onClick={handleStartExam}
              disabled={!pledgeChecked}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:brightness-110 shadow-lg shadow-indigo-500/25 disabled:opacity-40 transition-all"
            >
              <Maximize2 className="w-4 h-4" />
              Enter Fullscreen & Begin Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE EXAM ENVIRONMENT
  const isUrgent = remainingSeconds < 300; // less than 5 minutes

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col select-none">
      {/* Anti-cheat Warning Modal */}
      {activeWarning && (
        <AntiCheatModal
          isOpen={true}
          warningLevel={activeWarning.level}
          reason={activeWarning.reason}
          onAcknowledge={() => {
            if (activeWarning.level >= 4) {
              handleFinalSubmit(true);
            } else {
              setActiveWarning(null);
              enterFullscreen();
            }
          }}
          isAutoSubmitted={activeWarning.level >= 4}
        />
      )}

      {/* Top Exam Header & Proctor Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {exam.title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <span>Section: {currentQ?.section || 'General'}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Save className="w-3 h-3 text-emerald-500" />
                {isSaving ? 'Autosaving...' : `Saved at ${lastSavedTime}`}
              </span>
            </div>
          </div>
        </div>

        {/* Live Countdown Timer & Violation Counter */}
        <div className="flex items-center gap-3">
          {attempt && attempt.violationCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Warnings: {attempt.violationCount}/4</span>
            </div>
          )}

          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-colors ${
              isUrgent
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => handleFinalSubmit(false)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Active Question Workspace */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 min-h-[520px]">
          {currentQ ? (
            <div>
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                    {currentIndex + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Question {currentIndex + 1} of {examQuestions.length}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                    {currentQ.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    +{currentQ.marks} Marks
                  </span>
                  <button
                    onClick={() => toggleMarkForReview(currentQ.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                      markedForReview.includes(currentQ.id)
                        ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {markedForReview.includes(currentQ.id) ? 'Marked' : 'Mark for Review'}
                  </button>
                </div>
              </div>

              {/* Question Statement */}
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed mb-6">
                {currentQ.text}
              </h3>

              {/* Question Options or Input by Type */}
              <div className="space-y-3 mb-8">
                {/* 1. Multiple Choice */}
                {currentQ.type === 'multiple_choice' &&
                  currentQ.options?.map((opt, i) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAnswer(currentQ.id, opt)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}

                {/* 2. Multiple Select */}
                {currentQ.type === 'multiple_select' &&
                  currentQ.options?.map((opt, i) => {
                    const selectedList: string[] = Array.isArray(answers[currentQ.id])
                      ? answers[currentQ.id]
                      : [];
                    const isSelected = selectedList.includes(opt);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? selectedList.filter((item) => item !== opt)
                            : [...selectedList, opt];
                          handleSelectAnswer(currentQ.id, updated);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs border ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 text-slate-500'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}

                {/* 3. True or False */}
                {currentQ.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-4">
                    {['True', 'False'].map((tf) => {
                      const isSelected = answers[currentQ.id] === tf;
                      return (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQ.id, tf)}
                          className={`py-4 rounded-2xl border text-sm font-bold text-center transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                              : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          {tf}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 4. Fill in the Blank */}
                {currentQ.type === 'fill_blank' && (
                  <div className="pt-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Your Answer:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                      placeholder="Type your exact response here..."
                      className="w-full max-w-lg p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* 5. Short Answer & Essay */}
                {(currentQ.type === 'short_answer' || currentQ.type === 'essay') && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Detailed Explanation:
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {String(answers[currentQ.id] || '').trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      rows={currentQ.type === 'essay' ? 7 : 4}
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                      placeholder="Structure your thoughts logically. Reference relevant concepts, definitions, and applications..."
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* 6. Coding Question */}
                {currentQ.type === 'coding' && (
                  <div className="pt-2">
                    <CodeEditor
                      initialCode={answers[currentQ.id] || currentQ.starterCode || ''}
                      language={currentQ.codeLanguage || 'typescript'}
                      onChange={(val) => handleSelectAnswer(currentQ.id, val)}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">No questions found.</div>
          )}

          {/* Bottom Question Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={() => handleSelectAnswer(currentQ.id, '')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear Response
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))}
              disabled={currentIndex === examQuestions.length - 1}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition-colors shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Question Palette & Live Webcam Proctor */}
        <div className="space-y-6">
          {/* Live Proctoring Webcam View */}
          {exam.enableWebcam && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Live Proctor Stream
                </span>
                <span className="text-[9px] text-emerald-500 font-bold">SECURE</span>
              </div>
              <div className="relative rounded-2xl bg-slate-950 aspect-video overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded-sm">
                  {user.displayName}
                </div>
              </div>
            </div>
          )}

          {/* Question Palette Grid */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
              Question Navigator
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-purple-500 inline-block" />
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-indigo-600 inline-block" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700 inline-block" />
                <span>Not Visited</span>
              </div>
            </div>

            {/* Palette Buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
              {examQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered =
                  answers[q.id] !== undefined &&
                  answers[q.id] !== '' &&
                  (!Array.isArray(answers[q.id]) || answers[q.id].length > 0);
                const isMarked = markedForReview.includes(q.id);

                let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                if (isCurrent) {
                  bgClass = 'bg-indigo-600 text-white ring-2 ring-indigo-400';
                } else if (isMarked) {
                  bgClass = 'bg-purple-600 text-white';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-600 text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
