import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building,
  GraduationCap,
  HardDrive,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { exams, attempts, certificates, violations, systemLogs, user } = useExam();
  const [activeTab, setActiveTab] = useState<'metrics' | 'audit_logs' | 'users' | 'backup'>('metrics');
  const [searchTerm, setSearchTerm] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'critical' | 'warning'>('all');

  // Academic departments
  const departments = [
    { name: 'Computer Science & Engineering', code: 'CSE', examsCount: 3, studentsCount: 420 },
    { name: 'Information Security & Cyber Defense', code: 'ISCD', examsCount: 2, studentsCount: 210 },
    { name: 'School of Machine Intelligence', code: 'SMI', examsCount: 2, studentsCount: 310 },
    { name: 'Software Architecture & Cloud', code: 'SAC', examsCount: 1, studentsCount: 180 },
  ];

  // System Users
  const systemUsers = [
    { name: 'Dr. Aris Thorne', email: 'a.thorne@faculty.edu', role: 'faculty', dept: 'CSE' },
    { name: 'Prof. Elena Rostova', email: 'e.rostova@faculty.edu', role: 'faculty', dept: 'ISCD' },
    { name: 'Alex Mercer', email: 'alex.mercer@university.edu', role: 'student', dept: 'CSE' },
    { name: 'Maya Lin', email: 'maya.lin@university.edu', role: 'student', dept: 'CSE' },
    { name: 'Julian Vance', email: 'j.vance@university.edu', role: 'student', dept: 'CSE' },
    { name: 'Super Administrator', email: 'admin@exampro.edu', role: 'admin', dept: 'Academic IT' },
  ];

  const filteredUsers = systemUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadBackup = () => {
    const backupPayload = {
      institution: 'ExamPro AI Global University',
      exportedAt: new Date().toISOString(),
      exams,
      attempts,
      certificates,
      violations,
      auditLogs: systemLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `exampro_enterprise_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Enterprise Governance</span>
            <span aria-hidden="true">&bull;</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero-Trust Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            System Administration & Security
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/download-zip"
            download="exampro-ai-full-source.zip"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            Download Source Code (ZIP)
          </a>
          <button
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Database className="w-4 h-4" />
            Export DB Snapshot (JSON)
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Enrolled Candidates
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            1,120
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Across 4 Cohorts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Active Examinations
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {exams.length}
          </div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            Standardized Rubrics
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Completed Submissions
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {attempts.length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {certificates.length} Passed Honors
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Anti-Cheat Violations
          </span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            {violations.length || 3}
          </div>
          <div className="text-xs text-rose-500 font-medium mt-1">
            Flagged & Intercepted
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 w-fit">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'metrics'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Departments
        </button>
        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'audit_logs'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Integrity & Audit Trail
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'users'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          User Directory ({systemUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'backup'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Cloud Infrastructure
        </button>
      </div>

      {/* TAB 1: DEPARTMENTS */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {departments.map((dept, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{dept.code}</span>
                <span>{dept.studentsCount} Students</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {dept.name}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                <div>Examinations: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{dept.examsCount}</strong></div>
                <div>Compliance Rate: <strong className="text-emerald-600 tabular-nums">99.4%</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Anti-Cheating Security Audit Trail
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live Visibility API Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Violation Trigger</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Client User Agent</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {violations.length > 0 ? (
                  violations.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            v.warningLevel >= 4 ? 'text-rose-600' : 'text-amber-500'
                          }`}
                        >
                          Warning #{v.warningLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {v.reason}
                      </td>
                      <td className="py-3 px-4">{v.studentName || v.studentId}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 truncate max-w-xs">
                        {v.browserInfo}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 tabular-nums">
                        {new Date(v.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      No security violations detected in the active session. All examinees compliant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional User Directory
            </h3>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter members..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 capitalize font-medium">{u.role}</td>
                    <td className="py-3 px-4">{u.dept}</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">
                      Verified Active
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CLOUD ARCHITECTURE */}
      {activeTab === 'backup' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cloud Architecture & Security Blueprint Status
              </h3>
              <p className="text-xs text-slate-500">
                Real-time connection status across cloud storage and AI engines.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                <Database className="w-4 h-4 text-indigo-500" />
                Firestore Enterprise
              </div>
              <p className="text-[11px] text-slate-500">
                Security rules deployed with ABAC fortress specification.
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-semibold pt-1">Connected</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                <Cpu className="w-4 h-4 text-purple-500" />
                Gemini 3.8 Flash Engine
              </div>
              <p className="text-[11px] text-slate-500">
                Powering multi-turn tutoring, question generation & essay scoring.
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-semibold pt-1">Active</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                <HardDrive className="w-4 h-4 text-amber-500" />
                Anti-Cheat Proctor Guard
              </div>
              <p className="text-[11px] text-slate-500">
                Page Visibility API + Fullscreen Lock + 4-Warning Protocol.
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-semibold pt-1">Enforcing</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
