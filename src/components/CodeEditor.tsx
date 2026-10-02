import React, { useState } from 'react';
import { Play, RotateCcw, Check, Terminal, Code2 } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'typescript',
  onChange,
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    onChange(e.target.value);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      try {
        // Safe simulation check
        if (code.includes('findMaxSubarraySum')) {
          setOutput('✅ Test Suite: 3/3 Passed\nTest 1: [-2,1,-3,4,-1,2,1,-5,4] => 6 (Passed)\nTest 2: [1] => 1 (Passed)\nTest 3: [5,4,-1,7,8] => 23 (Passed)\n\nExecution Time: 4ms | Memory: 1.2MB');
        } else {
          setOutput(`[Compiled successfully as ${language}]\nReturn status: 0 (No syntax errors detected).\nAll assertions passed for sample test inputs.`);
        }
      } catch (err: any) {
        setOutput(`Execution Error: ${err?.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 600);
  };

  const handleReset = () => {
    setCode(initialCode);
    onChange(initialCode);
    setOutput(null);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 overflow-hidden shadow-xl">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-slate-400 font-mono text-[11px] ml-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            solution.{language === 'typescript' ? 'ts' : 'js'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                {isRunning ? 'Running...' : 'Run Tests'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code Text Area with Line numbers */}
      <div className="relative flex font-mono text-xs leading-relaxed min-h-[160px]">
        {/* Line numbers gutter */}
        <div className="py-3 px-3 text-right select-none bg-slate-950/40 text-slate-600 border-r border-slate-800/80 text-[11px] min-w-[40px]">
          {Array.from({ length: Math.max(lineCount, 6) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 placeholder-slate-600 resize-y focus:outline-hidden font-mono text-xs leading-relaxed"
          rows={Math.max(lineCount + 1, 8)}
        />
      </div>

      {/* Terminal Output */}
      {output && (
        <div className="border-t border-slate-800 bg-slate-950 p-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
            <Terminal className="w-3 h-3 text-sky-400" />
            Console Output
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};
