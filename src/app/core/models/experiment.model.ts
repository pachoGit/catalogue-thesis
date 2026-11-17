import { ProductInteractionLog, TelemetrySummary } from './telemetry.model';
import { SurveySubmission } from './survey.model';

export type ExperimentStep =
  | 'welcome'
  | 'catalog-2d'
  | 'catalog-3d'
  | 'survey'
  | 'complete';

export interface ParticipantProfile {
  id: string;
  email: string;
  fullName?: string;
  ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  gender: 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no decir';
  shoppingFrequency: 'Semanal' | 'Mensual' | 'Cada pocos meses' | 'Rara vez / Nunca';
  prior3dExperience: 'Experto' | 'Intermedio' | 'Básico / Poca' | 'Ninguna';
  deviceType: 'Desktop / Laptop' | 'Tablet' | 'Móvil';
  registeredAt: string;
}

export interface ExperimentSession {
  participant: ParticipantProfile | null;
  currentStep: ExperimentStep;
  hasTested2D: boolean;
  hasTested3D: boolean;
  interactionLogs: ProductInteractionLog[];
  telemetrySummary: TelemetrySummary;
  surveyResult?: SurveySubmission;
}
