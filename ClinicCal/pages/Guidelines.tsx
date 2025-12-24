import React, { useState } from 'react';
import { Copy, Check, Search } from 'lucide-react';

const Guidelines: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allTemplates = [
    // --- 代謝/內分泌 ---
    {
      id: 'dm-edu',
      title: '糖尿病基礎衛教 (DM General)',
      category: '新陳代謝科',
      content: `【糖尿病生活照護重點】
1. 飲食原則：定時定量，高纖低油。水果每日限2份(拳頭大)，避免含糖飲料。
2. 規律運動：每週至少150分鐘中等強度運動(如快走至微喘)。
3. 足部護理：每日檢查足部有無傷口、紅腫。洗澡水溫不可過燙。穿著寬楦包鞋與棉襪。
4. 預防低血糖：隨身攜帶糖果。若出現手抖、心悸、冒冷汗，立即補充15g糖(如3顆方糖或半瓶養樂多)。
5. 定期追蹤：每3個月抽血(HbA1c)，每年檢查眼底與足部。`
    },
    {
      id: 'gout-diet',
      title: '痛風/高尿酸飲食 (Gout Diet)',
      category: '新陳代謝科',
      content: `【痛風與高尿酸飲食衛教】
1. 多喝水：每日至少 2000-3000cc，幫助尿酸排泄。
2. 避免高普林食物：內臟類(肝、腎、心)、海鮮(牡蠣、蛤蜊、蝦蟹)、濃肉湯、火鍋湯底。
3. 避免飲酒：特別是啤酒與烈酒，會阻礙尿酸代謝。
4. 避免含果糖飲料：手搖飲、汽水會增加尿酸生成。
5. 豆製品與蕈菇類：近期研究顯示適量食用植物性普林通常不會誘發痛風發作，可安心適量攝取。`
    },
    {
      id: 'cholesterol-diet',
      title: '高血脂飲食控制 (Hyperlipidemia)',
      category: '新陳代謝科',
      content: `【降低膽固醇飲食原則】
1. 減少飽和脂肪：少吃肥肉、皮、奶油、豬油、椰子油。
2. 避免反式脂肪：少吃油炸物、糕點、酥皮濃湯。
3. 增加膳食纖維：多吃燕麥、蔬果、豆類，有助吸附膽固醇。
4. 烹調方式：多用清蒸、水煮、涼拌，取代油炸與煎炒。
5. 若生活型態調整3-6個月無效，請配合醫師指示服用降血脂藥物。`
    },

    // --- 心臟血管 ---
    {
      id: 'htn-lifestyle',
      title: '高血壓 S-ABCDE 原則',
      category: '心臟血管科',
      content: `【高血壓 S-ABCDE 控制原則】
S (Sodium)：限鹽。每日鹽分攝取<6克 (鈉<2400mg)。少沾醬、少喝湯。
A (Alcohol)：限酒。男性<2份/日，女性<1份/日。
B (Body weight)：減重。維持BMI 18.5-24。
C (Cigarette)：戒菸。吸菸會導致血管硬化與血壓暫時上升。
D (Diet)：DASH飲食。高鉀、高鎂、高鈣、高纖、低脂。
E (Exercise)：運動。每週5天，每次30分鐘有氧運動。`
    },
    {
      id: 'hf-care',
      title: '心衰竭照護 (Heart Failure)',
      category: '心臟血管科',
      content: `【心衰竭居家照護】
1. 每日量體重：建議早上起床排尿後測量。若一天增加 >1kg 或三天 >2kg，可能有水腫，需回診。
2. 限制水分與鹽分：每日飲水總量(含湯、茶、果汁)通常限制在 1000-1500cc (依醫囑)。口味需清淡。
3. 觀察症狀：是否有呼吸喘、端坐呼吸(躺平更喘)、下肢水腫加劇。
4. 規律服藥：利尿劑盡量於白天服用，避免夜尿影響睡眠。`
    },
    {
      id: 'anticoagulant',
      title: '抗凝血劑服用須知 (Warfarin/NOAC)',
      category: '心臟血管科',
      content: `【服用抗凝血劑注意事項】
1. 出血觀察：刷牙流血不止、瘀青擴大、黑便、血尿，請立即回診。
2. 飲食交互作用 (Warfarin)：避免突然大量攝取深綠色蔬菜(維生素K)、蔓越莓汁或銀杏、當歸等活血中藥。NOAC類受飲食影響較小。
3. 手術/拔牙前：務必告知醫師您正在服用抗凝血劑，依指示停藥。
4. 勿擅自停藥：以免增加中風風險。`
    },

    // --- 腎臟科 ---
    {
      id: 'ckd-diet',
      title: '慢性腎臟病飲食 (CKD Diet)',
      category: '腎臟科',
      content: `【慢性腎臟病(CKD) 低蛋白飲食原則】
1. 優質蛋白：蛋白質攝取需減量，但以「高生理價」為主(魚、肉、蛋、豆製品)。避免麵筋、麵腸等低品質蛋白。
2. 熱量要足夠：熱量不足會消耗肌肉，反而增加腎臟負擔。可補充低蛋白澱粉(冬粉、米粉、太白粉)。
3. 限磷：避免加工食品(火鍋料、香腸)、內臟、堅果、可樂、起司。
4. 限鉀 (晚期/高血鉀者)：蔬菜燙過再炒、不喝菜湯/肉湯、避免高鉀水果(香蕉、番茄、奇異果)。楊桃含有神經毒素，絕對禁止食用。`
    },
    {
      id: 'urine-collect',
      title: '24小時尿液收集須知',
      category: '腎臟科',
      content: `【24小時尿液收集方法】
1. 早上第一泡尿「解掉不留」，並記錄時間 (例如 8:00)。
2. 之後每一次尿液都要收集在桶子裡。
3. 直到隔天早上同一時間 (8:00) 解最後一泡尿，並收集進桶子。
4. 收集期間尿桶請置於陰涼處。
5. 收集完畢後，搖勻取檢體管送檢，或整桶送回檢驗科 (依醫院規定)。`
    },

    // --- 肝膽腸胃 ---
    {
      id: 'fatty-liver',
      title: '脂肪肝衛教 (Fatty Liver)',
      category: '肝膽腸胃科',
      content: `【脂肪肝改善計畫】
1. 減重是關鍵：減輕體重 5-10% 可顯著改善肝發炎與纖維化。
2. 減少精緻糖：手搖飲(果糖)是造成脂肪肝的主因之一，請戒除。
3. 減少酒精：酒精會加速肝臟脂肪堆積。
4. 運動：每週 150 分鐘中等強度運動。
5. 目前尚無特效藥可完全治癒脂肪肝，生活型態改變是唯一證實有效的治療。`
    },
    {
      id: 'gerd',
      title: '胃食道逆流 (GERD)',
      category: '肝膽腸胃科',
      content: `【胃食道逆流生活調整】
1. 少量多餐，避免暴飲暴食。吃飯細嚼慢嚥。
2. 避免刺激性食物：咖啡、濃茶、巧克力、甜食、薄荷、辛辣、酸性水果。
3. 飯後 2-3 小時內不要平躺。睡前 3 小時不要進食。
4. 睡覺時可將枕頭墊高 (墊高頭胸部，而非僅墊頭)。
5. 穿著寬鬆衣物，避免增加腹壓。戒菸酒。`
    },

    // --- 胸腔科 ---
    {
      id: 'asthma-inhaler',
      title: '氣喘吸入器使用觀念',
      category: '胸腔科',
      content: `【氣喘吸入器重要觀念】
1. 區分藥物：清楚知道哪支是「保養(類固醇/長效擴張劑)」需天天吸；哪支是「救急(短效擴張劑)」有症狀才吸。
2. 含類固醇藥物：吸完務必「漱口」並吐掉，預防鵝口瘡與聲音沙啞。
3. 吸藥技巧：
   - 吐氣到底。
   - 含住吸嘴，深吸氣(乾粉需快而深；噴霧需慢而深)。
   - 閉氣 5-10 秒。
4. 記錄症狀：若每週需使用救急藥物超過 2 次，代表氣喘控制不佳，需回診調整藥物。`
    },

    // --- 身心科 ---
    {
      id: 'sleep-hygiene',
      title: '睡眠衛生 (Sleep Hygiene)',
      category: '身心科',
      content: `【一夜好眠的秘訣】
1. 規律作息：每日固定時間起床，即使假日也不要補眠超過 1 小時。
2. 光線調節：白天多曬太陽，晚上睡前 1 小時調暗燈光，避開手機藍光。
3. 咖啡因：中午過後避免茶、咖啡、可樂。
4. 床的制約：床只留給睡覺。若躺床 20 分鐘睡不著，請離開臥室做些放鬆的事(如閱讀、聽輕音樂)，有睡意再回床上。
5. 避免睡前飲酒：酒精雖然助眠，但會破壞睡眠結構，導致早醒與淺眠。`
    },

    // --- 兒科/其他 ---
    {
      id: 'fever-care',
      title: '兒童發燒照護 (Pediatric Fever)',
      category: '小兒/家醫科',
      content: `【兒童發燒居家照護】
1. 發燒定義：耳溫/肛溫 ≥ 38°C。發燒是身體對抗病毒的反應，主要目標是讓孩子舒服，而非一定要退燒到正常值。
2. 護理方式：
   - 發冷期(手腳冰冷、顫抖)：添加衣服保暖。
   - 發熱期(手腳溫熱、流汗)：減少衣物，保持通風，多喝水。
3. 藥物使用：
   - 體溫 > 38.5°C 且孩子不舒服時，可使用退燒藥。
   - 兩次退燒藥需間隔 4-6 小時。
4. 危險徵兆(需立即就醫)：
   - 3個月以下嬰兒發燒。
   - 意識不清、抽搐、持續嘔吐。
   - 呼吸急促或困難。
   - 退燒後活動力仍極差。`
    }
  ];

  const filteredTemplates = allTemplates.filter(tpl => 
    tpl.title.includes(searchTerm) || 
    tpl.content.includes(searchTerm) ||
    tpl.category.includes(searchTerm)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">臨床衛教指引庫 (Guidelines)</h1>
        <p className="text-slate-500">包含常見慢性病飲食、生活照護與用藥指導。</p>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
        </div>
        <input 
            type="text"
            placeholder="搜尋衛教單張 (如: 糖尿病, 痛風, 發燒)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 font-bold text-black"
        />
      </div>

      <div className="grid gap-6">
        {filteredTemplates.length > 0 ? (
            filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <span className="text-xs font-black text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{tpl.category}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{tpl.title}</h3>
                </div>
                <button 
                    onClick={() => handleCopy(tpl.id, tpl.content)}
                    className={`flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all border shadow-sm ${copiedId === tpl.id ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-black'}`}
                >
                    {copiedId === tpl.id ? <Check size={18} className="mr-1.5" /> : <Copy size={18} className="mr-1.5" />}
                    {copiedId === tpl.id ? '已複製' : '複製'}
                </button>
                </div>
                <div className="p-5 bg-white">
                    <pre className="font-sans text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                        {tpl.content}
                    </pre>
                </div>
            </div>
            ))
        ) : (
            <div className="text-center py-12 text-slate-500 font-bold">
                沒有找到符合的衛教單張。
            </div>
        )}
      </div>
    </div>
  );
};

export default Guidelines;