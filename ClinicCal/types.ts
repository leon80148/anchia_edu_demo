
export enum CalculatorCategory {
  METABOLIC = '新陳代謝科 (Metabolic)',
  RENAL = '腎臟科 (Nephrology)',
  LIVER = '肝膽腸胃科 (Hepatology)',
  CARDIO = '心臟血管科 (Cardiovascular)',
  RESPIRATORY = '胸腔科 (Respiratory)',
  NEUROLOGY = '神經內科 (Neurology)',
  UROLOGY = '泌尿科 (Urology)',
  PSYCH = '身心科 (Psychiatry)',
}

export interface DrugInfo {
  code: string;
  nameEn: string;
  nameZh: string;
  form: string;
  price: number;
  regulations: string;
}

export interface PaymentInfo {
  code: string;
  name: string;
  points: number;
  category: string;
}

export interface CalculatorResult {
  value: number | string;
  interpretation: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
  nextSteps?: string; // Suggested clinical action
}

// --- Meta Risk V4 Types ---

export enum MetaRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

export interface MetaRiskInput {
  // Basic
  age: number;
  gender: 'male' | 'female';
  height?: number;
  weight?: number;
  waist?: number; // Added for MetS
  // Vitals
  sbp?: number;
  dbp?: number;
  // Labs
  fastingGlucose?: number;
  hba1c?: number;
  tc?: number;
  ldl?: number;
  hdl?: number;
  tg?: number;
  // History
  hasDiabetes: boolean;
  hasHypertension: boolean;
  hasHeartDisease: boolean;
  hasStroke: boolean;
  fhDiabetes: boolean; // Family History
  fhHeart: boolean;
  fhStroke: boolean;
  // Lifestyle
  isSmoker: boolean;
  smokeYears?: number;
  alcoholWeekly?: number;
  exerciseMins?: number;
  // Meds (Important for MetS)
  onHypertensionMeds?: boolean;
  onDiabetesMeds?: boolean;
  onLipidMeds?: boolean; 
}

export interface DiseaseRisk {
  name: string;
  score: number; // 0-100
  level: MetaRiskLevel;
  factors: string[];
  recommendations: string[];
}

export interface MetabolicStatus {
  isMetabolicSyndrome: boolean;
  criteriaMet: number;
  details: {
    waist: boolean;
    bp: boolean;
    glucose: boolean;
    tg: boolean;
    hdl: boolean;
  };
  missingValues: string[]; // List of fields that were not provided but are needed
}

export interface MetaRiskResult {
  overallScore: number;
  overallLevel: MetaRiskLevel;
  risks: {
    diabetes: DiseaseRisk;
    hypertension: DiseaseRisk;
    stroke: DiseaseRisk;
    cvd: DiseaseRisk; // Heart Disease + MACE merged for simplicity
  };
  metabolicStatus: MetabolicStatus; // Added
  generalRecommendations: string[];
}