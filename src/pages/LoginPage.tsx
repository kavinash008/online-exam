import React, { useState } from 'react';
import { KvellLogo } from '../components/KvellLogo';
import { UserRole } from '../types';
import { useExam } from '../context/ExamContext';
import {
  Lock,
  Mail,
  User,
  Building2,
  Hash,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onSuccessLogin?: () => void;
  onExplorePublicPortal?: () => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessLogin,
  onExplorePublicPortal,
  initialRole = 'student',
}) => {
  const { registerUser, loginWithCredentials, switchRole, usersList } = useExam();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [regNumber, setRegNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const departmentsList = [
    'Computer Science & Engineering',
    'Information Technology & Networks',
    'Medicine (MBBS)',
    'Dentistry (BDS)',
    'Pharmacy (B.Pharm)',
    'Nursing & Allied Health',
    'Artificial Intelligence & Data Science',
    'Institutional Governance',
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        if (!displayName.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all required registration fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }

        const autoReg = regNumber.trim()
          ? regNumber.trim()
          : `KV2026/${department.substring(0, 3).toUpperCase()}/${Math.floor(1000 + Math.random() * 9000)}`;

        await registerUser({
          displayName: displayName.trim(),
          email: email.trim(),
          role: selectedRole,
          department,
          registrationNumber: autoReg,
        });

        setSuccessMsg('Account registered successfully! Redirecting to your workspace...');
        setTimeout(() => {
          if (onSuccessLogin) onSuccessLogin();
        }, 500);
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both your institutional email and password.');
        }

        await loginWithCredentials(email.trim(), password, selectedRole);
        setSuccessMsg('Authentication verified. Accessing examination portal...');
        setTimeout(() => {
          if (onSuccessLogin) onSuccessLogin();
        }, 400);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantDemoLogin = (role: UserRole) => {
    setErrorMsg('');
    switchRole(role);
    if (onSuccessLogin) onSuccessLogin();
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSuccess(true);
    setTimeout(() => {
      setForgotPasswordModal(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-600 selection:text-white">
      {/* Top Institutional Notification Banner */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-2 px-4 border-b border-slate-800 text-center flex items-center justify-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Karpaga Vinayaga Deemed to be University
        </span>
        <span className="text-slate-500 hidden sm:inline">&bull;</span>
        <span className="text-slate-300 hidden md:inline">
          KVELL Institutional Examination Gateway &bull; Academic Year 2026–2027
        </span>
        {onExplorePublicPortal && (
          <button
            onClick={onExplorePublicPortal}
            className="text-indigo-300 hover:text-white underline text-[11px] font-semibold ml-2 inline-flex items-center gap-1"
          >
            <span>Public Guidelines</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero & Institutional Overview Column (Visible on large & tablet) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Background Decorative Rings */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-6">
                <KvellLogo variant="full" size="md" showSubtitle={true} className="items-start text-left" />
              </div>

              <div className="space-y-4 my-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-semibold text-indigo-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero-Trust Academic Security</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-snug">
                  Welcome to the Official Examination Gateway
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  KVELL provides authenticated access for candidates, faculty examiners, and university
                  leadership with live browser monitoring, instant grading, and verified credentials.
                </p>
              </div>

              {/* Institutional Protocol Badges */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Real-time Anti-Cheating &amp; Tab-Switch Interception</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Server-Authoritative Countdown Timer &amp; Cloud Autosave</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Automated Evaluation &amp; Tamper-Evident Certificates</span>
                </div>
              </div>
            </div>

            {/* Bottom Support / Switch to Public Portal */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 relative z-10">
              <span>Academic IT Helpdesk: exam-help@kvell.edu</span>
              {onExplorePublicPortal && (
                <button
                  type="button"
                  onClick={onExplorePublicPortal}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Portal Overview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Authentication Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Role Selection Tabs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Select Your Role
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Switch workspace role
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      selectedRole === 'student'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                    <span>Student</span>
                    <span className="text-[9px] font-normal text-slate-400 hidden sm:inline">Examinee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('faculty')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      selectedRole === 'faculty'
                        ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-400" />
                    <span>Teacher / Faculty</span>
                    <span className="text-[9px] font-normal text-slate-400 hidden sm:inline">Examiner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      selectedRole === 'admin'
                        ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-slate-900/15 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 mb-1 text-amber-500" />
                    <span>Dean / Admin</span>
                    <span className="text-[9px] font-normal text-slate-400 hidden sm:inline">Governance</span>
                  </button>
                </div>
              </div>

              {/* Mode Toggle: Sign In vs Register */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In to {selectedRole === 'admin' ? 'Admin Gateway' : selectedRole === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all ${
                    mode === 'register'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Register Verified Account
                </button>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <span className="font-bold">Error:</span>
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Legal Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Alex Mercer"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Department / Discipline <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 appearance-none"
                          >
                            {departmentsList.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {selectedRole === 'student' ? 'Student Registration #' : 'Faculty / Staff ID'}
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            placeholder={selectedRole === 'student' ? 'KV2026/CS/1042' : 'FAC-EMP-089'}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Institutional Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        selectedRole === 'student'
                          ? 'alex.mercer@kvell.edu'
                          : selectedRole === 'faculty'
                          ? 'aris.thorne@kvell.edu'
                          : 'admin@kvell.edu'
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email || '');
                          setForgotPasswordModal(true);
                        }}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Remember this workstation session</span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 mt-3"
                >
                  <span>
                    {isSubmitting
                      ? 'Authenticating...'
                      : mode === 'login'
                      ? `Authenticate & Enter ${selectedRole.toUpperCase()} Workspace`
                      : 'Create Verified Institutional Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Verified Institutional Demo Accounts (For Evaluators, Testers & Clients) */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Instant 1-Click Institutional Access (Testing &amp; Evaluation)
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live Database
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('student')}
                    className="p-2.5 rounded-xl text-left bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 hover:brightness-105 transition-all group"
                  >
                    <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      Student
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      Alex Mercer
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      alex.mercer@kvell.edu
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('faculty')}
                    className="p-2.5 rounded-xl text-left bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60 hover:brightness-105 transition-all group"
                  >
                    <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                      Faculty / Teacher
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      Dr. Aris Thorne
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      aris.thorne@kvell.edu
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('admin')}
                    className="p-2.5 rounded-xl text-left bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:brightness-105 transition-all group"
                  >
                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Dean / Admin
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      Dean of Examinations
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      admin@kvell.edu
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Copyright & Identity */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>&copy; 2026 Karpaga Vinayaga Deemed to be University</span>
              <span>KVELL Enterprise v2.4 &bull; Commercial Production Standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Reset Account Password</span>
                </div>
                <button
                  onClick={() => setForgotPasswordModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  Close
                </button>
              </div>

              {resetSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Password Reset Link Dispatched
                  </div>
                  <p>
                    A secure cryptographic reset token has been sent to <strong>{resetEmail}</strong>. Follow the instructions to reset your password.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Enter your registered university email address. We will verify your identity against the institutional active directory and dispatch a password recovery link.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@kvell.edu"
                      className="w-full px-3.5 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
                    >
                      Dispatch Reset Token
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
