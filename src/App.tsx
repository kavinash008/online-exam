import React, { useState } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AiChatDrawer } from './components/AiChatDrawer';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ExamRoom } from './pages/ExamRoom';
import { ExamResult } from './pages/ExamResult';
import { LiveProctoring } from './pages/LiveProctoring';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { CertificateView } from './components/CertificateView';
import { Exam, ExamAttempt, Certificate, UserRole } from './types';
import {
  ArrowLeft,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  Award,
  Sparkles,
  Menu,
  User,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function MainApp() {
  const { user, isAuthenticated, setIsAuthenticated, logout } = useExam();

  // Navigation and Modal State
  const [showPublicLanding, setShowPublicLanding] = useState(false);
  const [selectedAuthRole, setSelectedAuthRole] = useState<UserRole>('student');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentNav, setCurrentNav] = useState('dashboard');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [activeResult, setActiveResult] = useState<ExamAttempt | null>(null);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [liveProctoringExamId, setLiveProctoringExamId] = useState<string | null>(null);

  // 1. Unauthenticated Gateway
  if (!isAuthenticated) {
    if (showPublicLanding) {
      return (
        <LandingPage
          onEnterApp={() => setShowPublicLanding(false)}
          onOpenAuth={(role) => {
            setSelectedAuthRole(role || 'student');
            setShowPublicLanding(false);
          }}
        />
      );
    }
    return (
      <LoginPage
        initialRole={selectedAuthRole}
        onSuccessLogin={() => setIsAuthenticated(true)}
        onExplorePublicPortal={() => setShowPublicLanding(true)}
      />
    );
  }

  // 2. Active Examination Room (Proctored fullscreen environment)
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

  // 3. Exam Result View
  if (activeResult) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <Header
          onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
          isAiChatOpen={isAiChatOpen}
          onGoToLanding={() => setShowPublicLanding(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <main className="flex-1 pb-16 md:pb-0">
          <ExamResult
            attempt={activeResult}
            onBack={() => setActiveResult(null)}
          />
        </main>
        <AiChatDrawer isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      </div>
    );
  }

  // 4. Standalone Certificate View
  if (activeCert) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <Header
          onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
          isAiChatOpen={isAiChatOpen}
          onGoToLanding={() => setShowPublicLanding(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <main className="flex-1 py-8 pb-20 md:pb-8">
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

  // Handle Navigation
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

  // Determine second and third tab targets for mobile navigation based on role
  const getMobileNavTarget2 = () => {
    if (user.role === 'student') return 'upcoming-exams';
    if (user.role === 'faculty') return 'faculty-exams';
    return 'governance';
  };

  const getMobileNavLabel2 = () => {
    if (user.role === 'student') return 'Exams';
    if (user.role === 'faculty') return 'Manage Exams';
    return 'Audits';
  };

  const getMobileNavTarget3 = () => {
    if (user.role === 'student') return 'student-results';
    if (user.role === 'faculty') return 'proctoring';
    return 'users';
  };

  const getMobileNavLabel3 = () => {
    if (user.role === 'student') return 'Results';
    if (user.role === 'faculty') return 'Live Proctor';
    return 'Users';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Desktop & Tablet Sidebar (Collapsible Rail) + Mobile Drawer */}
      <Sidebar
        currentView={currentNav}
        onNavigate={handleNavigate}
        onOpenAiTutor={() => setIsAiChatOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onGoToLanding={() => setShowPublicLanding(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header
          onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
          isAiChatOpen={isAiChatOpen}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onGoToLanding={() => setShowPublicLanding(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Content Area with responsive bottom padding for mobile bar */}
        <main className="flex-1 pb-20 md:pb-6">
          {renderContent()}
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-5 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden mb-14 md:mb-0">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">KVELL</span>
              <span>&bull;</span>
              <span>Karpaga Vinayaga Deemed to be University Examination Protocol</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Zero-Trust Academic Governance</span>
              <span>&bull;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Page Visibility &amp; Fullscreen Guard Active
              </span>
            </div>
          </div>
        </footer>

        {/* Mobile Sticky Bottom Navigation Bar (Optimized for 1-hand Phone usage: 360px - 767px) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800/80 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all ${
              currentNav === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate(getMobileNavTarget2())}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all ${
              currentNav === getMobileNavTarget2()
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>{getMobileNavLabel2()}</span>
          </button>

          <button
            onClick={() => handleNavigate(getMobileNavTarget3())}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all ${
              currentNav === getMobileNavTarget3()
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 mb-0.5" />
            <span>{getMobileNavLabel3()}</span>
          </button>

          <button
            onClick={() => setIsAiChatOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:brightness-110"
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-amber-500 animate-pulse" />
            <span>AI Mentor</span>
          </button>

          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {/* Gemini AI Multi-turn Chatbot Drawer */}
      <AiChatDrawer isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />

      {/* Account / Institutional Auth Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={user.role}
      />
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
