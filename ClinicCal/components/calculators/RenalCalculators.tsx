import React, { useState, useEffect } from 'react';
import { CalculatorResult } from '../../types';
import { 
    calculateEGFR_CKDEPI, calculateEGFR_MDRD, 
    calculateUACR_Detailed, calculateTTKR, calculateUKCR,
    calculateCorrectedCalcium, calculateOsmolality 
} from '../../utils/calculations';
import { ResultCard, InputGroup, NumberInput, Toggle, formatEMR } from './Shared';

export const EGFRCalculator: React.FC = () => {
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [scr, setScr] = useState<number | ''>('');
  const [resultCKDEPI, setResultCKDEPI] = useState<any>(null);
  const [resultMDRD, setResultMDRD] = useState<number | null>(null);

  useEffect(() => {
    if (age && scr) {
        setResultCKDEPI(calculateEGFR_CKDEPI(Number(age), gender, Number(scr)));
        setResultMDRD(calculateEGFR_MDRD(Number(age), gender, Number(scr)));
    } else {
        setResultCKDEPI(null);
        setResultMDRD(null);
    }
  }, [age, gender, scr]);

  const copyText = formatEMR('eGFR (CKD-EPI)', `${gender}, Age ${age}, Scr ${scr}`, resultCKDEPI) + (resultMDRD ? `\n(MDRD: ${resultMDRD})` : '');
  return (
    <div className="max-w-md">
      <InputGroup label="性別 (Gender)">
         <Toggle options={[{value: 'male', label: '男性 Male'}, {value: 'female', label: '女性 Female'}]} value={gender} onChange={setGender} />
      </InputGroup>
      <InputGroup label="年齡 (Age)">
        <NumberInput value={age} onChange={setAge} placeholder="例如：65" />
      </InputGroup>
      <InputGroup label="血清肌酸酐 (Scr, mg/dL)">
        <NumberInput value={scr} onChange={setScr} step="0.1" placeholder="例如：1.2" />
      </InputGroup>
      {resultCKDEPI && (
          <>
            <ResultCard title="eGFR (CKD-EPI)" result={resultCKDEPI} copyContent={copyText} />
            <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-300">
                <p className="text-xs text-slate-600 font-black uppercase mb-1">參考數值 Reference</p>
                <p className="text-sm text-black font-bold">MDRD: <span className="font-mono font-black text-lg ml-2 text-black">{resultMDRD}</span> ml/min</p>
            </div>
          </>
      )}
    </div>
  );
};

export const UACRCalculator: React.FC = () => { const [ua, setUa] = useState<number | ''>(''); const [uaUnit, setUaUnit] = useState<'mg/dL'|'mg/L'>('mg/dL'); const [ucr, setUcr] = useState<number | ''>(''); const [ucrUnit, setUcrUnit] = useState<'mg/dL'|'mmol/L'>('mg/dL'); const [result, setResult] = useState<CalculatorResult | null>(null); useEffect(() => { if (ua && ucr) setResult(calculateUACR_Detailed(Number(ua), uaUnit, Number(ucr), ucrUnit)); else setResult(null); }, [ua, uaUnit, ucr, ucrUnit]); const copyText = formatEMR('UACR', `U-Alb ${ua} ${uaUnit}, U-Cre ${ucr} ${ucrUnit}`, result); return ( <div className="max-w-md space-y-6"> <div className="p-4 bg-blue-50 rounded-lg text-base text-blue-900 font-bold mb-4 border border-blue-200">請輸入單次尿液檢體數值 (Spot Urine)</div> <div> <div className="flex justify-between mb-2"><label className="text-base font-bold text-black">Urine Albumin</label><select value={uaUnit} onChange={e => setUaUnit(e.target.value as any)} className="text-sm border-2 border-slate-300 rounded px-2 py-1 bg-white font-bold text-black"><option value="mg/dL">mg/dL</option><option value="mg/L">mg/L</option></select></div> <NumberInput value={ua} onChange={setUa} /> </div> <div> <div className="flex justify-between mb-2"><label className="text-base font-bold text-black">Urine Creatinine</label><select value={ucrUnit} onChange={e => setUcrUnit(e.target.value as any)} className="text-sm border-2 border-slate-300 rounded px-2 py-1 bg-white font-bold text-black"><option value="mg/dL">mg/dL</option><option value="mmol/L">mmol/L</option></select></div> <NumberInput value={ucr} onChange={setUcr} /> </div> <ResultCard title="UACR" result={result} copyContent={copyText} /> </div> ) }

export const ElectrolyteCalculator: React.FC = () => { const [mode, setMode] = useState<'ttkr'|'ukcr'>('ttkr'); const [uk, setUk] = useState<number | ''>(''); const [pk, setPk] = useState<number | ''>(''); const [uosm, setUosm] = useState<number | ''>(''); const [posm, setPosm] = useState<number | ''>(''); const [ukcr_uk, setUkcrUk] = useState<number | ''>(''); const [ukcr_ucr, setUkcrUcr] = useState<number | ''>(''); const [ukcr_unit, setUkcrUnit] = useState<'mg/dL'|'mmol/L'>('mg/dL'); const [result, setResult] = useState<CalculatorResult | null>(null); useEffect(() => { if (mode === 'ttkr') { if (uk && pk && uosm && posm) setResult(calculateTTKR(Number(uk), Number(pk), Number(uosm), Number(posm))); else setResult(null); } else { if (ukcr_uk && ukcr_ucr) setResult(calculateUKCR(Number(ukcr_uk), Number(ukcr_ucr), ukcr_unit)); else setResult(null); } }, [mode, uk, pk, uosm, posm, ukcr_uk, ukcr_ucr, ukcr_unit]); const inputs = mode === 'ttkr' ? `U_K ${uk}, P_K ${pk}, U_Osm ${uosm}, P_Osm ${posm}` : `U_K ${ukcr_uk}, U_Cr ${ukcr_ucr} ${ukcr_unit}`; const copyText = formatEMR(mode === 'ttkr' ? 'TTKR' : 'UKCR', inputs, result); return ( <div className="max-w-md"> <div className="mb-6"><Toggle options={[{value: 'ttkr', label: 'TTKR'}, {value: 'ukcr', label: 'UKCR'}]} value={mode} onChange={setMode} /></div> {mode === 'ttkr' ? ( <div className="grid grid-cols-2 gap-4"><InputGroup label="Urine K"><NumberInput value={uk} onChange={setUk} /></InputGroup><InputGroup label="Plasma K"><NumberInput value={pk} onChange={setPk} /></InputGroup><InputGroup label="Urine Osm"><NumberInput value={uosm} onChange={setUosm} /></InputGroup><InputGroup label="Plasma Osm"><NumberInput value={posm} onChange={setPosm} /></InputGroup></div> ) : ( <div className="space-y-4"><InputGroup label="Urine K"><NumberInput value={ukcr_uk} onChange={setUkcrUk} /></InputGroup><div><div className="flex justify-between mb-2"><label className="text-base font-bold text-black">Urine Cr</label><select value={ukcr_unit} onChange={e => setUkcrUnit(e.target.value as any)} className="text-sm border-2 border-slate-300 rounded px-2 py-1 bg-white font-bold text-black"><option value="mg/dL">mg/dL</option><option value="mmol/L">mmol/L</option></select></div><NumberInput value={ukcr_ucr} onChange={setUkcrUcr} /></div></div> )} <ResultCard title={mode.toUpperCase()} result={result} copyContent={copyText} /> </div> ) }

export const CorrectedCalciumCalculator: React.FC = () => { const [ca, setCa] = useState<number|''>(''); const [alb, setAlb] = useState<number|''>(''); const [result, setResult] = useState<CalculatorResult|null>(null); useEffect(() => { if(ca && alb) setResult(calculateCorrectedCalcium(Number(ca), Number(alb))); else setResult(null); }, [ca, alb]); const copyText = formatEMR('Corrected Ca', `Ca ${ca}, Alb ${alb}`, result); return (<div className="max-w-md grid grid-cols-2 gap-4"><InputGroup label="總鈣 (Total Ca)"><NumberInput value={ca} onChange={setCa} placeholder="mg/dL" /></InputGroup><InputGroup label="白蛋白 (Albumin)"><NumberInput value={alb} onChange={setAlb} placeholder="g/dL" /></InputGroup><div className="col-span-2"><ResultCard title="Corrected Calcium" result={result} copyContent={copyText} /></div></div>); };

export const OsmolalityCalculator: React.FC = () => { const [na, setNa] = useState<number|''>(''); const [glu, setGlu] = useState<number|''>(''); const [bun, setBun] = useState<number|''>(''); const [result, setResult] = useState<CalculatorResult|null>(null); useEffect(() => { if(na && glu && bun) setResult(calculateOsmolality(Number(na), Number(glu), Number(bun))); else setResult(null); }, [na, glu, bun]); const copyText = formatEMR('Osmolality', `Na ${na}, Glu ${glu}, BUN ${bun}`, result); return (<div className="max-w-md grid grid-cols-1 gap-4"><InputGroup label="血鈉 (Na)"><NumberInput value={na} onChange={setNa} placeholder="mEq/L" /></InputGroup><div className="grid grid-cols-2 gap-4"><InputGroup label="血糖 (Glucose)"><NumberInput value={glu} onChange={setGlu} placeholder="mg/dL" /></InputGroup><InputGroup label="BUN"><NumberInput value={bun} onChange={setBun} placeholder="mg/dL" /></InputGroup></div><ResultCard title="Serum Osmolality" result={result} copyContent={copyText} /></div>); };
