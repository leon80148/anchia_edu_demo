import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  Search, 
  BookOpen, 
  Menu, 
  X,
  Activity,
  Table,
  Stethoscope
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: '臨床速查表 (Cheat Sheet)', icon: <Table size={20} /> },
    { path: '/calculators', label: '臨床計算機 (Tools)', icon: <Calculator size={20} /> },
    { path: '/nhi-query', label: '健保整合查詢 (NHI)', icon: <Search size={20} /> },
    { path: '/guidelines', label: '衛教指引 (Guidelines)', icon: <BookOpen size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 bg-white shrink-0">
          <div className="bg-teal-600 p-2 rounded-lg mr-3 shadow-sm">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">ClinicCal</h1>
            <p className="text-xs text-slate-500 font-bold mt-1">診所臨床小幫手</p>
          </div>
          <button 
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-base group
                  ${active
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-200/50 translate-x-1' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <span className={`mr-3 transition-colors ${active ? 'text-teal-100' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Author Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-100 p-2 rounded-full">
                    <Stethoscope size={16} className="text-indigo-600" />
                </div>
                <div>
                    <p className="font-black text-slate-900 text-sm">ClinicCal</p>
                    <p className="text-xs text-slate-500 font-medium">For Clinical Use Only</p>
                </div>
            </div>
            <div className="text-xs text-slate-400 font-medium border-t border-slate-100 pt-2 mt-2">
              Created by <span className="text-slate-600 font-bold">@fmdrlu</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-slate-50/50">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-30 shrink-0">
          <div className="flex items-center gap-2">
             <div className="bg-teal-600 p-1.5 rounded-md">
                <Activity className="text-white" size={20} />
             </div>
             <span className="text-lg font-black text-slate-900">ClinicCal</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;