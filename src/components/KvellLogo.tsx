import React from 'react';

interface KvellLogoProps {
  variant?: 'full' | 'horizontal' | 'mark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const KvellLogo: React.FC<KvellLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Sizing definitions ensuring strict aspect ratio
  const sizeMap = {
    xs: { crest: 'w-7 h-7', title: 'text-sm', sub: 'text-[9px]' },
    sm: { crest: 'w-9 h-9', title: 'text-base', sub: 'text-[10px]' },
    md: { crest: 'w-11 h-11', title: 'text-lg', sub: 'text-[11px]' },
    lg: { crest: 'w-14 h-14', title: 'text-xl', sub: 'text-xs' },
    xl: { crest: 'w-20 h-20', title: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Mark only
  if (variant === 'mark') {
    return (
      <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
        <img
          src="/kvell-logo.svg"
          alt="KVELL Crest - Karpaga Vinayaga Deemed University"
          className={`${currentSize.crest} aspect-square object-contain transition-transform duration-200 select-none drop-shadow-xs`}
          loading="eager"
        />
      </div>
    );
  }

  // Full Stacked Crest (e.g. for Result pages, Certificates, Hero)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <img
          src="/kvell-logo.svg"
          alt="KVELL Crest - Karpaga Vinayaga Deemed University"
          className={`${currentSize.crest} aspect-square object-contain mb-2 drop-shadow-sm`}
          loading="eager"
        />
        <div className="flex flex-col items-center">
          <span className={`font-serif font-black tracking-widest text-slate-900 dark:text-white uppercase ${currentSize.title}`}>
            KVELL
          </span>
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 tracking-wider uppercase mt-0.5">
            Online Examination &amp; Assessment Platform
          </span>
          {showSubtitle && (
            <span className="text-[9px] text-slate-500 dark:text-slate-400 tracking-normal mt-0.5">
              Karpaga Vinayaga Deemed to be University
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal Brand Header
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <img
        src="/kvell-logo.svg"
        alt="KVELL Crest"
        className={`${currentSize.crest} aspect-square object-contain flex-shrink-0 drop-shadow-xs`}
        loading="eager"
      />
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`font-serif font-black tracking-wider text-slate-900 dark:text-white ${currentSize.title}`}>
            KVELL
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-widest">
            ASSESS
          </span>
        </div>
        {showSubtitle && (
          <span className={`${currentSize.sub} font-medium text-slate-500 dark:text-slate-400 truncate`}>
            Online Examination Platform
          </span>
        )}
      </div>
    </div>
  );
};
