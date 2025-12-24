import React from 'react';
import { ExternalLink } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">臨床速查表 (Cheat Sheets)</h1>
        <p className="text-slate-600 mt-1 font-medium">常用身體評估分級與參考數值。</p>
      </header>

      <div className="masonry-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* GCS Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-slate-900">Glasgow Coma Scale (GCS)</h3>
             <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">滿分 15 / 最低 3</span>
          </div>
          <div className="p-4 text-sm">
            <div className="mb-4">
              <p className="font-black text-teal-700 mb-1 border-b border-teal-100 pb-1">Eye Opening (E)</p>
              <ul className="space-y-1 text-slate-700">
                <li className="flex justify-between"><span className="font-bold">4</span> 自動張眼 (Spontaneous)</li>
                <li className="flex justify-between"><span className="font-bold">3</span> 對聲音有反應 (To sound)</li>
                <li className="flex justify-between"><span className="font-bold">2</span> 對痛有反應 (To pressure)</li>
                <li className="flex justify-between"><span className="font-bold">1</span> 無反應 (None)</li>
              </ul>
            </div>
            <div className="mb-4">
              <p className="font-black text-teal-700 mb-1 border-b border-teal-100 pb-1">Verbal Response (V)</p>
              <ul className="space-y-1 text-slate-700">
                <li className="flex justify-between"><span className="font-bold">5</span> 定向感正常 (Oriented)</li>
                <li className="flex justify-between"><span className="font-bold">4</span> 應答混淆 (Confused)</li>
                <li className="flex justify-between"><span className="font-bold">3</span> 用字不當 (Words)</li>
                <li className="flex justify-between"><span className="font-bold">2</span> 發音難辨 (Sounds)</li>
                <li className="flex justify-between"><span className="font-bold">1</span> 無反應 (None)</li>
                <li className="text-xs text-slate-400 mt-1">*氣切/插管: V5T / VET</li>
              </ul>
            </div>
            <div>
              <p className="font-black text-teal-700 mb-1 border-b border-teal-100 pb-1">Motor Response (M)</p>
              <ul className="space-y-1 text-slate-700">
                <li className="flex justify-between"><span className="font-bold">6</span> 遵從指令 (Obey commands)</li>
                <li className="flex justify-between"><span className="font-bold">5</span> 疼痛定位 (Localizing)</li>
                <li className="flex justify-between"><span className="font-bold">4</span> 疼痛回縮 (Normal flexion)</li>
                <li className="flex justify-between"><span className="font-bold">3</span> 異常彎曲 (Abnormal flexion)</li>
                <li className="flex justify-between"><span className="font-bold">2</span> 異常伸展 (Extension)</li>
                <li className="flex justify-between"><span className="font-bold">1</span> 無反應 (None)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Muscle Power */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid h-fit">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
             <h3 className="font-bold text-slate-900">Muscle Power (MP) Grading</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left text-slate-700">
                <tbody>
                    <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 font-black text-teal-700 w-12 bg-teal-50/30">5</th>
                        <td className="px-4 py-3">正常肌力，可對抗重力與最大阻力 (Normal strength)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 font-black text-teal-700 bg-teal-50/30">4</th>
                        <td className="px-4 py-3">可對抗重力及部分阻力 (Good)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 font-black text-teal-700 bg-teal-50/30">3</th>
                        <td className="px-4 py-3">僅可對抗重力，無法抵抗阻力 (Fair)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 font-black text-teal-700 bg-teal-50/30">2</th>
                        <td className="px-4 py-3">重力消除下可移動關節 (Poor)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 font-black text-teal-700 bg-teal-50/30">1</th>
                        <td className="px-4 py-3">僅有肌肉收縮，無關節活動 (Trace)</td>
                    </tr>
                    <tr>
                        <th className="px-4 py-3 font-black text-teal-700 bg-teal-50/30">0</th>
                        <td className="px-4 py-3">無肌肉收縮 (Zero)</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>

        {/* NHI Lipid Guidelines */}
        <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden break-inside-avoid h-fit">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
             <h3 className="font-bold text-blue-900">健保降血脂藥物給付規定 (113年)</h3>
          </div>
          <div className="p-4 text-sm">
            <p className="font-bold text-black mb-2">心血管疾病危險因子 (Risk Factors)：</p>
            <ul className="list-decimal list-inside space-y-1 text-slate-700 mb-4 bg-slate-50 p-3 rounded border border-slate-200">
                <li>高血壓 (Hypertension)</li>
                <li>男性 &#8805; 45歲，女性 &#8805; 55歲 或停經者</li>
                <li>有早發性冠心病家族史 (男&lt;55, 女&lt;65)</li>
                <li>HDL-C &lt; 40 mg/dL</li>
                <li>吸菸 (Smoking)</li>
            </ul>
            <p className="font-bold text-black mb-2">藥物治療起始標準 (LDL-C)：</p>
             <table className="w-full text-sm text-left text-slate-700 border border-slate-200">
                <thead className="bg-slate-100 text-slate-900 font-black">
                    <tr>
                        <th className="px-2 py-1 border border-slate-200">共病狀態</th>
                        <th className="px-2 py-1 border border-slate-200">起始藥物</th>
                        <th className="px-2 py-1 border border-slate-200">治療目標</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-2 py-1 border border-slate-200">已有心血管疾病/糖尿病</td>
                        <td className="px-2 py-1 border border-slate-200 text-red-600 font-bold">&ge; 100</td>
                        <td className="px-2 py-1 border border-slate-200">&lt; 100</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-1 border border-slate-200">2個危險因子</td>
                        <td className="px-2 py-1 border border-slate-200 text-amber-700 font-bold">&ge; 130</td>
                        <td className="px-2 py-1 border border-slate-200">&lt; 130</td>
                    </tr>
                     <tr>
                        <td className="px-2 py-1 border border-slate-200">1個危險因子</td>
                        <td className="px-2 py-1 border border-slate-200 font-bold">&ge; 160</td>
                        <td className="px-2 py-1 border border-slate-200">&lt; 160</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-1 border border-slate-200">0個危險因子</td>
                        <td className="px-2 py-1 border border-slate-200 font-bold">&ge; 190</td>
                        <td className="px-2 py-1 border border-slate-200">&lt; 190</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>

        {/* Sarcopenia SARC-F */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid h-fit">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-slate-900">SARC-F 肌少症風險篩檢</h3>
             <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">總分 &ge; 4 為異常</span>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left text-slate-700">
                <tbody>
                    <tr className="bg-slate-50"><td colSpan={3} className="px-4 py-1 font-bold border-y border-slate-200">1. 肌力 (Strength) 提起或搬運10台斤重物?</td></tr>
                    <tr><td className="px-4">沒有困難: 0</td><td className="px-4">有點困難: 1</td><td className="px-4">非常困難: 2</td></tr>
                    
                    <tr className="bg-slate-50"><td colSpan={3} className="px-4 py-1 font-bold border-y border-slate-200">2. 行走輔助 (Assistance) 走過一個房間?</td></tr>
                    <tr><td className="px-4">沒有困難: 0</td><td className="px-4">有點困難: 1</td><td className="px-4">非常困難: 2</td></tr>
                    
                    <tr className="bg-slate-50"><td colSpan={3} className="px-4 py-1 font-bold border-y border-slate-200">3. 起身 (Rise from a chair) 從椅子/床起身?</td></tr>
                    <tr><td className="px-4">沒有困難: 0</td><td className="px-4">有點困難: 1</td><td className="px-4">非常困難: 2</td></tr>

                    <tr className="bg-slate-50"><td colSpan={3} className="px-4 py-1 font-bold border-y border-slate-200">4. 爬樓梯 (Climb stairs) 爬10階樓梯?</td></tr>
                    <tr><td className="px-4">沒有困難: 0</td><td className="px-4">有點困難: 1</td><td className="px-4">非常困難: 2</td></tr>

                    <tr className="bg-slate-50"><td colSpan={3} className="px-4 py-1 font-bold border-y border-slate-200">5. 跌倒 (Falls) 過去一年跌倒次數?</td></tr>
                    <tr><td className="px-4">沒有: 0</td><td className="px-4">1-3次: 1</td><td className="px-4">4次以上: 2</td></tr>
                </tbody>
             </table>
          </div>
        </div>

        {/* Sports Medicine */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid h-fit">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
             <h3 className="font-bold text-slate-900">運動醫學速查 (Sports Med)</h3>
          </div>
          <div className="p-4 text-sm">
            <div className="mb-4">
                <p className="font-black text-teal-700 mb-2 border-b border-teal-100 pb-1">METs (代謝當量) 定義</p>
                <table className="w-full text-left">
                    <tbody>
                        <tr className="border-b border-slate-100"><td className="py-1 font-bold w-24">Light (&lt;3)</td><td className="py-1 text-slate-600">慢走、洗碗、打電腦</td></tr>
                        <tr className="border-b border-slate-100"><td className="py-1 font-bold w-24">Moderate (3-6)</td><td className="py-1 text-slate-600">快走 (4-6km/h)、掃地拖地、雙打羽球</td></tr>
                        <tr><td className="py-1 font-bold w-24">Vigorous (&gt;6)</td><td className="py-1 text-slate-600">跑步、登山、單打網球、搬重物</td></tr>
                    </tbody>
                </table>
            </div>
            <div>
                <p className="font-black text-teal-700 mb-2 border-b border-teal-100 pb-1">最大心率計算 (Max HR)</p>
                <div className="space-y-2">
                    <p className="flex justify-between"><span className="font-bold text-slate-800">傳統公式 (Standard):</span> <span className="font-mono bg-slate-100 px-2 rounded">220 - Age</span></p>
                    <p className="flex justify-between"><span className="font-bold text-slate-800">Tanaka Formula:</span> <span className="font-mono bg-slate-100 px-2 rounded">208 - (0.7 × Age)</span></p>
                    <p className="text-xs text-slate-500 mt-1">中等強度運動建議心率：Max HR × 64% ~ 76%</p>
                </div>
            </div>
          </div>
        </div>

        {/* HPA Link */}
         <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-200 shadow-sm overflow-hidden break-inside-avoid h-fit">
           <div className="p-5">
              <h3 className="font-bold text-indigo-900 text-lg mb-2">國健署慢性疾病風險評估平台</h3>
              <p className="text-sm text-indigo-700 mb-4">提供冠心病、腦中風、糖尿病、高血壓之未來10年風險預測 (需輸入健檢數值)。</p>
              <a 
                href="https://cdrc.hpa.gov.tw/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ExternalLink size={16} className="mr-2" />
                前往評估平台 (External)
              </a>
           </div>
         </div>

        {/* Edema & DTR */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid h-fit">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
             <h3 className="font-bold text-slate-900">Edema & DTR Grading</h3>
          </div>
          <div className="p-4 text-sm grid grid-cols-1 gap-6">
            
            {/* Edema */}
            <div>
                <p className="font-black text-teal-700 mb-2 border-b border-teal-100 pb-1">Pitting Edema (水腫)</p>
                <ul className="space-y-2 text-slate-700">
                    <li className="flex gap-3"><span className="font-bold w-6 text-center bg-slate-100 rounded">1+</span> <span>輕微凹陷 (2mm)，立即回彈</span></li>
                    <li className="flex gap-3"><span className="font-bold w-6 text-center bg-slate-100 rounded">2+</span> <span>中度凹陷 (4mm)，10-15秒回彈</span></li>
                    <li className="flex gap-3"><span className="font-bold w-6 text-center bg-slate-100 rounded">3+</span> <span>深度凹陷 (6mm)，約1分鐘回彈，外觀腫脹</span></li>
                    <li className="flex gap-3"><span className="font-bold w-6 text-center bg-slate-100 rounded">4+</span> <span>極深凹陷 (8mm)，2-5分鐘回彈，嚴重變形</span></li>
                </ul>
            </div>

            {/* DTR */}
            <div>
                <p className="font-black text-teal-700 mb-2 border-b border-teal-100 pb-1">Deep Tendon Reflex (DTR)</p>
                <ul className="space-y-2 text-slate-700">
                    <li className="flex gap-3"><span className="font-bold w-8 text-center bg-slate-100 rounded">4+</span> <span>Hyperactive + Clonus (可能有病變)</span></li>
                    <li className="flex gap-3"><span className="font-bold w-8 text-center bg-slate-100 rounded">3+</span> <span>Brisker than avg (可能正常或病變)</span></li>
                    <li className="flex gap-3"><span className="font-bold w-8 text-center bg-slate-100 rounded">2+</span> <span>Average / Normal (正常)</span></li>
                    <li className="flex gap-3"><span className="font-bold w-8 text-center bg-slate-100 rounded">1+</span> <span>Diminished (減弱)</span></li>
                    <li className="flex gap-3"><span className="font-bold w-8 text-center bg-slate-100 rounded">0</span> <span>No response (無反射)</span></li>
                </ul>
            </div>
          </div>
        </div>

        {/* Stool Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid h-fit">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
             <h3 className="font-bold text-slate-900">Bristol Stool Scale (布里斯托大便分類)</h3>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left text-slate-700">
                <tbody>
                    <tr className="border-b border-slate-100 bg-rose-50/30">
                        <th className="px-4 py-2 font-black w-16">Type 1</th>
                        <td className="px-4 py-2">顆粒狀硬球 (便秘嚴重)</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-rose-50/30">
                        <th className="px-4 py-2 font-black w-16">Type 2</th>
                        <td className="px-4 py-2">香腸狀但表面凹凸 (輕微便秘)</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-green-50/30">
                        <th className="px-4 py-2 font-black w-16">Type 3</th>
                        <td className="px-4 py-2">香腸狀，表面有裂痕 (正常)</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-green-50/30">
                        <th className="px-4 py-2 font-black w-16">Type 4</th>
                        <td className="px-4 py-2">香腸/蛇狀，表面光滑 (最佳狀態)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <th className="px-4 py-2 font-black w-16">Type 5</th>
                        <td className="px-4 py-2">柔軟斷裂的塊狀 (缺乏纖維?)</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-orange-50/30">
                        <th className="px-4 py-2 font-black w-16">Type 6</th>
                        <td className="px-4 py-2">蓬鬆糊狀 (輕微腹瀉)</td>
                    </tr>
                    <tr className="bg-orange-50/30">
                        <th className="px-4 py-2 font-black w-16">Type 7</th>
                        <td className="px-4 py-2">水狀無固體 (嚴重腹瀉)</td>
                    </tr>
                </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;