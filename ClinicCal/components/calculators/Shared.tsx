import React, { useState } from 'react';
import { CalculatorResult } from '../../types';
import { Check, Copy, ArrowRight } from 'lucide-react';

// --- Reusable Components ---

export interface ResultCardProps {
    title: string;
    result: CalculatorResult | null;
    copyContent: string; // The formatted string for EMR
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, result, copyContent }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const colorClasses = {
    green: 'bg-emerald-50 border-emerald-600 text-emerald-900',
    yellow: 'bg-amber-50 border-amber-500 text-amber-900',
    red: 'bg-rose-50 border-rose-600 text-rose-900',
    gray: 'bg-slate-100 border-slate-400 text-slate-900'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(copyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mt-6 p-6 rounded-xl border-l-8 ${colorClasses[result.color]} shadow-sm animate-in fade-in slide-in-from-bottom-2 border-y border-r border-slate-200 relative`}>
      
      <div className="flex justify-between items-start mb-2">
          <p className="text-xs uppercase tracking-wider font-black opacity-80 text-black">計算結果 RESULT</p>
          <button 
            onClick={handleCopy}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm transition-all shadow-sm border
                ${copied 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-black'}
            `}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? '已複製 (Copied)' : '複製結果 (Copy)'}
          </button>
      </div>

      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-4xl font-black text-black">{result.value}</span>
      </div>
      <p className="text-xl font-bold mb-3 text-black">{result.interpretation}</p>
      
      {result.nextSteps && (
        <div className="mt-4 pt-4 border-t border-black/10">
            <div className="flex items-start gap-2">
                <ArrowRight size={18} className="mt-1 opacity-70 flex-shrink-0 text-black" />
                <div>
                    <span className="text-xs font-bold uppercase opacity-70 block mb-1 text-black">建議處置 (Recommendation)</span>
                    <p className="text-base font-bold leading-relaxed text-black">{result.nextSteps}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-6">
        <label className="block text-base font-bold text-black mb-2">{label}</label>
        {children}
    </div>
);

export const NumberInput: React.FC<{ value: number | ''; onChange: (val: number) => void; placeholder?: string; step?: string }> = ({ value, onChange, placeholder, step }) => (
    <input 
        type="number" 
        step={step}
        value={value} 
        onChange={e => onChange(Number(e.target.value))} 
        className="w-full rounded-lg border-2 border-slate-300 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-3 text-xl font-bold text-black placeholder-slate-400" 
        placeholder={placeholder}
    />
);

export const Toggle: React.FC<{ options: {value: any, label: string}[]; value: any; onChange: (val: any) => void }> = ({ options, value, onChange }) => (
    <div className="flex rounded-lg shadow-sm border-2 border-slate-300 overflow-hidden bg-white">
        {options.map((opt, idx) => (
            <button
                key={String(opt.value)}
                onClick={() => onChange(opt.value)}
                className={`flex-1 py-3 px-3 text-sm font-bold transition-colors
                    ${value === opt.value ? 'bg-teal-700 text-white' : 'bg-white text-slate-900 hover:bg-slate-100'}
                    ${idx !== 0 ? 'border-l border-slate-300' : ''}
                `}
            >
                {opt.label}
            </button>
        ))}
    </div>
);

export const Checkbox: React.FC<{label: string, checked: boolean, onChange: (v: boolean) => void}> = ({label, checked, onChange}) => (
    <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg mb-3 hover:bg-slate-50 cursor-pointer transition-colors bg-white shadow-sm">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500 border-slate-300 bg-white" />
        <span className="ml-3 text-base font-bold text-black">{label}</span>
    </label>
);

// --- Helper to format EMR text ---
export const formatEMR = (title: string, inputs: string, result: CalculatorResult | null) => {
    if (!result) return '';
    return `[${title}]\nInputs: ${inputs}\nResult: ${result.value}\nInterp: ${result.interpretation}\nNote: ${result.nextSteps || '-'}`;
};
