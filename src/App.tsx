import React, { useState } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AiChatDrawer } from './components/AiChatDrawer';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ExamRoom } from './pages/ExamRoom';
import { ExamResult } from './pages/ExamResult';
import { LiveProctoring } from './pages/LiveProctoring';
import { CertificateView } from './components/CertificateView';
import { Exam, ExamAttempt, Certificate } from './types';
import { ArrowLeft, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function MainApp() {
  const { user } = useExam();
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentNav, setCurrentNav] = useState('dashboard');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [activeResult, setActiveResult] = useState<ExamAttempt | null>(null);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [liveProctoringExamId, setLiveProctoringExamId] = useState<string | null>(null);

  // If in active examination room
  if (activeExam) {
    return (
      <ExamRoom
        exam={activeExam}
        onExit={() => setActiveExam(null)}
        onFinished={(finalAttempt) => {
          setActiveExam(null);
          setActiveResult(finalAttempt);
        }}
      />
    );
  }

  // If viewing exam result
  if (activeResult) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <Header onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)} isAiChatOpen={isAiChatOpen} />
        <main className="flex-1">
          <ExamResult
            attempt={activeResult}
            onBack={() => setActiveResult(null)}
          />
        </main>
        <AiChatDrawer isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      </div>
    );
  }

  // If viewing certificate directly
  if (activeCert) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <Header onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)} isAiChatOpen={isAiChatOpen} />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 mb-4">
            <button
              onClick={() => setActiveCert(null)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
          <CertificateView certificate={activeCert} />
        </main>
        <AiChatDrawer isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      </div>
    );
  }

  // Handle navigation from sidebar
  const handleNavigate = (viewId: string) => {
    setCurrentNav(viewId);
    if (viewId === 'proctoring' && user.role !== 'student') {
      setLiveProctoringExamId('exam_cs401');
    } else {
      setLiveProctoringExamId(null);
    }
  };

  // Dynamic Dashboard View Content
  const renderContent = () => {
    if (user.role === 'admin' || currentNav === 'governance') {
      return <AdminDashboard />;
    }

    if (user.role === 'faculty' || currentNav === 'questions') {
      if (liveProctoringExamId) {
        return (
          <LiveProctoring
            examId={liveProctoringExamId}
            onBack={() => setLiveProctoringExamId(null)}
          />
        );
      }
      return (
        <FacultyDashboard
          onGoToLiveProctoring={(examId) => setLiveProctoringExamId(examId)}
        />
      );
    }

    // Default: Student View
    return (
      <StudentDashboard
        onSelectExam={(exam) => setActiveExam(exam)}
        onViewResult={(attempt) => setActiveResult(attempt)}
        onViewCert={(cert) => setActiveCert(cert)}
        onOpenAiTutor={() => setIsAiChatOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Collapsible SaaS Sidebar */}
      <Sidebar
        currentView={currentNav}
        onNavigate={handleNavigate}
        onOpenAiTutor={() => setIsAiChatOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header
          onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
          isAiChatOpen={isAiChatOpen}
        />

        <main className="flex-1">
          {renderContent()}
        </main>

        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-5 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">ExamPro AI</span>
              <span>&bull;</span>
              <span>Zero-Trust Online Examination Management Protocol</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Enterprise Grade</span>
              <span>&bull;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Page Visibility & Fullscreen Guard Active
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Gemini AI Multi-turn Chatbot Drawer */}
      <AiChatDrawer isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ExamProvider>
      <MainApp />
    </ExamProvider>
  );
}
