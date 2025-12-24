import React from 'react';
import { CalculatorCategory } from '../types';
import { MetaRiskCalculator } from '../components/calculators/MetaRiskCalculator';
import { HbA1cCalculator, GACalculator, HOMAIRCalculator, FINDRISCCalculator, BMICalculator, MetSCalculator } from '../components/calculators/MetabolicCalculators';
import { EGFRCalculator, UACRCalculator, CorrectedCalciumCalculator, OsmolalityCalculator, ElectrolyteCalculator } from '../components/calculators/RenalCalculators';
import { Fib4Calculator, APRICalculator, ChildPughCalculator } from '../components/calculators/LiverCalculators';
import { CHA2DS2VAScCalculator, HASBLEDCalculator, FraminghamCalculator, HEARTScoreCalculator } from '../components/calculators/CardioCalculators';
import { ACTCalculator, ABGCalculator, Curb65Calculator, COPDAssessmentCalculator } from '../components/calculators/RespiratoryCalculators';
import { AD8Calculator, IPSSCalculator } from '../components/calculators/MiscCalculators';
import { PHQ9Calculator, GAD7Calculator, ISICalculator, BSRS5Calculator, GDS15Calculator, FagerstromCalculator } from '../components/calculators/PsychiatryCalculators';

export const finalTools = [
    { id: 'metarisk', name: '多重慢性病風險評估 + 代謝症候群', category: CalculatorCategory.METABOLIC, component: <MetaRiskCalculator /> },
    { id: 'hba1c', name: 'HbA1c ↔ eAG 換算', category: CalculatorCategory.METABOLIC, component: <HbA1cCalculator /> },
    { id: 'ga', name: 'HbA1c ↔ GA 糖化白蛋白', category: CalculatorCategory.METABOLIC, component: <GACalculator /> },
    { id: 'homair', name: 'HOMA-IR 胰島素阻抗', category: CalculatorCategory.METABOLIC, component: <HOMAIRCalculator /> },
    { id: 'findrisc', name: '第二型糖尿病風險 (FINDRISC)', category: CalculatorCategory.METABOLIC, component: <FINDRISCCalculator /> },
    { id: 'bmi', name: 'BMI 身體質量指數', category: CalculatorCategory.METABOLIC, component: <BMICalculator /> },
    { id: 'mets', name: '代謝症候群判定 (簡易版)', category: CalculatorCategory.METABOLIC, component: <MetSCalculator /> },
    { id: 'egfr', name: 'eGFR (CKD-EPI / MDRD)', category: CalculatorCategory.RENAL, component: <EGFRCalculator /> },
    { id: 'uacr', name: 'UACR 尿液白蛋白/肌酸酐', category: CalculatorCategory.RENAL, component: <UACRCalculator /> },
    { id: 'corrected-ca', name: 'Corrected Calcium (校正鈣)', category: CalculatorCategory.RENAL, component: <CorrectedCalciumCalculator /> },
    { id: 'osm', name: 'Osmolality (血液滲透壓)', category: CalculatorCategory.RENAL, component: <OsmolalityCalculator /> },
    { id: 'ttkr', name: 'TTKR / UKCR 電解質', category: CalculatorCategory.RENAL, component: <ElectrolyteCalculator /> },
    { id: 'fib4', name: 'Fib-4 肝纖維化指數', category: CalculatorCategory.LIVER, component: <Fib4Calculator /> },
    { id: 'apri', name: 'APRI 指數', category: CalculatorCategory.LIVER, component: <APRICalculator /> },
    { id: 'child', name: 'Child-Pugh 分級', category: CalculatorCategory.LIVER, component: <ChildPughCalculator /> },
    { id: 'cha2ds2', name: 'CHA2DS2-VASc (中風)', category: CalculatorCategory.CARDIO, component: <CHA2DS2VAScCalculator /> },
    { id: 'hasbled', name: 'HAS-BLED (出血)', category: CalculatorCategory.CARDIO, component: <HASBLEDCalculator /> },
    { id: 'framingham', name: 'Framingham 2008 (10年CVD風險)', category: CalculatorCategory.CARDIO, component: <FraminghamCalculator /> },
    { id: 'heart', name: 'HEART Score (胸痛)', category: CalculatorCategory.CARDIO, component: <HEARTScoreCalculator /> },
    { id: 'act', name: 'ACT 氣喘控制 (成人/兒童)', category: CalculatorCategory.RESPIRATORY, component: <ACTCalculator /> },
    { id: 'abg', name: 'ABG 動脈血氣體分析', category: CalculatorCategory.RESPIRATORY, component: <ABGCalculator /> },
    { id: 'curb65', name: 'CURB-65 (肺炎)', category: CalculatorCategory.RESPIRATORY, component: <Curb65Calculator /> },
    { id: 'copd', name: 'COPD 風險評估 (mMRC / CAT)', category: CalculatorCategory.RESPIRATORY, component: <COPDAssessmentCalculator /> },
    { id: 'ad8', name: 'AD-8 失智症篩檢', category: CalculatorCategory.NEUROLOGY, component: <AD8Calculator /> },
    { id: 'ipss', name: 'IPSS 攝護腺症狀', category: CalculatorCategory.UROLOGY, component: <IPSSCalculator /> },
    { id: 'phq9', name: 'PHQ-9 憂鬱量表', category: CalculatorCategory.PSYCH, component: <PHQ9Calculator /> },
    { id: 'gad7', name: 'GAD-7 焦慮量表', category: CalculatorCategory.PSYCH, component: <GAD7Calculator /> },
    { id: 'isi', name: 'ISI 失眠嚴重度量表', category: CalculatorCategory.PSYCH, component: <ISICalculator /> },
    { id: 'bsrs5', name: 'BSRS-5 心情溫度計 (自殺風險)', category: CalculatorCategory.PSYCH, component: <BSRS5Calculator /> },
    { id: 'gds15', name: 'GDS-15 老年憂鬱量表', category: CalculatorCategory.PSYCH, component: <GDS15Calculator /> },
    { id: 'ftnd', name: 'FTND 尼古丁成癮度', category: CalculatorCategory.PSYCH, component: <FagerstromCalculator /> },
];
