import React from 'react';
import { ExternalLink, Pill, Receipt, ShieldCheck, Info } from 'lucide-react';

const NHIQuery: React.FC = () => {
  const links = [
    {
      title: '健保用藥品項查詢 (INAE3000)',
      description: '查詢藥品健保代碼、藥價、成分、給付規定 (事前審查條件)。',
      url: 'https://info.nhi.gov.tw/INAE3000/INAE3000S01',
      icon: <Pill className="w-8 h-8 text-teal-600" />,
      color: 'border-teal-200 hover:border-teal-400 bg-teal-50/50'
    },
    {
      title: '醫療服務支付標準 (INAE5000)',
      description: '查詢診療費、檢驗檢查、手術處置之支付點數與規範。',
      url: 'https://info.nhi.gov.tw/INAE5000/INAE5001S01',
      icon: <Receipt className="w-8 h-8 text-blue-600" />,
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">健保資料庫官方查詢</h1>
        <p className="text-slate-500">為確保資料即時性與準確性，請直接連結至衛生福利部中央健康保險署官方網站進行查詢。</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-8">
        <Info className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
        <div className="text-sm text-amber-800">
            <p className="font-bold mb-1">提示</p>
            <p>點擊下方卡片將會開啟新視窗，連線至健保署網站。請確認您的裝置已連上網際網路。</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {links.map((link) => (
          <a 
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className={`
              block p-6 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md group
              ${link.color}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <ExternalLink className="text-slate-400 group-hover:text-slate-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-black flex items-center gap-2">
              {link.title}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {link.description}
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-slate-800">
              <ShieldCheck size={16} className="mr-1.5" />
              官方資料來源 (info.nhi.gov.tw)
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">查詢小技巧 (Tips)</h3>
        <ul className="space-y-3 text-sm text-slate-600 list-disc list-inside">
          <li>
            <strong>藥品查詢：</strong>若不確定完整學名，可輸入部分名稱（如 "Metformin"）即可搜尋。
          </li>
          <li>
            <strong>支付標準：</strong>若要查特定檢驗（如 HbA1c），可用英文名稱或代碼（如 "09006C"）搜尋最快。
          </li>
          <li>
            <strong>管制藥品：</strong>查詢結果會註記管制級別，請留意處方限制。
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NHIQuery;