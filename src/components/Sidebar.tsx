import React from 'react';
import { useExam } from '../context/ExamContext';
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
  FolderGit2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiTutor: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenAiTutor,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, switchRole, logout } = useExam();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    roles: UserRole[];
    badge?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      id: 'exams',
      label: 'Examinations',
      icon: <BookOpen className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      id: 'questions',
      label: 'Question Bank',
      icon: <Code2 className="w-4 h-4" />,
      roles: ['faculty', 'admin'],
    },
    {
      id: 'proctoring',
      label: 'Live Proctoring',
      icon: <Eye className="w-4 h-4" />,
      roles: ['faculty', 'admin'],
      badge: 'Live',
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: <Award className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      id: 'governance',
      label: 'Audit & System',
      icon: <ShieldAlert className="w-4 h-4" />,
      roles: ['admin'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 select-none overflow-hidden transition-colors"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  ExamPro
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                  SaaS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate">
                Zero-Trust Proctoring
              </span>
            </motion.div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!collapsed && (
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Workspace:</span>
            <span className="font-bold text-slate-900 dark:text-white capitalize flex items-center gap-1">
              {user.role === 'admin' && <ShieldAlert className="w-3 h-3 text-emerald-500" />}
              {user.role === 'faculty' && <Briefcase className="w-3 h-3 text-purple-500" />}
              {user.role === 'student' && <GraduationCap className="w-3 h-3 text-indigo-500" />}
              {user.role}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                {item.icon}
              </span>

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
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

      {/* AI Assistant Quick Trigger & Download Source */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
        <button
          onClick={onOpenAiTutor}
          className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:brightness-105 ${
            collapsed ? 'px-0' : ''
          }`}
          title="Open ExamPro AI Mentor"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse flex-shrink-0" />
          {!collapsed && <span>Gemini AI Tutor</span>}
        </button>

        <a
          href="/api/download-zip"
          download="exampro-ai-full-source.zip"
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 ${
            collapsed ? 'px-0' : ''
          }`}
          title="Download Complete Source Code (ZIP)"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          {!collapsed && <span>Export Code (ZIP)</span>}
        </a>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs">
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
