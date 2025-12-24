import React, { useState, useEffect } from 'react';
import { MetaRiskInput, MetaRiskResult, MetaRiskLevel } from '../../types';
import { calculateMetaRiskV4 } from '../../utils/calculations';
import { InputGroup, NumberInput, Toggle, Checkbox } from './Shared';
import { Activity, Scale, Check, AlertTriangle, Copy, Brain } from 'lucide-react';

// Move SectionTitle outside component to fix TS errors and avoid re-declaration
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-black text-teal-800 mb-4 border-b border-teal-100 pb-2">{children}</h3>
);

export const MetaRiskCalculator: React.FC = () => {
    const [step, setStep] = useState(1); 
    const [input, setInput] = useState<MetaRiskInput>({
        age: 45, gender: 'male', 
        hasDiabetes: false, hasHypertension: false, hasHeartDisease: false, hasStroke: false,
        fhDiabetes: false, fhHeart: false, fhStroke: false, isSmoker: false,
        onHypertensionMeds: false, onDiabetesMeds: false, onLipidMeds: false
    });
    const [result, setResult] = useState<MetaRiskResult | null>(null);

    useEffect(() => {
        setResult(calculateMetaRiskV4(input));
    }, [input]);

    const handleChange = (field: keyof MetaRiskInput, value: any) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    const renderRiskCard = (risk: any, colorClass: string) => {
        const levelColors: Record<MetaRiskLevel, string> = {
            LOW: 'bg-green-100 text-green-800 border-green-200',
            MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
            VERY_HIGH: 'bg-red-100 text-red-800 border-red-200'
        };
        const levelText: Record<MetaRiskLevel, string> = {
            LOW: '低風險 (Low)', MEDIUM: '中風險 (Medium)', HIGH: '高風險 (High)', VERY_HIGH: '極高風險 (Very High)'
        };

        return (
            <div className={`p-4 rounded-lg border-2 ${colorClass} mb-4`}>
                <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-lg">{risk.name}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${levelColors[risk.level]}`}>{levelText[risk.level]}</span>
                </div>
                <div className="mb-2">
                    <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                        <div className="h-full bg-current opacity-60" style={{width: `${risk.score}%`}}></div>
                    </div>
                    <div className="text-right text-xs font-bold mt-1">{risk.score} / 100 分</div>
                </div>
                {risk.factors.length > 0 && (
                    <div className="text-sm mt-2">
                        <p className="font-bold opacity-70 mb-1">危險因子:</p>
                        <ul className="list-disc list-inside opacity-90 text-xs space-y-0.5">
                            {risk.factors.map((f: string, i: number) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const renderMetabolicCard = (status: any) => {
        const isMet = status.isMetabolicSyndrome;
        return (
            <div className={`p-4 rounded-lg border-2 mb-4 ${isMet ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
                <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-lg flex items-center gap-2"><Scale size={20}/> 代謝症候群判定</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${isMet ? 'bg-rose-100 border-rose-200 text-rose-800' : 'bg-emerald-100 border-emerald-200 text-emerald-800'}`}>
                        {isMet ? '符合診斷 (Positive)' : '未符合 (Negative)'}
                    </span>
                </div>
                <div className="text-sm font-bold mb-3">
                    符合項目： {status.criteriaMet} / 5 項
                    {isMet && <span className="text-rose-600 ml-2">(≥3項即確診)</span>}
                </div>
                <ul className="space-y-1 text-sm">
                    <li className={`flex items-center justify-between ${status.details.waist ? 'text-rose-700 font-bold' : 'opacity-60'}`}>
                        <span>1. 腹部肥胖 (腰圍 M&ge;90, F&ge;80)</span>
                        {status.details.waist ? <Check size={16} /> : <span className="text-xs">-</span>}
                    </li>
                    <li className={`flex items-center justify-between ${status.details.bp ? 'text-rose-700 font-bold' : 'opacity-60'}`}>
                        <span>2. 血壓偏高 (SBP&ge;130/DBP&ge;85)</span>
                        {status.details.bp ? <Check size={16} /> : <span className="text-xs">-</span>}
                    </li>
                    <li className={`flex items-center justify-between ${status.details.glucose ? 'text-rose-700 font-bold' : 'opacity-60'}`}>
                        <span>3. 空腹血糖偏高 (AC&ge;100)</span>
                        {status.details.glucose ? <Check size={16} /> : <span className="text-xs">-</span>}
                    </li>
                    <li className={`flex items-center justify-between ${status.details.tg ? 'text-rose-700 font-bold' : 'opacity-60'}`}>
                        <span>4. 三酸甘油酯偏高 (TG&ge;150)</span>
                        {status.details.tg ? <Check size={16} /> : <span className="text-xs">-</span>}
                    </li>
                    <li className={`flex items-center justify-between ${status.details.hdl ? 'text-rose-700 font-bold' : 'opacity-60'}`}>
                        <span>5. HDL膽固醇偏低 (M&lt;40, F&lt;50)</span>
                        {status.details.hdl ? <Check size={16} /> : <span className="text-xs">-</span>}
                    </li>
                </ul>
                {status.missingValues.length > 0 && (
                    <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 flex items-start gap-1">
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                        <span>未填寫: {status.missingValues.join(', ')}，假設為正常。</span>
                    </div>
                )}
            </div>
        );
    };

    const copyText = result ? `[Meta Risk V4 & MetS Assessment]
Metabolic Syndrome: ${result.metabolicStatus.isMetabolicSyndrome ? 'YES' : 'NO'} (${result.metabolicStatus.criteriaMet}/5)
Overall Risk Score: ${result.overallScore}/100 (${result.overallLevel})
- DM Risk: ${result.risks.diabetes.level}
- HTN Risk: ${result.risks.hypertension.level}
- Stroke Risk: ${result.risks.stroke.level}
- CVD Risk: ${result.risks.cvd.level}
Recs: ${result.generalRecommendations.join(', ')}` : '';

    return (
        <div className="max-w-4xl mx-auto">
             {/* Tabs */}
             <div className="flex mb-6 bg-slate-100 p-1 rounded-lg border border-slate-200">
                 {[1,2,3].map(s => (
                     <button key={s} onClick={() => setStep(s)} className={`flex-1 py-2 text-sm font-bold rounded transition-all ${step === s ? 'bg-white text-teal-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
                         {s === 1 ? '1. 基本與生理' : s === 2 ? '2. 檢驗數值' : '3. 病史與習慣'}
                     </button>
                 ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-left-4">
                            <SectionTitle>基本資料 & 生理數值</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="性別"><Toggle options={[{value:'male', label:'男'}, {value:'female', label:'女'}]} value={input.gender} onChange={v => handleChange('gender', v)} /></InputGroup>
                                <InputGroup label="年齡"><NumberInput value={input.age} onChange={v => handleChange('age', v)} /></InputGroup>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="身高 (cm)"><NumberInput value={input.height||''} onChange={v => handleChange('height', v)} /></InputGroup>
                                <InputGroup label="體重 (kg)"><NumberInput value={input.weight||''} onChange={v => handleChange('weight', v)} /></InputGroup>
                            </div>
                            <InputGroup label="腰圍 (cm) *代謝症候群指標">
                                <NumberInput value={input.waist||''} onChange={v => handleChange('waist', v)} placeholder="男≥90, 女≥80 異常" />
                            </InputGroup>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="收縮壓 SBP"><NumberInput value={input.sbp||''} onChange={v => handleChange('sbp', v)} /></InputGroup>
                                <InputGroup label="舒張壓 DBP"><NumberInput value={input.dbp||''} onChange={v => handleChange('dbp', v)} /></InputGroup>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-left-4">
                            <SectionTitle>實驗室檢驗數值 (Labs)</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="空腹血糖 (AC)"><NumberInput value={input.fastingGlucose||''} onChange={v => handleChange('fastingGlucose', v)} placeholder="mg/dL" /></InputGroup>
                                <InputGroup label="HbA1c"><NumberInput value={input.hba1c||''} onChange={v => handleChange('hba1c', v)} step="0.1" placeholder="%" /></InputGroup>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="總膽固醇 (TC)"><NumberInput value={input.tc||''} onChange={v => handleChange('tc', v)} placeholder="mg/dL" /></InputGroup>
                                <InputGroup label="三酸甘油 (TG)"><NumberInput value={input.tg||''} onChange={v => handleChange('tg', v)} placeholder="mg/dL" /></InputGroup>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="LDL-C"><NumberInput value={input.ldl||''} onChange={v => handleChange('ldl', v)} placeholder="mg/dL" /></InputGroup>
                                <InputGroup label="HDL-C"><NumberInput value={input.hdl||''} onChange={v => handleChange('hdl', v)} placeholder="mg/dL" /></InputGroup>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-left-4">
                            <SectionTitle>個人病史 & 家族史</SectionTitle>
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <Checkbox label="糖尿病史" checked={input.hasDiabetes} onChange={v => handleChange('hasDiabetes', v)} />
                                <Checkbox label="高血壓史" checked={input.hasHypertension} onChange={v => handleChange('hasHypertension', v)} />
                                <Checkbox label="心臟病史" checked={input.hasHeartDisease} onChange={v => handleChange('hasHeartDisease', v)} />
                                <Checkbox label="中風病史" checked={input.hasStroke} onChange={v => handleChange('hasStroke', v)} />
                            </div>

                            <h4 className="font-bold text-slate-700 mb-2 text-sm">藥物治療中? (影響代謝症候群判定)</h4>
                            <div className="grid grid-cols-1 gap-2 mb-6">
                                <Checkbox label="服用高血壓藥物" checked={input.onHypertensionMeds||false} onChange={v => handleChange('onHypertensionMeds', v)} />
                                <Checkbox label="服用糖尿病藥物" checked={input.onDiabetesMeds||false} onChange={v => handleChange('onDiabetesMeds', v)} />
                                <Checkbox label="服用降血脂藥物" checked={input.onLipidMeds||false} onChange={v => handleChange('onLipidMeds', v)} />
                            </div>
                            
                            <h4 className="font-bold text-slate-700 mb-2">家族史 (直系血親)</h4>
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <Checkbox label="糖尿病" checked={input.fhDiabetes} onChange={v => handleChange('fhDiabetes', v)} />
                                <Checkbox label="心臟病" checked={input.fhHeart} onChange={v => handleChange('fhHeart', v)} />
                                <Checkbox label="中風" checked={input.fhStroke} onChange={v => handleChange('fhStroke', v)} />
                            </div>

                            <SectionTitle>生活型態</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Checkbox label="目前吸菸?" checked={input.isSmoker} onChange={v => handleChange('isSmoker', v)} />
                                    {input.isSmoker && <InputGroup label="菸齡 (年)"><NumberInput value={input.smokeYears||''} onChange={v => handleChange('smokeYears', v)} /></InputGroup>}
                                </div>
                                <InputGroup label="飲酒 (份/週)">
                                    <NumberInput value={input.alcoholWeekly||''} onChange={v => handleChange('alcoholWeekly', v)} placeholder="1份=1罐啤酒" />
                                </InputGroup>
                            </div>
                            <InputGroup label="每週運動時間 (分鐘)">
                                <NumberInput value={input.exerciseMins||''} onChange={v => handleChange('exerciseMins', v)} placeholder="中等強度以上" />
                            </InputGroup>
                        </div>
                    )}
                </div>

                {/* Result Dashboard */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner h-fit">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="text-teal-600" /> 風險評估報告 (Dashboard)
                    </h2>

                    {result && (
                        <>
                            {/* Metabolic Syndrome Section */}
                            {renderMetabolicCard(result.metabolicStatus)}

                            <div className="mb-8 text-center pt-4 border-t border-slate-200">
                                <div className="text-sm font-bold text-slate-500 uppercase mb-1">綜合慢性病風險分數 (10年)</div>
                                <div className={`text-5xl font-black ${result.overallScore > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {result.overallScore}
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${
                                    result.overallLevel === 'VERY_HIGH' ? 'bg-rose-100 text-rose-800' :
                                    result.overallLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                    result.overallLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-emerald-100 text-emerald-800'
                                }`}>
                                    {result.overallLevel === 'LOW' ? '低風險' : result.overallLevel === 'MEDIUM' ? '中風險' : result.overallLevel === 'HIGH' ? '高風險' : '極高風險'}
                                </div>
                            </div>

                            {renderRiskCard(result.risks.diabetes, 'border-blue-200 bg-blue-50 text-blue-900')}
                            {renderRiskCard(result.risks.hypertension, 'border-indigo-200 bg-indigo-50 text-indigo-900')}
                            {renderRiskCard(result.risks.stroke, 'border-purple-200 bg-purple-50 text-purple-900')}
                            {renderRiskCard(result.risks.cvd, 'border-rose-200 bg-rose-50 text-rose-900')}

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><Brain size={18}/> 綜合建議</h3>
                                <ul className="space-y-2">
                                    {result.generalRecommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm font-bold text-slate-700">
                                            <Check size={16} className="text-teal-600 mt-0.5 flex-shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(copyText)}
                                    className="w-full mt-4 py-3 bg-slate-800 hover:bg-black text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Copy size={18} /> 複製完整報告 (Copy Full Report)
                                </button>
                            </div>
                        </>
                    )}
                </div>
             </div>
        </div>
    );
}