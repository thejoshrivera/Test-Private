export type InstrumentStatus = "pass" | "fail" | "overdue" | "pending";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RecommendationCategory =
  | "replacement"
  | "interval"
  | "investigation"
  | "cost"
  | "audit"
  | "maintenance";

export interface CalibrationRecord {
  id: string;
  instrumentId: string;
  instrumentTag: string;
  instrumentName: string;
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  calibrationDate: string;
  nextCalibrationDate: string;
  technician: string;
  status: InstrumentStatus;
  asFoundError: number;
  asLeftError: number;
  tolerance: number;
  drift: number;
  laborHours: number;
  calibrationCost: number;
  department: string;
  category: string;
  riskLevel: RiskLevel;
}

export interface InstrumentSummary {
  instrumentId: string;
  instrumentTag: string;
  instrumentName: string;
  location: string;
  manufacturer: string;
  model: string;
  category: string;
  department: string;
  riskLevel: RiskLevel;
  totalCalibrations: number;
  failCount: number;
  passRate: number;
  avgDrift: number;
  maxDrift: number;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  totalCost: number;
  totalLaborHours: number;
  driftTrend: number[];
  isOverdue: boolean;
  consecutiveFailures: number;
  predictedFailureDate?: string;
}

export interface DashboardKPIs {
  totalInstruments: number;
  passRate: number;
  failRate: number;
  overdueRate: number;
  avgDrift: number;
  totalLaborHours: number;
  estimatedAnnualCost: number;
  calibrationsThisMonth: number;
  calibrationsThisQuarter: number;
  criticalInstruments: number;
}

export interface TrendDataPoint {
  month: string;
  pass: number;
  fail: number;
  total: number;
  avgDrift: number;
  cost: number;
}

export interface Recommendation {
  id: string;
  instrumentId?: string;
  instrumentTag?: string;
  category: RecommendationCategory;
  title: string;
  problem: string;
  evidence: string;
  businessImpact: string;
  estimatedSavings: number;
  recommendedAction: string;
  confidenceScore: number;
  priority: "low" | "medium" | "high" | "critical";
  affectedInstruments?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface HeatmapCell {
  department: string;
  category: string;
  riskScore: number;
  instrumentCount: number;
}

export interface ParetoEntry {
  tag: string;
  name: string;
  failCount: number;
  cost: number;
  cumulative: number;
}
