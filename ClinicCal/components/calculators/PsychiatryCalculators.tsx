import React, { useState, useEffect } from 'react';
import { CalculatorResult } from '../../types';
import { 
    calculatePHQ9, calculateGAD7, calculateISI, 
    calculateBSRS5, calculateGDS15, calculateFagerstrom
} from '../../utils/calculations';
import { ResultCard, formatEMR } from './Shared';
import { AlertTriangle } from 'lucide-react';

export const PHQ9Calculator: React.FC = () => { const [answers, setAnswers] = useState<number[]>(new Array(9).fill(0)); const [result, setResult] = useState<CalculatorResult | null>(null); const questions = ["1. 做事時提不起勁或沒有興趣", "2. 感到心情低落、沮喪或絕望", "3. 入睡困難、睡不安穩或睡眠過多", "4. 感覺疲倦或沒有活力", "5. 食慾不振或吃太多", "6. 覺得自己很差勁", "7. 對事物專注有困難", "8. 動作說話緩慢或煩躁", "9. 有想傷害自己的念頭"]; useEffect(() => setResult(calculatePHQ9(answers)), [answers]); const copyText = formatEMR('PHQ-9', `Scores: [${answers.join(', ')}]`, result); return ( <div className="max-w-2xl space-y-5"> {questions.map((q, idx) => ( <div key={idx} className="bg-white p-5 rounded-lg border-2 border-slate-200 shadow-sm"> <p className="font-bold text-black text-base mb-3">{q}</p> <div className="grid grid-cols-4 gap-2"> {["0", "1", "2", "3"].map((opt, val) => ( <button key={val} onClick={() => {const n=[...answers]; n[idx]=val; setAnswers(n)}} className={`py-3 text-sm font-bold rounded border-2 ${answers[idx] === val ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-300 text-black hover:bg-slate-50'}`}> {val === 0 ? '完全不會' : val === 1 ? '幾天' : val === 2 ? '一半以上' : '幾乎每天'} </button> ))} </div> </div> ))} <ResultCard title="PHQ-9" result={result} copyContent={copyText} /> </div> ); };

export const GAD7Calculator: React.FC = () => { const [scores, setScores] = useState<number[]>(new Array(7).fill(0)); const [result, setResult] = useState<CalculatorResult|null>(null); useEffect(() => setResult(calculateGAD7(scores)), [scores]); const questions = ["1. 感覺緊張、焦慮或煩躁", "2. 覺得無法停止或無法控制憂慮", "3. 對各種事情擔憂過多", "4. 難以放鬆", "5. 坐立難安", "6. 容易心煩或易怒", "7. 感到害怕"]; const copyText = formatEMR('GAD-7', `Scores: [${scores.join(', ')}]`, result); return ( <div className="max-w-2xl space-y-5"> {questions.map((q, idx) => ( <div key={idx} className="bg-white p-5 rounded-lg border-2 border-slate-200 shadow-sm"> <p className="font-bold text-black text-base mb-3">{q}</p> <div className="grid grid-cols-4 gap-2"> {["完全不會(0)", "幾天(1)", "一半以上(2)", "幾乎每天(3)"].map((txt, v) => ( <button key={v} onClick={() => { const ns = [...scores]; ns[idx] = v; setScores(ns); }} className={`py-3 text-sm font-bold rounded border-2 ${scores[idx] === v ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-300 text-black hover:bg-slate-50'}`}>{txt}</button> ))} </div> </div> ))} <ResultCard title="GAD-7" result={result} copyContent={copyText} /> </div> ) }

export const ISICalculator: React.FC = () => { const [scores, setScores] = useState<number[]>(new Array(7).fill(0)); const [result, setResult] = useState<CalculatorResult|null>(null); useEffect(() => setResult(calculateISI(scores)), [scores]); const copyText = formatEMR('ISI', `Scores: [${scores.join(', ')}]`, result); const questions = ["1. 入睡困難", "2. 維持睡眠困難", "3. 太早醒來", "4. 對睡眠模式的滿意度", "5. 睡眠問題干擾日常生活", "6. 他人注意到你的睡眠問題", "7. 對睡眠問題感到困擾"]; return ( <div className="max-w-2xl space-y-5"> {questions.map((q, idx) => ( <div key={idx} className="bg-white p-5 rounded-lg border-2 border-slate-200 shadow-sm"> <p className="font-bold text-black text-base mb-3">{q}</p> <div className="grid grid-cols-5 gap-2"> {[0,1,2,3,4].map((v) => ( <button key={v} onClick={() => { const ns = [...scores]; ns[idx] = v; setScores(ns); }} className={`py-3 text-sm font-bold rounded border-2 ${scores[idx] === v ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-300 text-black hover:bg-slate-50'}`}> {v} </button> ))} </div> </div> ))} <ResultCard title="ISI" result={result} copyContent={copyText} /> </div> ) }

export const BSRS5Calculator: React.FC = () => {
    const [scores, setScores] = useState<number[]>(new Array(5).fill(0));
    const [suicideScore, setSuicideScore] = useState(0);
    const [result, setResult] = useState<CalculatorResult | null>(null);

    useEffect(() => setResult(calculateBSRS5(scores, suicideScore)), [scores, suicideScore]);

    const questions = [
        "1. 感覺緊張或心神不寧",
        "2. 覺得容易苦惱或動怒",
        "3. 感覺憂鬱、心情低落",
        "4. 覺得比不上別人",
        "5. 睡眠困難 (難入睡/易醒/早醒)"
    ];
    
    const copyText = formatEMR('BSRS-5', `Scores: [${scores.join(', ')}], Suicide: ${suicideScore}`, result);

    return (
        <div className="max-w-2xl space-y-5">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border-2 border-slate-200 shadow-sm">
                    <p className="font-bold text-black text-base mb-3">{q}</p>
                    <div className="grid grid-cols-5 gap-2">
                        {["完全沒有(0)", "輕微(1)", "中等程度(2)", "厲害(3)", "非常厲害(4)"].map((txt, v) => (
                            <button key={v} onClick={() => { const ns = [...scores]; ns[idx] = v; setScores(ns); }} className={`py-3 text-xs font-bold rounded border-2 ${scores[idx] === v ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-300 text-black hover:bg-slate-50'}`}>{txt}</button>
                        ))}
                    </div>
                </div>
            ))}
            
            <div className="bg-white p-5 rounded-lg border-2 border-rose-200 shadow-sm">
                <p className="font-black text-rose-900 text-base mb-3 flex items-center gap-2"><AlertTriangle size={20}/> *6. 您最近一週內是否有自殺的想法？</p>
                <div className="grid grid-cols-5 gap-2">
                    {["完全沒有(0)", "輕微(1)", "中等程度(2)", "厲害(3)", "非常厲害(4)"].map((txt, v) => (
                        <button key={v} onClick={() => setSuicideScore(v)} className={`py-3 text-xs font-bold rounded border-2 ${suicideScore === v ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-slate-300 text-black hover:bg-slate-50'}`}>{txt}</button>
                    ))}
                </div>
            </div>

            <ResultCard title="BSRS-5 心情溫度計" result={result} copyContent={copyText} />
        </div>
    );
};

export const GDS15Calculator: React.FC = () => {
    const [answers, setAnswers] = useState<boolean[]>(new Array(15).fill(false)); 
    const [result, setResult] = useState<CalculatorResult | null>(null);

    useEffect(() => setResult(calculateGDS15(answers)), [answers]);

    const questions = [
        "1. 你對生活基本上滿意嗎？ (答否得1分)",
        "2. 你是否放棄了許多活動和興趣？ (答是得1分)",
        "3. 你是否覺得生命很空虛？ (答是得1分)",
        "4. 你是否常感到厭煩？ (答是得1分)",
        "5. 你是否大部份時間精神都很好？ (答否得1分)",
        "6. 你是否害怕將有不幸的事發生在你身上？ (答是得1分)",
        "7. 你是否大部份時間都感到快樂？ (答否得1分)",
        "8. 你是否常感到無助？ (答是得1分)",
        "9. 你是否比較喜歡待在家裡，而不喜歡出外做些新事物？ (答是得1分)",
        "10. 你是否覺得記憶力比以前差？ (答是得1分)",
        "11. 你是否覺得現在活著很美好？ (答否得1分)",
        "12. 你是否覺得現在的自己沒有價值？ (答是得1分)",
        "13. 你是否覺得精力充沛？ (答否得1分)",
        "14. 你是否覺得自己的處境無望？ (答是得1分)",
        "15. 你是否覺得大部份人的情況比你好？ (答是得1分)"
    ];

    const copyText = formatEMR('GDS-15', `Score: ${result?.value}`, result);

    return (
        <div className="max-w-2xl space-y-4">
            {questions.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-lg">
                    <span className="font-bold text-black text-base mr-4 flex-1">{q}</span>
                    <div className="flex gap-2">
                        <button onClick={() => { const ns = [...answers]; ns[idx] = true; setAnswers(ns); }} className={`px-4 py-2 rounded font-bold border-2 ${answers[idx] ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-300 text-black hover:bg-slate-50'}`}>是</button>
                        <button onClick={() => { const ns = [...answers]; ns[idx] = false; setAnswers(ns); }} className={`px-4 py-2 rounded font-bold border-2 ${!answers[idx] ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-300 text-black hover:bg-slate-50'}`}>否</button>
                    </div>
                </div>
            ))}
            <ResultCard title="GDS-15 老年憂鬱量表" result={result} copyContent={copyText} />
        </div>
    );
};

export const FagerstromCalculator: React.FC = () => {
    const [scores, setScores] = useState<number[]>(new Array(6).fill(0));
    const [result, setResult] = useState<CalculatorResult | null>(null);

    useEffect(() => setResult(calculateFagerstrom(scores)), [scores]);

    const questions = [
        { q: "1. 起床後多久抽第一支菸？", opts: [{l:"5分鐘內 (3分)", v:3}, {l:"6-30分鐘 (2分)", v:2}, {l:"31-60分鐘 (1分)", v:1}, {l:"60分鐘後 (0分)", v:0}] },
        { q: "2. 在禁菸場所是否難以忍受？", opts: [{l:"是 (1分)", v:1}, {l:"否 (0分)", v:0}] },
        { q: "3. 哪一支菸最難放棄？", opts: [{l:"早晨第一支 (1分)", v:1}, {l:"其他 (0分)", v:0}] },
        { q: "4. 平均一天抽幾支菸？", opts: [{l:"31支以上 (3分)", v:3}, {l:"21-30支 (2分)", v:2}, {l:"11-20支 (1分)", v:1}, {l:"10支以下 (0分)", v:0}] },
        { q: "5. 起床後幾小時內是否比在其他時間抽更多菸？", opts: [{l:"是 (1分)", v:1}, {l:"否 (0分)", v:0}] },
        { q: "6. 生病臥床時是否仍會抽菸？", opts: [{l:"是 (1分)", v:1}, {l:"否 (0分)", v:0}] }
    ];

    const copyText = formatEMR('FTND', `Score: ${result?.value}`, result);

    return (
        <div className="max-w-2xl space-y-5">
            {questions.map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border-2 border-slate-200 shadow-sm">
                    <p className="font-bold text-black text-base mb-3">{item.q}</p>
                    <select 
                        className="w-full text-base rounded-md border-2 border-slate-300 py-2.5 bg-white text-black font-bold" 
                        value={scores[idx]} 
                        onChange={e => { const ns = [...scores]; ns[idx] = Number(e.target.value); setScores(ns); }}
                    >
                        {item.opts.map((opt, i) => <option key={i} value={opt.v}>{opt.l}</option>)}
                    </select>
                </div>
            ))}
            <ResultCard title="尼古丁成癮度 (FTND)" result={result} copyContent={copyText} />
        </div>
    );
};
