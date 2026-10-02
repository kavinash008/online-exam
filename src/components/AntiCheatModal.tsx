import React from 'react';
import { AlertTriangle, ShieldAlert, XCircle, CheckCircle2 } from 'lucide-react';

interface AntiCheatModalProps {
  isOpen: boolean;
  warningLevel: number;
  reason: string;
  onAcknowledge: () => void;
  isAutoSubmitted?: boolean;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({
  isOpen,
  warningLevel,
  reason,
  onAcknowledge,
  isAutoSubmitted = false,
}) => {
  if (!isOpen) return null;

  const getWarningConfig = (level: number) => {
    switch (level) {
      case 1:
        return {
          title: 'Warning 1: You have left the examination window',
          message:
            'Focus deviation or tab-switching detected. All navigation actions outside the examination environment are recorded and reported to your faculty proctor.',
          color: 'from-amber-500 to-orange-500',
          borderColor: 'border-amber-500/50',
          badge: 'STAGE 1 / 4',
        };
      case 2:
        return {
          title: 'Warning 2: Second violation detected',
          message:
            'A second breach of proctoring protocol was logged. Your current camera frame, timestamp, and active window state have been flagged for manual faculty review.',
          color: 'from-orange-500 to-red-500',
          borderColor: 'border-orange-500/50',
          badge: 'STAGE 2 / 4',
        };
      case 3:
        return {
          title: 'Warning 3: Final warning before disqualification',
          message:
            'You are on your final warning. Any further unauthorized activity, tab-switch, exiting fullscreen, or shortcut attempt will immediately terminate and auto-submit your exam.',
          color: 'from-red-600 to-rose-700',
          borderColor: 'border-red-500/70',
          badge: 'STAGE 3 / 4 CRITICAL',
        };
      case 4:
      default:
        return {
          title: 'Examination Auto-Submitted',
          message:
            'Maximum permitted violation threshold exceeded (4 warnings). In accordance with institutional examination integrity policies, your attempt has been automatically locked and submitted.',
          color: 'from-rose-700 to-red-900',
          borderColor: 'border-red-600',
          badge: 'TERMINATED',
        };
    }
  };

  const config = getWarningConfig(warningLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-2 ${config.borderColor} shadow-2xl p-6 md:p-8 overflow-hidden`}
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 bg-gradient-to-b ${config.color} opacity-20 blur-3xl pointer-events-none`}
        />

        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${config.color} flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-bounce`}
          >
            {warningLevel >= 4 ? (
              <XCircle className="w-8 h-8" />
            ) : warningLevel === 3 ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <AlertTriangle className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 mb-1 border border-red-200 dark:border-red-800">
              {config.badge}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {config.title}
            </h3>
          </div>
        </div>

        {/* Reason pill */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs mb-4">
          <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
            Trigger Event:
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">{reason}</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {config.message}
        </p>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onAcknowledge}
            className={`w-full py-3 px-6 rounded-2xl font-bold text-xs tracking-wider uppercase text-white shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r ${config.color} hover:brightness-110`}
          >
            {warningLevel >= 4 ? (
              <>
                <XCircle className="w-4 h-4" /> View Results & Audit Log
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> I Understand & Return to Exam
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
