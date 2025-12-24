import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CalculatorCategory } from '../types';
import { finalTools } from '../config/tools';
import { RotateCcw, Info, ChevronRight, Menu } from 'lucide-react';

const Calculators: React.FC = () => {
  const location = useLocation();
  const [selectedToolId, setSelectedToolId] = useState<string>('metarisk');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tool = params.get('tool');
    if (tool && finalTools.find(t => t.id === tool)) {
      setSelectedToolId(tool);
    }
  }, [location]);

  const selectedTool = finalTools.find(t => t.id === selectedToolId) || finalTools[0];

  const categoryOrder = [
    CalculatorCategory.METABOLIC,
    CalculatorCategory.RENAL,
    CalculatorCategory.LIVER,
    CalculatorCategory.CARDIO,
    CalculatorCategory.RESPIRATORY,
    CalculatorCategory.NEUROLOGY,
    CalculatorCategory.UROLOGY,
    CalculatorCategory.PSYCH,
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Mobile Tool Selector Button */}
      <div className="lg:hidden shrink-0">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm font-bold text-slate-900 active:scale-[0.98] transition-transform"
          >
              <span className="flex items-center gap-2">
                <Menu size={18} className="text-slate-400"/>
                {selectedTool.name}
              </span>
              <ChevronRight className="text-slate-400" size={20} />
          </button>
      </div>

      {/* Sidebar List */}
      <div className={`
        lg:w-80 flex-shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm
        ${isMenuOpen ? 'fixed inset-0 z-50 m-0 rounded-none' : 'hidden lg:flex'}
      `}>
        {isMenuOpen && (
             <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white shrink-0">
                 <span className="font-black text-lg text-slate-900">選擇計算工具</span>
                 <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-600">✕</button>
             </div>
        )}
        
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 lg:block hidden shrink-0">
          <h2 className="font-black text-slate-800 text-base flex items-center gap-2">
            工具列表 <span className="text-xs font-medium text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">{finalTools.length}</span>
          </h2>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar bg-white">
          {categoryOrder.map((cat) => {
            const catTools = finalTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            return (
              <div key={cat} className="mb-2 last:mb-0">
                <div className="sticky top-0 z-10 px-5 py-2 text-xs font-black text-slate-500 bg-slate-50 border-b border-slate-100 uppercase tracking-wider backdrop-blur-sm bg-opacity-90">
                  {cat.split(' ')[0]}
                </div>
                <div className="py-1">
                    {catTools.map(tool => {
                        const isSelected = selectedToolId === tool.id;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => {
                                setSelectedToolId(tool.id);
                                setIsMenuOpen(false);
                            }}
                            className={`
                                w-full text-left px-5 py-3 text-sm font-bold transition-all border-l-4 relative
                                ${isSelected 
                                    ? 'border-teal-600 bg-teal-50 text-teal-900' 
                                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                          >
                            {tool.name}
                          </button>
                        );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 lg:p-8 overflow-y-auto shadow-sm flex flex-col relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100 shrink-0">
           <div>
             <h1 className="text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight leading-tight">
                {selectedTool.name}
             </h1>
             <div className="flex items-center text-sm text-slate-500 mt-2 font-bold flex-wrap gap-2">
               <span className="bg-slate-100 px-2.5 py-1 rounded text-xs font-bold text-slate-700 border border-slate-200">
                 {selectedTool.category.split(' ')[0]}
               </span>
               <span className="flex items-center gap-1">
                 <Info size={14} className="text-slate-400" /> 
                 依據國際或台灣最新指引
               </span>
             </div>
           </div>
           <button 
             onClick={() => window.location.reload()} 
             className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all border border-transparent hover:border-teal-100" 
             title="重置頁面"
           >
             <RotateCcw size={16} />
             <span className="hidden sm:inline">重置</span>
           </button>
        </div>
        
        <div className="flex-1 max-w-3xl mx-auto w-full">
            {selectedTool.component}
        </div>
      </div>
    </div>
  );
};

export default Calculators;