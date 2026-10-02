import React, { useRef } from 'react';
import { Certificate } from '../types';
import { Award, CheckCircle, Download, Printer, ShieldCheck, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateViewProps {
  certificate: Certificate;
  onClose?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
      {/* Action buttons toolbar */}
      <div className="w-full flex items-center justify-between mb-4 print:hidden">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified Credential &bull; Grade {certificate.grade}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Certificate
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md shadow-indigo-600/25 hover:brightness-110 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Printable Certificate Canvas */}
      <div
        ref={certRef}
        className="w-full bg-[#fcfaf5] text-slate-900 border-12 border-double border-[#b38f4d] rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:m-0"
      >
        {/* Subtle Watermark Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <ShieldCheck className="w-[600px] h-[600px] text-[#b38f4d]" />
        </div>

        {/* Top Header */}
        <div className="text-center relative z-10 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-white shadow-lg mb-3">
            <Award className="w-9 h-9" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#93712d]">
            ExamPro Global Academy of Computer Science
          </h4>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2 tracking-tight">
            Certificate of Academic Excellence
          </h1>
          <div className="w-24 h-1 bg-[#b38f4d] mx-auto mt-3 rounded-full" />
        </div>

        {/* Body Statement */}
        <div className="text-center relative z-10 my-8 space-y-3">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-widest">
            This is to officially certify that
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 underline decoration-[#b38f4d]/40 underline-offset-8">
            {certificate.studentName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
            has rigorously completed the standardized examination and demonstrated advanced proficiency in
          </p>
          <div className="text-lg sm:text-xl font-bold text-indigo-950 px-4 py-1.5 inline-block bg-indigo-50/60 rounded-xl border border-indigo-100">
            {certificate.examTitle}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto my-8 relative z-10 text-center">
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Final Score
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {certificate.score} / {certificate.totalMarks}
            </span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Percentage
            </span>
            <span className="text-lg font-extrabold text-indigo-700">
              {certificate.percentage}%
            </span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Distinction
            </span>
            <span className="text-lg font-extrabold text-emerald-700">
              Grade {certificate.grade}
            </span>
          </div>
        </div>

        {/* Signatures & Security Footer */}
        <div className="pt-6 border-t border-amber-300/60 mt-8 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 relative z-10 text-xs">
          {/* Institutional Signature */}
          <div className="text-center sm:text-left">
            <div className="font-serif italic text-lg text-slate-800 border-b border-slate-400 pb-1 inline-block">
              Dr. Aris Thorne, Ph.D.
            </div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
              Chair of Academic Assessment
            </div>
          </div>

          {/* QR Verification Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-2 bg-white rounded-lg border border-amber-300 shadow-sm flex flex-col items-center">
              <QrCode className="w-14 h-14 text-slate-900" />
              <span className="text-[8px] font-mono tracking-tighter text-slate-500 mt-1">
                SECURE QR VALIDATED
              </span>
            </div>
          </div>

          {/* Verification Hash & Date */}
          <div className="text-center sm:text-right">
            <div className="font-mono text-[10px] text-slate-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 inline-block">
              ID: {certificate.verificationCode}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
              Issued: {new Date(certificate.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
