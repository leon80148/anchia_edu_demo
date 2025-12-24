
import { CalculatorResult, MetaRiskInput, MetaRiskResult, MetaRiskLevel, DiseaseRisk, MetabolicStatus } from '../types';

// ... (Previous calculators remain unchanged) ...

// ==========================================
// A1. 腎臟工具 (Renal)
// ==========================================

export const calculateEGFR_CKDEPI = (age: number, gender: 'male' | 'female', scr: number): { value: number, stage: string, color: 'green'|'yellow'|'red', nextSteps: string } => {
  let a = 0;
  let k = 0;
  
  if (gender === 'female') {
    k = 0.7;
    a = -0.241;
  } else {
    k = 0.9;
    a = -0.302;
  }

  const egfr = 142 * Math.pow(Math.min(scr / k, 1), a) * Math.pow(Math.max(scr / k, 1), -1.2) * Math.pow(0.9938, age) * (gender === 'female' ? 1.012 : 1);
  const rounded = Math.round(egfr * 10) / 10;

  let stage = '';
  let color: 'green' | 'yellow' | 'red' = 'green';
  let nextSteps = '';

  if (rounded >= 90) { 
    stage = 'G1 (正常腎功能 Normal)'; 
    color = 'green';
    nextSteps = '每年追蹤 eGFR 與 UACR。';
  } else if (rounded >= 60) { 
    stage = 'G2 (輕度衰退 Mildly decreased)'; 
    color = 'green';
    nextSteps = '控制三高，每半年至一年追蹤。';
  } else if (rounded >= 45) { 
    stage = 'G3a (輕中度衰退 Mild-Mod)'; 
    color = 'yellow';
    nextSteps = '評估貧血、骨病變，每半年追蹤。';
  } else if (rounded >= 30) { 
    stage = 'G3b (中重度衰退 Mod-Severe)'; 
    color = 'yellow';
    nextSteps = '建議轉介腎臟科，每3-6個月追蹤。';
  } else if (rounded >= 15) { 
    stage = 'G4 (重度衰退 Severely decreased)'; 
    color = 'red';
    nextSteps = '強烈建議轉診腎臟科，準備腎臟替代療法衛教。';
  } else { 
    stage = 'G5 (末期腎臟病變 Kidney Failure)'; 
    color = 'red';
    nextSteps = '立即轉診腎臟科。';
  }

  return { value: rounded, stage, color, nextSteps };
};

export const calculateEGFR_MDRD = (age: number, gender: 'male' | 'female', scr: number): number => {
  // IDMS-traceable MDRD Study Equation
  let gfr = 175 * Math.pow(scr, -1.154) * Math.pow(age, -0.203);
  if (gender === 'female') gfr *= 0.742;
  return Math.round(gfr * 10) / 10;
};

export const calculateUACR_Detailed = (
    ua: number, 
    uaUnit: 'mg/dL' | 'mg/L', 
    ucr: number, 
    ucrUnit: 'mg/dL' | 'mmol/L'
): CalculatorResult => {
    if (!ua || !ucr) return { value: '-', interpretation: '請輸入數值', color: 'gray' };

    let ua_mgdl = ua;
    if (uaUnit === 'mg/L') ua_mgdl = ua / 10;

    let ucr_mgdl = ucr;
    if (ucrUnit === 'mmol/L') ucr_mgdl = ucr * 11.312;

    const uacr = (ua_mgdl / ucr_mgdl) * 1000;
    const rounded = Math.round(uacr);

    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';
    let nextSteps = '';

    if (rounded < 30) {
        interpretation = 'A1: 正常至輕微增加 (Normal)';
        color = 'green';
        nextSteps = '每年追蹤一次。';
    } else if (rounded < 300) {
        interpretation = 'A2: 微量白蛋白尿 (Microalbuminuria)';
        color = 'yellow';
        nextSteps = '建議使用 ACEi/ARB，控制血壓血糖。';
    } else {
        interpretation = 'A3: 巨量白蛋白尿 (Macroalbuminuria)';
        color = 'red';
        nextSteps = '強烈建議轉診腎臟科，嚴格控制危險因子。';
    }

    return { value: `${rounded} mg/g`, interpretation, color, nextSteps };
};

export const calculateTTKR = (u_k: number, p_k: number, u_osm: number, p_osm: number): CalculatorResult => {
    if (!u_k || !p_k || !u_osm || !p_osm) return { value: '-', interpretation: '請輸入數值', color: 'gray' };
    const ttkr = (u_k / p_k) / (u_osm / p_osm);
    return { 
        value: ttkr.toFixed(1), 
        interpretation: ttkr < 3 ? '低數值 (Aldosterone作用不足?)' : (ttkr > 7 ? '高數值 (Aldosterone作用正常)' : '中間值'), 
        color: 'gray', 
        nextSteps: '需搭配臨床情境判讀。' 
    };
};

export const calculateUKCR = (u_k: number, u_cr: number, u_cr_unit: 'mg/dL' | 'mmol/L'): CalculatorResult => {
    if (!u_k || !u_cr) return { value: '-', interpretation: '-', color: 'gray' };
    
    let ucr_mmol_l = u_cr;
    if (u_cr_unit === 'mg/dL') ucr_mmol_l = u_cr / 11.312;

    const ratio = u_k / ucr_mmol_l; 
    const rounded = ratio.toFixed(1);

    let interpretation = '';
    if (ratio < 1.5) interpretation = '可能為非腎臟鉀流失';
    else if (ratio > 1.5) interpretation = '可能為腎臟鉀流失 (Renal K loss)';
    
    return { value: `${rounded} mmol/mmol`, interpretation, color: 'gray', nextSteps: '參考數值，需結合 TTKR 判斷。' };
};

// NEW: Corrected Calcium
export const calculateCorrectedCalcium = (ca: number, alb: number): CalculatorResult => {
    if (!ca || !alb) return { value: '-', interpretation: '請輸入數值', color: 'gray' };
    
    // Formula: Corrected Ca = Measured Ca + 0.8 * (4.0 - Albumin)
    const correctedCa = ca + 0.8 * (4.0 - alb);
    const rounded = correctedCa.toFixed(2);

    let interp = '正常範圍';
    let color: 'green' | 'yellow' | 'red' = 'green';

    if (correctedCa < 8.5) { interp = '低血鈣 (Hypocalcemia)'; color = 'yellow'; }
    else if (correctedCa > 10.5) { interp = '高血鈣 (Hypercalcemia)'; color = 'red'; }

    return { value: `${rounded} mg/dL`, interpretation: interp, color };
};

// NEW: Serum Osmolality
export const calculateOsmolality = (na: number, glu: number, bun: number): CalculatorResult => {
    if (!na || !glu || !bun) return { value: '-', interpretation: '請輸入數值', color: 'gray' };

    // Formula: 2 * Na + Glucose / 18 + BUN / 2.8
    const osm = 2 * na + glu / 18 + bun / 2.8;
    const rounded = osm.toFixed(1);

    let interp = '正常滲透壓 (275-295)';
    let color: 'green' | 'yellow' | 'red' = 'green';

    if (osm < 275) { interp = '低滲透壓 (Hypotonic)'; color = 'yellow'; }
    else if (osm > 295) { interp = '高滲透壓 (Hypertonic)'; color = 'red'; }

    return { value: `${rounded} mOsm/kg`, interpretation: interp, color };
};

// ==========================================
// A2. 肝膽工具 (Liver)
// ==========================================

export const calculateFib4 = (age: number, ast: number, alt: number, plt: number): CalculatorResult => {
  if (!age || !ast || !alt || !plt) return { value: '-', interpretation: '請輸入數值', color: 'gray' };
  const fib4 = (age * ast) / (plt * Math.sqrt(alt));
  const rounded = Math.round(fib4 * 100) / 100;
  
  let interpretation = '';
  let color: 'green' | 'yellow' | 'red' | 'gray' = 'gray';
  let nextSteps = '';

  if (rounded < 1.45) {
    interpretation = 'F0-F1 (低風險)';
    color = 'green';
    nextSteps = '排除其他肝病後，可基層追蹤。';
  } else if (rounded <= 3.25) {
    interpretation = 'Indeterminate (無法判定)';
    color = 'yellow';
    nextSteps = '建議轉診進行 FibroScan 或切片。';
  } else {
    interpretation = 'F3-F4 (高風險/肝硬化)';
    color = 'red';
    nextSteps = '強烈建議轉診肝膽腸胃科。';
  }
  return { value: rounded.toFixed(2), interpretation, color, nextSteps };
};

export const calculateAPRI = (ast: number, plt: number): CalculatorResult => {
    const astULN = 40;
    if(!ast || !plt) return { value: '-', interpretation: '請輸入數值', color: 'gray' };
    const apri = ((ast / astULN) / plt) * 100;
    const rounded = apri.toFixed(2);
    
    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';
    if (apri > 1.5) { interpretation = '可能顯著肝纖維化'; color = 'red'; }
    else if (apri < 0.5) { interpretation = '顯著纖維化機率低'; color = 'green'; }
    else { interpretation = '觀察區間'; color = 'yellow'; }
    
    return { value: rounded, interpretation, color };
};

export const calculateChildPugh = (bili: number, alb: number, inr: number, ascites: number, enceph: number): CalculatorResult => {
    let points = 0;
    if (bili < 2) points += 1; else if (bili <= 3) points += 2; else points += 3;
    if (alb > 3.5) points += 1; else if (alb >= 2.8) points += 2; else points += 3;
    if (inr < 1.7) points += 1; else if (inr <= 2.3) points += 2; else points += 3;
    points += ascites;
    points += enceph;

    let grade = '';
    let color: 'green' | 'yellow' | 'red' = 'green';
    if (points <= 6) { grade = 'Class A'; color = 'green'; }
    else if (points <= 9) { grade = 'Class B'; color = 'yellow'; }
    else { grade = 'Class C'; color = 'red'; }

    return { value: `${points} 分`, interpretation: grade, color, nextSteps: points > 9 ? '預後不佳，需評估移植。' : '定期追蹤。' };
};

// ==========================================
// A3. 心血管工具 (Cardiovascular)
// ==========================================

export const calculateCHA2DS2VASc = (
    age: number, 
    sex: 'male' | 'female',
    chf: boolean,
    htn: boolean,
    stroke: boolean,
    vascular: boolean,
    diabetes: boolean
): CalculatorResult => {
    let score = 0;
    if (chf) score += 1;
    if (htn) score += 1;
    if (age >= 75) score += 2;
    else if (age >= 65) score += 1;
    if (diabetes) score += 1;
    if (stroke) score += 2;
    if (vascular) score += 1;
    if (sex === 'female') score += 1;

    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';
    let nextSteps = '';
    
    const cutoff = sex === 'male' ? 1 : 2; 

    if ((sex === 'male' && score === 0) || (sex === 'female' && score === 1)) {
        interpretation = '低風險 (Low risk)';
        color = 'green';
        nextSteps = '不需抗凝血劑治療，或考慮 Aspirin。';
    } else if ((sex === 'male' && score === 1) || (sex === 'female' && score === 2)) {
        interpretation = '中度風險 (Moderate risk)';
        color = 'yellow';
        nextSteps = '考慮口服抗凝血劑 (NOAC/Warfarin)。';
    } else {
        interpretation = '高風險 (High risk)';
        color = 'red';
        nextSteps = '強烈建議口服抗凝血劑 (NOAC 優先)。';
    }

    return { value: `${score} 分`, interpretation, color, nextSteps };
};

export const calculateHASBLED = (
    htn: boolean, 
    abnormalRenal: boolean,
    abnormalLiver: boolean,
    stroke: boolean,
    bleeding: boolean,
    labileINR: boolean,
    elderly: boolean, 
    drugs: boolean, 
    alcohol: boolean
): CalculatorResult => {
    let score = 0;
    if (htn) score++;
    if (abnormalRenal) score++;
    if (abnormalLiver) score++;
    if (stroke) score++;
    if (bleeding) score++;
    if (labileINR) score++;
    if (elderly) score++;
    if (drugs) score++;
    if (alcohol) score++;

    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';

    if (score >= 3) {
        interpretation = '出血高風險 (High Risk)';
        color = 'red';
    } else {
        interpretation = '出血低至中度風險';
        color = 'green';
    }

    return { value: `${score} 分`, interpretation, color, nextSteps: score >= 3 ? '使用抗凝血劑需頻繁回診監測，並校正可逆因子。' : '定期追蹤。' };
};

export const calculateHEARTScore = (h: number, e: number, a: number, r: number, t: number): CalculatorResult => {
    const total = h + e + a + r + t;
    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';
    
    if (total <= 3) { interpretation = '低風險 (MACE 1.7%)'; color = 'green'; }
    else if (total <= 6) { interpretation = '中風險 (MACE 16.6%)'; color = 'yellow'; }
    else { interpretation = '高風險 (MACE 50.1%)'; color = 'red'; }

    return { value: `${total} 分`, interpretation, color, nextSteps: total <=3 ? '考慮 Discharge' : '需留觀或住院' };
};

export const calculateFramingham2008 = (
    age: number,
    sex: 'male' | 'female',
    smoker: boolean,
    diabetes: boolean,
    treatedBP: boolean,
    sbp: number,
    tc: number,
    hdl: number
): CalculatorResult => {
    if (!age || !sbp || !tc || !hdl) return { value: '-', interpretation: '請輸入數值', color: 'gray' };

    const lnAge = Math.log(age);
    const lnTC = Math.log(tc);
    const lnHDL = Math.log(hdl);
    const lnSBP = Math.log(sbp);

    let risk = 0;

    if (sex === 'female') {
        const score = (2.32888 * lnAge) 
                    + (1.20904 * lnTC) 
                    + (-0.70833 * lnHDL) 
                    + (treatedBP ? 2.82263 * lnSBP : 2.72107 * lnSBP) 
                    + (smoker ? 0.52873 : 0) 
                    + (diabetes ? 0.69154 : 0);
        const meanScore = 26.1931;
        const s0 = 0.95012;
        const riskVal = 1 - Math.pow(s0, Math.exp(score - meanScore));
        risk = riskVal * 100;

    } else {
        const score = (3.06117 * lnAge)
                    + (1.12370 * lnTC)
                    + (-0.93263 * lnHDL)
                    + (treatedBP ? 1.99881 * lnSBP : 1.93303 * lnSBP)
                    + (smoker ? 0.65451 : 0)
                    + (diabetes ? 0.57367 : 0);
        const meanScore = 23.9802;
        const s0 = 0.88936;
        const riskVal = 1 - Math.pow(s0, Math.exp(score - meanScore));
        risk = riskVal * 100;
    }

    const rounded = Math.round(risk * 10) / 10;
    let color: 'green'|'yellow'|'red' = 'green';
    let interp = '';

    if (rounded < 10) { interp = '低風險 (<10%)'; color = 'green'; }
    else if (rounded < 20) { interp = '中度風險 (10-20%)'; color = 'yellow'; }
    else { interp = '高風險 (>20%)'; color = 'red'; }

    return {
        value: `${rounded}%`,
        interpretation: `10年心血管疾病風險: ${interp}`,
        color,
        nextSteps: rounded >= 10 ? '建議積極控制三高危險因子 (血壓、血脂、血糖)。' : '維持良好生活型態。'
    };
};

// ==========================================
// A4. 呼吸工具 (Respiratory)
// ==========================================

export const calculateACT_Adult = (scores: number[]): CalculatorResult => {
    const total = scores.reduce((a, b) => a + b, 0);
    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';
    let nextSteps = '';

    if (total >= 25) {
        interpretation = '控制完全 (Fully Controlled)';
        color = 'green';
        nextSteps = '維持目前治療。';
    } else if (total >= 20) {
        interpretation = '控制良好 (Well Controlled)';
        color = 'green';
        nextSteps = '維持目前治療。';
    } else {
        interpretation = '控制不佳 (Not Well Controlled)';
        color = 'red';
        nextSteps = '需調整藥物或評估吸入器技巧/遵囑性。';
    }
    return { value: `${total} 分`, interpretation, color, nextSteps };
};

export const calculateACT_Child = (scores: number[]): CalculatorResult => {
    const total = scores.reduce((a, b) => a + b, 0);
    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';

    if (total <= 19) {
        interpretation = '控制不佳 (Uncontrolled)';
        color = 'red';
    } else {
        interpretation = '控制良好 (Well Controlled)';
        color = 'green';
    }
    return { value: `${total} 分`, interpretation, color, nextSteps: total <= 19 ? '需調整治療計畫。' : '維持目前治療。' };
};

export const calculateCURB65 = (c: boolean, bun: number, rr: number, bpLow: boolean, age65: boolean): CalculatorResult => {
    let score = 0;
    if (c) score++; if (bun > 19) score++; if (rr >= 30) score++; if (bpLow) score++; if (age65) score++;
    return { 
        value: `${score} 分`, 
        interpretation: score <= 1 ? '低風險' : (score === 2 ? '中度風險' : '高風險'),
        color: score <= 1 ? 'green' : (score === 2 ? 'yellow' : 'red'),
        nextSteps: score <= 1 ? '門診治療' : '考慮住院'
    };
};

export const calculateMMRC = (grade: number): CalculatorResult => {
    const interps = [
        "劇烈運動時才感覺呼吸困難 (0級)",
        "平路快走或爬小坡時感覺呼吸困難 (1級)",
        "平路慢走也會喘，需停下休息 (2級)",
        "平路走約100公尺或幾分鐘就需停下休息 (3級)",
        "穿衣/梳洗或太喘無法出門 (4級)"
    ];
    return { 
        value: `Grade ${grade}`, 
        interpretation: interps[grade], 
        color: grade >= 2 ? 'red' : 'green',
        nextSteps: grade >= 2 ? '症狀明顯 (Symptomatic)，屬 GOLD Group B 或 E。' : '症狀輕微，屬 GOLD Group A。'
    };
};

// NEW: CAT (COPD Assessment Test)
export const calculateCAT = (scores: number[]): CalculatorResult => {
    const total = scores.reduce((a, b) => a + b, 0);
    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';
    
    if (total < 10) {
        interpretation = '低影響 (Low Impact)';
        color = 'green';
    } else if (total < 20) {
        interpretation = '中度影響 (Medium)';
        color = 'yellow';
    } else if (total < 30) {
        interpretation = '高度影響 (High)';
        color = 'red';
    } else {
        interpretation = '極嚴重影響 (Very High)';
        color = 'red';
    }

    return { 
        value: `${total} 分`, 
        interpretation, 
        color,
        nextSteps: total >= 10 ? '症狀顯著，屬 GOLD Group B 或 E。' : '症狀輕微，屬 GOLD Group A。'
    };
};

// NEW: ABG Analysis
export const calculateABG = (ph: number, pco2: number, hco3: number): CalculatorResult => {
    if (!ph || !pco2 || !hco3) return { value: '-', interpretation: '請輸入數值', color: 'gray' };

    let result = '';
    let color: 'green' | 'yellow' | 'red' = 'green';

    // Acidosis vs Alkalosis
    if (ph < 7.35) {
        // Acidemia
        if (pco2 > 45) {
            result = '呼吸性酸中毒 (Respiratory Acidosis)';
            color = 'red';
        } else if (hco3 < 22) {
            result = '代謝性酸中毒 (Metabolic Acidosis)';
            color = 'red';
        } else {
            result = '混合型酸中毒 (Mixed Acidosis)';
            color = 'red';
        }
    } else if (ph > 7.45) {
        // Alkalemia
        if (pco2 < 35) {
            result = '呼吸性鹼中毒 (Respiratory Alkalosis)';
            color = 'yellow';
        } else if (hco3 > 26) {
            result = '代謝性鹼中毒 (Metabolic Alkalosis)';
            color = 'yellow';
        } else {
            result = '混合型鹼中毒 (Mixed Alkalosis)';
            color = 'yellow';
        }
    } else {
        // Normal pH
        if (pco2 > 45 || pco2 < 35 || hco3 < 22 || hco3 > 26) {
            result = '代償性酸鹼異常 (Compensated)';
            color = 'yellow';
        } else {
            result = '正常 (Normal)';
            color = 'green';
        }
    }

    return { value: `${ph}`, interpretation: result, color };
};

// ==========================================
// A5. 代謝內分泌 (Metabolic)
// ==========================================

export const convertHbA1cToEAG = (a1c: number): number => {
    return Math.round(28.7 * a1c - 46.7);
};

export const convertEAGToHbA1c = (eag: number): number => {
    return Math.round(((eag + 46.7) / 28.7) * 10) / 10;
};

// NEW: Glycated Albumin (GA)
// Formula: GA = (HbA1c - 2.015) * 4
export const convertHbA1cToGA = (a1c: number): number => {
    const ga = (a1c - 2.015) * 4;
    return Math.round(ga * 10) / 10;
};

export const convertGAToHbA1c = (ga: number): number => {
    const a1c = (ga / 4) + 2.015;
    return Math.round(a1c * 10) / 10;
};

// NEW: HOMA-IR
export const calculateHOMAIR = (glu: number, ins: number): CalculatorResult => {
    if (!glu || !ins) return { value: '-', interpretation: '請輸入數值', color: 'gray' };
    
    // Formula: (Glucose * Insulin) / 405
    const homair = (glu * ins) / 405;
    const rounded = homair.toFixed(2);
    
    let interp = '';
    let color: 'green' | 'yellow' | 'red' = 'green';

    if (homair < 2) {
        interp = '胰島素敏感性正常 (Normal)';
        color = 'green';
    } else if (homair < 2.5) {
        interp = '早期胰島素阻抗 (Early IR)';
        color = 'yellow';
    } else {
        interp = '顯著胰島素阻抗 (Significant IR)';
        color = 'red';
    }

    return { value: rounded, interpretation: interp, color, nextSteps: homair >= 2 ? '建議減重、運動與飲食控制。' : '' };
};


export const calculateBMI = (heightCm: number, weightKg: number): CalculatorResult => {
    if (!heightCm || !weightKg) return { value: '-', interpretation: '-', color: 'gray' };
    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    const rounded = Math.round(bmi * 10) / 10;
    let color: 'green' | 'yellow' | 'red' = 'green';
    if(rounded < 18.5 || rounded >= 24) color = rounded >= 27 ? 'red' : 'yellow';
    return { value: rounded.toFixed(1), interpretation: rounded >= 27 ? '肥胖' : (rounded >= 24 ? '過重' : (rounded < 18.5 ? '過輕' : '正常')), color };
};

export const checkMetabolicSyndrome = (waist: boolean, bp: boolean, glu: boolean, tg: boolean, hdl: boolean): CalculatorResult => {
    const count = [waist, bp, glu, tg, hdl].filter(Boolean).length;
    return {
        value: `${count} 項異常`,
        interpretation: count >= 3 ? '代謝症候群' : '非代謝症候群',
        color: count >= 3 ? 'red' : 'green',
        nextSteps: count >= 3 ? '積極生活型態調整' : '定期追蹤'
    };
};

export const calculateFINDRISC = (
    ageGroup: number,
    bmiGroup: number,
    waistGroup: number,
    activity: boolean,
    diet: boolean,
    meds: boolean,
    highGlu: boolean,
    family: number
): CalculatorResult => {
    let score = ageGroup + bmiGroup + waistGroup + (activity ? 0 : 2) + (diet ? 0 : 1) + (meds ? 2 : 0) + (highGlu ? 5 : 0) + family;
    
    let interp = '';
    let color: 'green'|'yellow'|'red' = 'green';

    if (score < 7) { interp = '低風險 (Low risk, 1%)'; color = 'green'; }
    else if (score <= 11) { interp = '輕微風險 (Slightly elevated, 4%)'; color = 'green'; }
    else if (score <= 14) { interp = '中度風險 (Moderate, 17%)'; color = 'yellow'; }
    else if (score <= 20) { interp = '高風險 (High, 33%)'; color = 'red'; }
    else { interp = '極高風險 (Very high, 50%)'; color = 'red'; }

    return {
        value: `${score} 分`,
        interpretation: `未來10年罹患糖尿病機率: ${interp}`,
        color,
        nextSteps: score >= 15 ? '強烈建議進行 OGTT 或 HbA1c 檢查，並積極減重。' : '維持健康生活。'
    };
};

// ==========================================
// META RISK V4 (Reference Algorithm Port)
// ==========================================

// ... (MetaRiskV4 code remains unchanged) ...

const getRiskLevel = (score: number): MetaRiskLevel => {
    if (score < 25) return MetaRiskLevel.LOW;
    if (score < 50) return MetaRiskLevel.MEDIUM;
    if (score < 75) return MetaRiskLevel.HIGH;
    return MetaRiskLevel.VERY_HIGH;
};

export const calculateMetaRiskV4 = (input: MetaRiskInput): MetaRiskResult => {
    const bmi = input.weight && input.height ? input.weight / Math.pow(input.height / 100, 2) : 0;

    // --- Part A: Metabolic Syndrome Logic (Taiwan HPA) ---
    const metDetails = {
      waist: false,
      bp: false,
      glucose: false,
      tg: false,
      hdl: false
    };
    const missingValues: string[] = [];

    // 1. Waist
    if (input.waist) {
      if (input.gender === 'male' && input.waist >= 90) metDetails.waist = true;
      if (input.gender === 'female' && input.waist >= 80) metDetails.waist = true;
    } else {
      missingValues.push('腰圍');
    }

    // 2. BP
    if (input.onHypertensionMeds) {
      metDetails.bp = true;
    } else if (input.sbp && input.dbp) {
      if (input.sbp >= 130 || input.dbp >= 85) metDetails.bp = true;
    } else {
      missingValues.push('血壓');
    }

    // 3. Glucose
    if (input.onDiabetesMeds) {
      metDetails.glucose = true;
    } else if (input.fastingGlucose) {
      if (input.fastingGlucose >= 100) metDetails.glucose = true;
    } else {
      missingValues.push('血糖');
    }

    // 4. TG
    if (input.onLipidMeds) {
        metDetails.tg = true; 
    } else if (input.tg) {
      if (input.tg >= 150) metDetails.tg = true;
    } else {
      missingValues.push('三酸甘油酯');
    }

    // 5. HDL
    if (input.hdl) {
      if (input.gender === 'male' && input.hdl < 40) metDetails.hdl = true;
      if (input.gender === 'female' && input.hdl < 50) metDetails.hdl = true;
    } else {
      missingValues.push('HDL膽固醇');
    }

    const criteriaMet = Object.values(metDetails).filter(Boolean).length;
    const isMetabolicSyndrome = criteriaMet >= 3;

    // --- Part B: Risk V4 Scores ---

    // 1. Diabetes Risk
    let dmScore = 0;
    const dmFactors: string[] = [];
    const dmRecs: string[] = [];

    if (input.hasDiabetes) {
        dmScore = 100;
        dmFactors.push('已確診糖尿病');
        dmRecs.push('繼續按醫嘱服藥', '定期監測血糖');
    } else {
        if (input.age >= 65) dmScore += 30;
        else if (input.age >= 55) dmScore += 20;
        else if (input.age >= 45) dmScore += 10;

        if (bmi >= 32) { dmScore += 25; dmFactors.push('重度肥胖'); }
        else if (bmi >= 28) { dmScore += 20; dmFactors.push('肥胖'); }
        else if (bmi >= 24) { dmScore += 10; dmFactors.push('過重'); }

        if (input.fastingGlucose && input.fastingGlucose >= 126) { dmScore += 30; dmFactors.push('空腹血糖 ≥ 126'); }
        else if (input.fastingGlucose && input.fastingGlucose >= 100) { dmScore += 20; dmFactors.push('空腹血糖偏高'); }

        if (input.hba1c && input.hba1c >= 6.5) { dmScore += 30; dmFactors.push('HbA1c ≥ 6.5%'); }
        else if (input.hba1c && input.hba1c >= 5.7) { dmScore += 20; dmFactors.push('HbA1c 5.7-6.4%'); }

        if (input.fhDiabetes) { dmScore += 15; dmFactors.push('糖尿病家族史'); }
        if (input.hasHypertension) { dmScore += 10; dmFactors.push('高血壓病史'); }
        if (input.exerciseMins !== undefined && input.exerciseMins < 150) { dmScore += 10; dmFactors.push('缺乏運動'); }

        dmScore = Math.min(dmScore, 100);
    }

    const dmRisk: DiseaseRisk = {
        name: '糖尿病風險 (Diabetes)',
        score: dmScore,
        level: getRiskLevel(dmScore),
        factors: dmFactors,
        recommendations: dmRecs
    };
    if (dmRisk.level !== MetaRiskLevel.LOW && !input.hasDiabetes) dmRecs.push('建議飲食控制與減重', '增加運動量');


    // 2. Hypertension Risk
    let htnScore = 0;
    const htnFactors: string[] = [];
    const htnRecs: string[] = [];

    if (input.hasHypertension) {
        htnScore = 100;
        htnFactors.push('已確診高血壓');
        htnRecs.push('按醫嘱服藥', '每日監測血壓');
    } else {
        if ((input.sbp && input.sbp >= 140) || (input.dbp && input.dbp >= 90)) { htnScore += 40; htnFactors.push('血壓值 ≥ 140/90'); }
        else if ((input.sbp && input.sbp >= 130) || (input.dbp && input.dbp >= 85)) { htnScore += 30; htnFactors.push('血壓值偏高 (130/85)'); }
        else if ((input.sbp && input.sbp >= 120) || (input.dbp && input.dbp >= 80)) { htnScore += 20; htnFactors.push('正常偏高血壓 (120/80)'); }

        if (input.age >= 65) htnScore += 35;
        else if (input.age >= 55) htnScore += 25;
        else if (input.age >= 40) htnScore += 15;

        if (bmi >= 28) htnScore += 20;
        else if (bmi >= 24) htnScore += 15;

        if (input.fhHeart) htnScore += 15;
        if (input.isSmoker) { htnScore += 10; htnFactors.push('吸菸'); }
        if (input.alcoholWeekly && input.alcoholWeekly > 14) { htnScore += 10; htnFactors.push('飲酒過量'); }
        
        htnScore = Math.min(htnScore, 100);
    }

    const htnRisk: DiseaseRisk = {
        name: '高血壓風險 (Hypertension)',
        score: htnScore,
        level: getRiskLevel(htnScore),
        factors: htnFactors,
        recommendations: htnRecs
    };
    if (htnRisk.level !== MetaRiskLevel.LOW && !input.hasHypertension) htnRecs.push('採用 DASH 飲食 (限鹽/高纖)', '減重與運動');


    // 3. Stroke Risk
    let strokeScore = 0;
    const strokeFactors: string[] = [];
    const strokeRecs: string[] = [];

    if (input.hasStroke) {
        strokeScore = 100;
        strokeFactors.push('既往中風史');
    } else {
        if (input.hasHypertension || (input.sbp && input.sbp >= 140)) { strokeScore += 35; strokeFactors.push('高血壓'); }
        
        if (input.age >= 75) strokeScore += 35;
        else if (input.age >= 65) strokeScore += 25;
        else if (input.age >= 55) strokeScore += 15;

        if (input.hasDiabetes) { strokeScore += 20; strokeFactors.push('糖尿病'); }
        if (input.hasHeartDisease) { strokeScore += 20; strokeFactors.push('心臟病'); }
        if (input.isSmoker) { strokeScore += 15; strokeFactors.push('吸菸'); }
        if (input.tc && input.tc >= 240) strokeScore += 10;
        if (input.fhStroke) strokeScore += 10;

        strokeScore = Math.min(strokeScore, 100);
    }
    const strokeRisk: DiseaseRisk = {
        name: '中風風險 (Stroke)',
        score: strokeScore,
        level: getRiskLevel(strokeScore),
        factors: strokeFactors,
        recommendations: strokeRecs
    };


    // 4. CVD Risk
    let cvdScore = 0;
    const cvdFactors: string[] = [];
    const cvdRecs: string[] = [];

    if (input.hasHeartDisease) {
        cvdScore = 100;
        cvdFactors.push('已確診心血管疾病');
    } else {
        if (input.gender === 'male') {
            if (input.age >= 45) cvdScore += 25;
            else if (input.age >= 35) cvdScore += 15;
        } else {
            if (input.age >= 55) cvdScore += 25;
            else if (input.age >= 45) cvdScore += 15;
        }

        if (input.fhHeart) cvdScore += 20;
        if (input.hasDiabetes) { cvdScore += 20; cvdFactors.push('糖尿病'); }
        if (input.hasHypertension) { cvdScore += 15; cvdFactors.push('高血壓'); }
        if (input.tc && input.tc >= 240) { cvdScore += 15; cvdFactors.push('高膽固醇'); }
        if (input.isSmoker) { 
            const sScore = input.smokeYears && input.smokeYears > 10 ? 20 : 15; 
            cvdScore += sScore; 
            cvdFactors.push('吸菸'); 
        }
        if (input.tg && input.tg >= 200) cvdScore += 10;

        let factorsCount = 0;
        if (input.hasDiabetes) factorsCount++;
        if (input.hasHypertension) factorsCount++;
        if (input.isSmoker) factorsCount++;
        if (input.ldl && input.ldl >= 160) factorsCount++;
        if (factorsCount >= 2) cvdScore += (factorsCount * 5);

        cvdScore = Math.min(cvdScore, 100);
    }
    
    const cvdRisk: DiseaseRisk = {
        name: '心血管疾病風險 (CVD/MACE)',
        score: cvdScore,
        level: getRiskLevel(cvdScore),
        factors: cvdFactors,
        recommendations: cvdRecs
    };

    const overallScore = Math.max(dmScore, htnScore, strokeScore, cvdScore);
    
    const generalRecs: string[] = [];
    if (isMetabolicSyndrome) {
        generalRecs.push('⚠️ 您符合「代謝症候群」診斷。請積極進行生活型態調整。');
    }
    if (overallScore >= 50) {
        generalRecs.push('建議進行全面健康檢查。', '必須立即改善生活型態 (戒菸、減重)。');
        if (input.isSmoker) generalRecs.push('戒菸是降低風險最有效的方法。');
    } else {
        generalRecs.push('維持目前健康生活習慣。', '定期追蹤健檢數值。');
    }

    return {
        overallScore,
        overallLevel: getRiskLevel(overallScore),
        risks: {
            diabetes: dmRisk,
            hypertension: htnRisk,
            stroke: strokeRisk,
            cvd: cvdRisk
        },
        metabolicStatus: {
            isMetabolicSyndrome,
            criteriaMet,
            details: metDetails,
            missingValues
        },
        generalRecommendations: generalRecs
    };
};


// ==========================================
// A6. 泌尿科 (Urology)
// ==========================================

export const calculateIPSS = (scores: number[], qol: number): CalculatorResult => {
  const total = scores.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let color: 'green' | 'yellow' | 'red' = 'green';
  
  if (total <= 7) { interpretation = '輕度症狀 (Mild)'; color = 'green'; }
  else if (total <= 19) { interpretation = '中度症狀 (Moderate)'; color = 'yellow'; }
  else { interpretation = '重度症狀 (Severe)'; color = 'red'; }

  return { 
      value: `${total} 分`, 
      interpretation, 
      color,
      nextSteps: `生活品質指數 (QoL): ${qol}`
  };
};

// ==========================================
// A7. 身心科 (Psychiatry)
// ==========================================

export const calculatePHQ9 = (scores: number[]): CalculatorResult => {
  const total = scores.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let color: 'green' | 'yellow' | 'red' = 'green';

  if (total <= 4) { interpretation = '無憂鬱傾向 (None)'; color = 'green'; }
  else if (total <= 9) { interpretation = '輕微憂鬱 (Mild)'; color = 'yellow'; }
  else if (total <= 14) { interpretation = '中度憂鬱 (Moderate)'; color = 'yellow'; }
  else if (total <= 19) { interpretation = '中重度憂鬱 (Moderately Severe)'; color = 'red'; }
  else { interpretation = '重度憂鬱 (Severe)'; color = 'red'; }

  return { value: `${total} 分`, interpretation, color, nextSteps: total >= 10 ? '建議進一步評估或轉診。' : '定期追蹤。' };
};

export const calculateGAD7 = (scores: number[]): CalculatorResult => {
  const total = scores.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let color: 'green' | 'yellow' | 'red' = 'green';

  if (total <= 4) { interpretation = '無焦慮傾向 (None)'; color = 'green'; }
  else if (total <= 9) { interpretation = '輕微焦慮 (Mild)'; color = 'yellow'; }
  else if (total <= 14) { interpretation = '中度焦慮 (Moderate)'; color = 'yellow'; }
  else { interpretation = '重度焦慮 (Severe)'; color = 'red'; }

  return { value: `${total} 分`, interpretation, color, nextSteps: total >= 10 ? '建議進一步評估。' : '定期追蹤。' };
};

export const calculateISI = (scores: number[]): CalculatorResult => {
  const total = scores.reduce((a, b) => a + b, 0);
  let interpretation = '';
  let color: 'green' | 'yellow' | 'red' = 'green';

  if (total <= 7) { interpretation = '無臨床顯著失眠 (None)'; color = 'green'; }
  else if (total <= 14) { interpretation = '輕微失眠 (Subthreshold)'; color = 'yellow'; }
  else if (total <= 21) { interpretation = '中度失眠 (Moderate)'; color = 'yellow'; }
  else { interpretation = '重度失眠 (Severe)'; color = 'red'; }

  return { value: `${total} 分`, interpretation, color };
};

export const calculateBSRS5 = (scores: number[], suicideScore: number): CalculatorResult => {
  const sum5 = scores.reduce((a, b) => a + b, 0);
  
  let interpretation = '';
  let color: 'green' | 'yellow' | 'red' = 'green';
  let nextSteps = '';

  if (sum5 <= 5) {
      interpretation = '身心適應良好 (Normal)';
      color = 'green';
  } else if (sum5 <= 9) {
      interpretation = '輕度情緒困擾 (Mild)';
      color = 'green'; 
      nextSteps = '建議找家人朋友談談，抒發情緒。';
  } else if (sum5 <= 14) {
      interpretation = '中度情緒困擾 (Moderate)';
      color = 'yellow';
      nextSteps = '建議尋求心理諮商或專業醫療協助。';
  } else {
      interpretation = '重度情緒困擾 (Severe)';
      color = 'red';
      nextSteps = '建議由精神科醫師診治。';
  }

  if (suicideScore >= 2) {
      interpretation += ' + 自殺風險 (Suicide Risk)';
      color = 'red';
      nextSteps = '⚠️ 自殺意念評分較高，請立刻尋求專業醫療協助或撥打 1925 安心專線。';
  } else if (suicideScore === 1) {
      nextSteps += ' (留意自殺意念)';
  }

  return { value: `${sum5} 分`, interpretation, color, nextSteps };
};

export const calculateGDS15 = (answers: boolean[]): CalculatorResult => {
    const reverseIndices = [0, 4, 6, 10, 12]; 
    let score = 0;

    answers.forEach((ans, idx) => {
        if (reverseIndices.includes(idx)) {
            if (!ans) score++;
        } else {
            if (ans) score++;
        }
    });

    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';

    if (score <= 4) { interpretation = '正常 (Normal)'; color = 'green'; }
    else if (score <= 8) { interpretation = '輕微憂鬱 (Mild)'; color = 'yellow'; }
    else if (score <= 11) { interpretation = '中度憂鬱 (Moderate)'; color = 'yellow'; }
    else { interpretation = '嚴重憂鬱 (Severe)'; color = 'red'; }

    return { value: `${score} 分`, interpretation, color, nextSteps: score >= 5 ? '建議進一步評估。' : '定期追蹤。' };
};

export const calculateFagerstrom = (scores: number[]): CalculatorResult => {
    const total = scores.reduce((a,b) => a+b, 0);
    let interpretation = '';
    let color: 'green' | 'yellow' | 'red' = 'green';

    if (total <= 2) { interpretation = '極低成癮度 (Very Low)'; color = 'green'; }
    else if (total <= 4) { interpretation = '低成癮度 (Low)'; color = 'green'; }
    else if (total <= 5) { interpretation = '中度成癮度 (Medium)'; color = 'yellow'; }
    else if (total <= 7) { interpretation = '高成癮度 (High)'; color = 'red'; }
    else { interpretation = '極高成癮度 (Very High)'; color = 'red'; }

    let nextSteps = '';
    if (total >= 4) nextSteps = '建議使用尼古丁替代療法 (NRT) 或戒菸藥物輔助。';
    else nextSteps = '可嘗試靠意志力戒菸，或低劑量 NRT。';

    return { value: `${total} 分`, interpretation, color, nextSteps };
};

// ==========================================
// A8. 神經內科 (Neurology)
// ==========================================

export const calculateAD8 = (score: number): CalculatorResult => {
  let interpretation = '';
  let color: 'green' | 'yellow' | 'red' = 'green';

  if (score >= 2) {
      interpretation = '可能患有失智症 (Positive)';
      color = 'red';
  } else {
      interpretation = '目前無明顯失智徵兆 (Negative)';
      color = 'green';
  }

  return { value: `${score} 分`, interpretation, color, nextSteps: score >= 2 ? '建議就醫進行完整評估。' : '定期追蹤。' };
};
