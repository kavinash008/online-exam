import React from 'react';
import { useExam } from '../context/ExamContext';
import { KvellLogo } from './KvellLogo';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Eye,
  Award,
  ShieldAlert,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Sliders,
  LogOut,
  Download,
  Users,
  Layers,
  FileCheck2,
  BarChart3,
  Bell,
  History,
  Settings,
  PlusCircle,
  Home,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiTutor: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onGoToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenAiTutor,
  collapsed,
  onToggleCollapse,
  onGoToLanding,
}) => {
  const { user, logout, notifications, metrics } = useExam();

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    roles: UserRole[];
    badge?: string | number;
  }

  // Exact Professional Navigation mapped from brief specification 42
  const navItems: NavItem[] = [
    // Common / Student
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin'],
    },
    // Student specifics
    {
      id: 'upcoming-exams',
      label: 'Upcoming Exams',
      icon: <BookOpen className="w-4 h-4" />,
      roles: ['student'],
      badge: metrics.activeExams > 0 ? metrics.activeExams : undefined,
    },
    {
      id: 'my-exams',
      label: 'My Examinations',
      icon: <FileCheck2 className="w-4 h-4" />,
      roles: ['student'],
    },
    {
      id: 'student-results',
      label: 'My Results',
      icon: <Award className="w-4 h-4" />,
      roles: ['student'],
    },
    {
      id: 'student-performance',
      label: 'Performance Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['student'],
    },

    // Faculty specifics
    {
      id: 'faculty-exams',
      label: 'Examinations',
      icon: <BookOpen className="w-4 h-4" />,
      roles: ['faculty'],
    },
    {
      id: 'create-exam',
      label: 'Create Exam',
      icon: <PlusCircle className="w-4 h-4" />,
      roles: ['faculty'],
    },
    {
      id: 'question-bank',
      label: 'Question Bank',
      icon: <Code2 className="w-4 h-4" />,
      roles: ['faculty', 'admin'],
      badge: metrics.totalQuestions > 0 ? metrics.totalQuestions : undefined,
    },
    {
      id: 'faculty-results',
      label: 'Assessment Results',
      icon: <Award className="w-4 h-4" />,
      roles: ['faculty'],
    },
    {
      id: 'proctoring',
      label: 'Live Proctoring',
      icon: <Eye className="w-4 h-4" />,
      roles: ['faculty', 'admin'],
      badge: 'Live',
    },
    {
      id: 'faculty-analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['faculty'],
    },

    // Admin specifics
    {
      id: 'admin-students',
      label: 'Student Directory',
      icon: <GraduationCap className="w-4 h-4" />,
      roles: ['admin'],
      badge: metrics.totalStudents > 0 ? metrics.totalStudents : undefined,
    },
    {
      id: 'admin-faculty',
      label: 'Faculty Directory',
      icon: <Briefcase className="w-4 h-4" />,
      roles: ['admin'],
      badge: metrics.totalFaculty > 0 ? metrics.totalFaculty : undefined,
    },
    {
      id: 'admin-subjects',
      label: 'University Subjects',
      icon: <Layers className="w-4 h-4" />,
      roles: ['admin'],
    },
    {
      id: 'admin-exams',
      label: 'Examinations Roster',
      icon: <BookOpen className="w-4 h-4" />,
      roles: ['admin'],
      badge: metrics.totalExams > 0 ? metrics.totalExams : undefined,
    },
    {
      id: 'admin-results',
      label: 'Results & Certification',
      icon: <Award className="w-4 h-4" />,
      roles: ['admin'],
    },
    {
      id: 'admin-analytics',
      label: 'University Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['admin'],
    },
    {
      id: 'admin-audit',
      label: 'Audit Logs',
      icon: <History className="w-4 h-4" />,
      roles: ['admin'],
    },
    {
      id: 'admin-settings',
      label: 'Platform Settings',
      icon: <Settings className="w-4 h-4" />,
      roles: ['admin'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 select-none overflow-hidden transition-colors"
    >
      {/* Brand Header with Official KVELL Logo */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <KvellLogo variant="mark" size="sm" />
          {!collapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black tracking-wider text-sm text-slate-900 dark:text-white uppercase">
                  KVELL
                </span>
                <span className="text-[9px] font-bold px-1 py-0.5 rounded-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  DEEMED UNIV
                </span>
              </div>
              <span className="text-[9px] font-medium text-slate-400 truncate">
                Examination Platform
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Role Card */}
      {!collapsed && (
        <div className="px-3 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Workspace
            </span>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : user.role === 'faculty'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              }`}
            >
              {user.role}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
            {user.displayName}
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {user.department || 'University Division'}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                {item.icon}
              </span>

              {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

              {!collapsed && item.badge !== undefined && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Academic Mentor Trigger & Public Landing Trigger */}
      <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 ${
              collapsed ? 'px-0' : ''
            }`}
            title="Public Information Portal"
          >
            <Home className="w-3.5 h-3.5 flex-shrink-0" />
            {!collapsed && <span>University Portal</span>}
          </button>
        )}

        <button
          onClick={onOpenAiTutor}
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:brightness-105 ${
            collapsed ? 'px-0' : ''
          }`}
          title="Open KVELL AI Academic Mentor"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse flex-shrink-0" />
          {!collapsed && <span>KVELL AI Mentor</span>}
        </button>

        <a
          href="/api/download-zip"
          download="kvell-full-source.zip"
          className={`w-full flex items-center justify-center gap-2 p-1.5 rounded-xl text-[11px] font-semibold transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 ${
            collapsed ? 'px-0' : ''
          }`}
          title="Download Complete Source Code (ZIP)"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          {!collapsed && <span>Export Code (ZIP)</span>}
        </a>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs">
            {user.displayName.charAt(0)}
          </div>
          {!collapsed && (
            <div className="truncate text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.displayName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.aside>
  );
};
