export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface LikertOption {
  value: LikertValue;
  label: string;
}

export const LIKERT_OPTIONS: LikertOption[] = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral / Indiferente' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
];

export type SurveyDimension =
  | 'perceived_usefulness'       // TAM: Utilidad Percibida
  | 'perceived_ease_of_use'      // TAM: Facilidad de Uso
  | 'telepresence'               // Telepresencia e Inmersión
  | 'uncertainty_reduction'      // Reducción de incertidumbre / Confianza
  | 'purchase_intent_2d'         // Intención de compra en Catálogo 2D
  | 'purchase_intent_3d';        // Intención de compra en Catálogo 3D

export interface SurveyQuestion {
  id: string;
  code: string;
  dimension: SurveyDimension;
  dimensionTitle: string;
  questionText: string;
  context: '2D' | '3D' | 'COMPARATIVE';
}

export interface SurveySubmission {
  id: string;
  participantId: string;
  participantEmail: string;
  participantAge: string;
  participantGender: string;
  onlineShoppingFrequency: string;
  prior3dExperience: string;
  completedAt: string;
  answers: Record<string, LikertValue>; // questionId -> LikertValue
  preferredCatalog: '2D' | '3D' | 'AMBOS' | 'NINGUNO';
  purchaseIntentCatalog: '2D' | '3D' | 'INDIFERENTE';
  qualitativeFeedback?: string;
  scores: {
    usefulnessScore: number;
    easeOfUseScore: number;
    telepresenceScore: number;
    uncertaintyReductionScore: number;
    purchaseIntent2DScore: number;
    purchaseIntent3DScore: number;
  };
}
