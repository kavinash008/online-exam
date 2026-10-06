import React from 'react';
import { KvellLogo } from '../components/KvellLogo';
import {
  ShieldCheck,
  Award,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  BarChart3,
  Clock,
  ArrowRight,
  BookOpen,
  Eye,
  GraduationCap,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: (role?: 'student' | 'faculty' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      {/* Institutional Top Notification Bar */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-2 px-4 border-b border-slate-800 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Karpaga Vinayaga Deemed to be University
        </span>
        <span className="text-slate-500 hidden sm:inline">•</span>
        <span className="text-slate-300 hidden sm:inline">
          KVELL Institutional Examination Gateway — Academic Year 2026–2027
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KvellLogo variant="horizontal" size="md" showSubtitle={true} />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How KVELL Works
            </a>
            <a href="#roles" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              For Roles
            </a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Security
            </a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth()}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Access Examination Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Official University Seal Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-xs"
          >
            <KvellLogo variant="mark" size="xs" />
            <span>KVELL • Educational Lore For Learning</span>
          </motion.div>

          {/* Master Headline Required by Brief */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight"
          >
            Smarter Examinations. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 dark:from-indigo-400 dark:via-sky-400 dark:to-teal-300">
              Better Assessment.
            </span>
          </motion.h1>

          {/* Master Subtitle Required by Brief */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            KVELL provides a secure, scalable and data-driven platform for modern online examinations.
            Engineered for university standards with zero-trust browser monitoring, automated grading,
            and psychometric analytics.
          </motion.p>

          {/* Actions & Role Launchers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => onOpenAuth('student')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal Login</span>
            </button>
            <button
              onClick={() => onOpenAuth('faculty')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/80 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>Faculty Examiner Workspace</span>
            </button>
            <button
              onClick={() => onOpenAuth('admin')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>University Administrator</span>
            </button>
          </motion.div>

          {/* Feature Highlights Pills */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Trust Proctor</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fullscreen lock, tab switch audit &amp; clipboard protection.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Resilient Timer</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Server-synchronized countdown survives page reloads.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Evaluation</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instant objective scoring with negative marking support.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Credentials</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cryptographically signed certificates with verification codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Architecture &amp; Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-2">
              Engineered for High-Stakes Assessments
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              KVELL combines academic rigor with cloud persistence to support thousands of concurrent
              students without synchronization failures or data loss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Multi-Format Question Bank
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Comprehensive question authoring across 7 academic formats: Single-Choice MCQ, Multiple-Select,
                  True/False, Fill-in-the-Blank, Short Answer, Essay, and Coding Challenges with in-browser syntax runners.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Bloom's Taxonomy Difficulty Tagging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>CSV Bulk Question Import &amp; Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Configurable Negative Marking</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Live Examination Engine
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  State-of-the-art test delivery room with question randomization per student, 5-state palette navigation,
                  debounced instant auto-save, and connection loss resilience.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Uninterrupted Timer on Reload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>5-min &amp; 1-min Auto Warnings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Single-Click Mark For Review</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Real Performance Analytics
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Calculated from actual database records. Provides faculty with question discrimination indices, topic
                  mastery graphs, and student weak area diagnostics without mock estimates.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Subject &amp; Topic Breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Grade Distributions &amp; Pass %</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>CSV Grade Roster Export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How KVELL Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Operational Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-2">
              How KVELL Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              A streamlined, three-phase academic lifecycle from test formulation to authenticated credentialing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                1. Author &amp; Schedule
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Faculty selects questions from the centralized bank, sets time limits, passing scores, and security
                policies. The assessment is scheduled and published to authorized student rosters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                2. Secure Examination Delivery
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Candidate enters proctored fullscreen mode. Questions and options are randomized. Every answer selection
                is auto-saved, while browser visibility changes are logged to the audit log.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                3. Instant Evaluation &amp; Results
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upon submission or timer expiry, the database engine calculates raw marks, negative mark deductions,
                and accuracy. Students review comprehensive answer keys while verifiable credentials are generated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Role-Based Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-2">
              Dedicated Workspaces for Every Stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">For Students</h3>
                  <span className="text-[11px] text-slate-500">Autonomous Candidate Experience</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Resume active tests with zero data loss</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Clear timer warnings and question palette status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Detailed question-by-question review &amp; solutions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Verifiable certificates with anti-tamper QR seal</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('student')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Log In As Student
              </button>
            </div>

            {/* Faculty */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">For Faculty &amp; Examiners</h3>
                  <span className="text-[11px] text-slate-500">Authoring &amp; Proctoring</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Centralized Question Bank with CSV Bulk Import</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Real-time proctoring monitor with violation feeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Instant grade rosters &amp; CSV export for registry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Gemini AI Question Generator &amp; Rubric Scoring</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('faculty')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Log In As Faculty
              </button>
            </div>

            {/* Administrator */}
            <div className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">For Administrators</h3>
                  <span className="text-[11px] text-slate-500">Institutional Governance</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>University-wide candidate &amp; faculty directories</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>Live institutional audit trail of all transactions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>System-level backup snapshots in JSON format</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>Real database metrics with zero hardcoded values</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('admin')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white transition-colors"
              >
                Log In As Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 lg:py-28 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4" />
                <span>Zero-Trust Integrity Architecture</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                Anti-Cheating Monitoring &amp; Security Protocol
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                KVELL does not claim deceptive "foolproof" protection, but implements multi-layered browser-level
                telemetry, progressive warning locks, and timestamped forensic audit trails to ensure high-stakes
                credential validity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-amber-300 mb-1">1. Page Visibility API Monitoring</h4>
                  <p className="text-slate-400 text-[11px]">
                    Detects minimizing the browser, alt-tabbing, opening new tabs, or window blur events in real-time.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-amber-300 mb-1">2. Mandatory Fullscreen Enforcement</h4>
                  <p className="text-slate-400 text-[11px]">
                    Candidates must remain in full-screen mode throughout. Exiting fullscreen halts timer and locks screen.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-amber-300 mb-1">3. Clipboard &amp; Context Interception</h4>
                  <p className="text-slate-400 text-[11px]">
                    Disables copy, paste, select-all, and right-click context menus during active examination sessions.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-amber-300 mb-1">4. 4-Stage Progressive Lockout</h4>
                  <p className="text-slate-400 text-[11px]">
                    Violations progress through Warning 1, 2, Final Notice, and Automatic Disqualification at Stage 4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mt-2">
              Questions &amp; Technical Policies
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                What happens if my browser crashes or connection disconnects during a test?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                KVELL automatically auto-saves every answer you select immediately to both localStorage and the Firestore
                database. When you refresh or reopen your browser, you resume the exact same attempt with all previous
                answers intact and the remaining timer strictly preserved.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                How does negative marking work in KVELL?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                If enabled by the faculty for an exam (e.g. -0.5 marks per wrong answer), incorrect responses deduct from
                your earned points. Unanswered questions do not incur penalties. Total score calculation is performed
                transparently and displayed on your result breakdown.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                Can students modify answers after submitting the examination?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                No. Once submitted, the attempt is locked at the database level. Any subsequent attempts to push modified
                answers are rejected by the backend security layer.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                How are certificates verified?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Every passed examination generates a cryptographic verification code linked to the student’s identity,
                score, and timestamp in the university database. Employers and faculty can verify credentials directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <KvellLogo variant="horizontal" size="lg" showSubtitle={true} className="text-white" />
              <p className="mt-3 text-xs text-slate-400 max-w-sm">
                Official Online Examination &amp; Assessment Platform for Karpaga Vinayaga Deemed to be University.
                Empowering medical, dental, pharmacy, nursing, and engineering faculties.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onEnterApp}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
              >
                Launch Examination Gateway
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; 2026 KVELL — Karpaga Vinayaga Deemed to be University. All Rights Reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-300 transition-colors">Academic Integrity Policy</span>
              <span className="hover:text-slate-300 transition-colors">Proctoring Terms</span>
              <span className="hover:text-slate-300 transition-colors">Security Standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
