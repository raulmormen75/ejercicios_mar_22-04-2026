export type TransportModel = "lineal" | "cuadratico";

export interface LinearParams {
  L: number;
  a: number;
  b: number;
  cA: number;
  cB: number;
  t: number;
}

export interface LinearResults {
  pA: number;
  pB: number;
  xStar: number;
  qA: number;
  qB: number;
  piA: number;
  piB: number;
}

export interface FormulaStep {
  label: string;
  math?: string;
  description: string;
}

export interface Takeaway {
  title: string;
  text: string;
}

export interface SectionImageSpec {
  id: string;
  sectionId: string;
  placement: "after-section";
  prompt: string;
  alt: string;
  caption: string;
  quality: "low" | "medium" | "high";
  size: "1024x1024" | "1536x1024";
  status: "draft" | "approved" | "generated";
  assetPath?: string;
  generatedAssetPath?: string;
  sketchLines: string[];
}

export interface LessonModule {
  id: string;
  title: string;
  eyebrow: string;
  goal: string;
  intuition?: string;
  assumptions?: string[];
  formulas?: string[];
  steps?: FormulaStep[];
  summaryImageId: string;
  summaryCaption: string;
  takeaways: Takeaway[];
}

export interface ScenarioDefinition {
  id: "escenario-1" | "escenario-2" | "escenario-3";
  title: string;
  shortLabel: string;
  params: LinearParams;
  equilibrium: LinearResults;
  whyItChanges: string;
  verificationNote: string;
}
