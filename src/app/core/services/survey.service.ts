import { Injectable, signal } from '@angular/core';
import { LikertValue, SurveyDimension, SurveyQuestion, SurveySubmission } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private readonly STORAGE_KEY = 'catalogue_thesis_survey_submissions';

  // Standardized instrument based on TAM (Davis, 1989), Telepresence (Steuer, 1992), and Purchase Intent
  private readonly questionsList: SurveyQuestion[] = [
    // 1. Utilidad Percibida (TAM - Perceived Usefulness)
    {
      id: 'q_pu_1',
      code: 'PU1',
      dimension: 'perceived_usefulness',
      dimensionTitle: 'Utilidad Percibida del Entorno 3D',
      questionText: 'Poder rotar, hacer zoom e inspeccionar el producto en 3D me brindó información mucho más útil y realista que solo observar fotos 2D.',
      context: '3D'
    },
    {
      id: 'q_pu_2',
      code: 'PU2',
      dimension: 'perceived_usefulness',
      dimensionTitle: 'Utilidad Percibida del Entorno 3D',
      questionText: 'El catálogo 3D mejora mi capacidad de juzgar las dimensiones, proporciones y detalles reales del producto.',
      context: '3D'
    },
    {
      id: 'q_pu_3',
      code: 'PU3',
      dimension: 'perceived_usefulness',
      dimensionTitle: 'Utilidad Percibida del Entorno 3D',
      questionText: 'Considero que la visualización 3D interactiva es una herramienta de gran valor para tomar decisiones de compra en línea.',
      context: '3D'
    },

    // 2. Facilidad de Uso Percibida (TAM - Perceived Ease of Use)
    {
      id: 'q_peou_1',
      code: 'PEOU1',
      dimension: 'perceived_ease_of_use',
      dimensionTitle: 'Facilidad de Uso e Interactividad',
      questionText: 'Interactuar con el visor 3D (rotar 360°, acercar y cambiar colores) fue fluido, intuitivo y fácil de aprender.',
      context: '3D'
    },
    {
      id: 'q_peou_2',
      code: 'PEOU2',
      dimension: 'perceived_ease_of_use',
      dimensionTitle: 'Facilidad de Uso e Interactividad',
      questionText: 'No experimenté frustración técnica ni confusión al manipular los modelos tridimensionales.',
      context: '3D'
    },

    // 3. Telepresencia y Realismo Sensorial
    {
      id: 'q_tele_1',
      code: 'TEL1',
      dimension: 'telepresence',
      dimensionTitle: 'Telepresencia y Experiencia Sensorial',
      questionText: 'Al manipular el modelo 3D sentí una experiencia inmersiva similar a tener el producto físico en mis manos.',
      context: '3D'
    },
    {
      id: 'q_tele_2',
      code: 'TEL2',
      dimension: 'telepresence',
      dimensionTitle: 'Telepresencia y Experiencia Sensorial',
      questionText: 'El catálogo 3D estimuló mi imaginación sobre cómo luciría y se usaría el producto en mi vida cotidiana con mayor fuerza que las fotos 2D.',
      context: '3D'
    },

    // 4. Reducción de Incertidumbre y Confianza
    {
      id: 'q_unc_1',
      code: 'UNC1',
      dimension: 'uncertainty_reduction',
      dimensionTitle: 'Reducción de Incertidumbre y Confianza',
      questionText: 'El catálogo 3D redujo considerablemente mis dudas respecto a recibir un producto diferente al mostrado en la tienda online.',
      context: '3D'
    },
    {
      id: 'q_unc_2',
      code: 'UNC2',
      dimension: 'uncertainty_reduction',
      dimensionTitle: 'Reducción de Incertidumbre y Confianza',
      questionText: 'Siento mayor confianza y seguridad para comprar en una tienda online que ofrece modelos 3D interactivos frente a una que solo ofrece fotos estáticas.',
      context: '3D'
    },

    // 5. Intención de Compra (Catálogo 2D vs Catálogo 3D)
    {
      id: 'q_pi_2d_1',
      code: 'PI_2D_1',
      dimension: 'purchase_intent_2d',
      dimensionTitle: 'Intención de Compra con Catálogo 2D Tradicional',
      questionText: 'Basándome únicamente en la información y fotografías del catálogo tradicional (2D), estaría dispuesto a comprar estos productos.',
      context: '2D'
    },
    {
      id: 'q_pi_2d_2',
      code: 'PI_2D_2',
      dimension: 'purchase_intent_2d',
      dimensionTitle: 'Intención de Compra con Catálogo 2D Tradicional',
      questionText: 'El catálogo 2D me motivó fuertemente a realizar una compra en este momento.',
      context: '2D'
    },
    {
      id: 'q_pi_3d_1',
      code: 'PI_3D_1',
      dimension: 'purchase_intent_3d',
      dimensionTitle: 'Intención de Compra con Catálogo 3D Interactivo',
      questionText: 'La experiencia con los modelos 3D aumentó significativamente mi deseo e intención de comprar estos productos.',
      context: '3D'
    },
    {
      id: 'q_pi_3d_2',
      code: 'PI_3D_2',
      dimension: 'purchase_intent_3d',
      dimensionTitle: 'Intención de Compra con Catálogo 3D Interactivo',
      questionText: 'Si ambos catálogos tuvieran el mismo precio, elegiría comprar en la plataforma que ofrece visualización e interacción 3D.',
      context: '3D'
    }
  ];

  public readonly questions = signal<SurveyQuestion[]>(this.questionsList);
  public readonly submissions = signal<SurveySubmission[]>(this.loadSubmissionsFromStorage());

  getQuestions(): SurveyQuestion[] {
    return this.questionsList;
  }

  submitSurvey(
    participantId: string,
    participantEmail: string,
    participantAge: string,
    participantGender: string,
    onlineShoppingFrequency: string,
    prior3dExperience: string,
    answers: Record<string, LikertValue>,
    preferredCatalog: '2D' | '3D' | 'AMBOS' | 'NINGUNO',
    purchaseIntentCatalog: '2D' | '3D' | 'INDIFERENTE',
    qualitativeFeedback?: string
  ): SurveySubmission {
    const scores = this.calculateDimensionScores(answers);
    const submission: SurveySubmission = {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      participantId,
      participantEmail,
      participantAge,
      participantGender,
      onlineShoppingFrequency,
      prior3dExperience,
      completedAt: new Date().toISOString(),
      answers,
      preferredCatalog,
      purchaseIntentCatalog,
      qualitativeFeedback: qualitativeFeedback?.trim() || '',
      scores
    };

    const current = this.submissions();
    const updated = [submission, ...current];
    this.submissions.set(updated);
    this.saveSubmissionsToStorage(updated);
    return submission;
  }

  private calculateDimensionScores(answers: Record<string, LikertValue>) {
    const calcAvg = (codes: string[]) => {
      const qIds = this.questionsList
        .filter(q => codes.includes(q.code))
        .map(q => q.id);
      const values = qIds
        .map(id => answers[id])
        .filter((v): v is LikertValue => v !== undefined);
      if (values.length === 0) return 0;
      const sum = values.reduce((acc, curr) => acc + curr, 0);
      return Number((sum / values.length).toFixed(2));
    };

    return {
      usefulnessScore: calcAvg(['PU1', 'PU2', 'PU3']),
      easeOfUseScore: calcAvg(['PEOU1', 'PEOU2']),
      telepresenceScore: calcAvg(['TEL1', 'TEL2']),
      uncertaintyReductionScore: calcAvg(['UNC1', 'UNC2']),
      purchaseIntent2DScore: calcAvg(['PI_2D_1', 'PI_2D_2']),
      purchaseIntent3DScore: calcAvg(['PI_3D_1', 'PI_3D_2'])
    };
  }

  private loadSubmissionsFromStorage(): SurveySubmission[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading stored submissions', e);
    }
    return [];
  }

  private saveSubmissionsToStorage(submissions: SurveySubmission[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
    } catch (e) {
      console.error('Error saving submissions to localStorage', e);
    }
  }

  clearSubmissions() {
    this.submissions.set([]);
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Generates a realistic academic dataset of 35 participants
   * Ideal for thesis defense rehearsal and testing visualization charts!
   */
  loadSampleDefenseDataset() {
    const sampleProfiles = [
      { age: '18-24', gender: 'Femenino', freq: 'Semanal', exp3d: 'Básico / Poca' },
      { age: '25-34', gender: 'Masculino', freq: 'Mensual', exp3d: 'Intermedio' },
      { age: '25-34', gender: 'Femenino', freq: 'Semanal', exp3d: 'Ninguna' },
      { age: '18-24', gender: 'Masculino', freq: 'Semanal', exp3d: 'Experto' },
      { age: '35-44', gender: 'Femenino', freq: 'Mensual', exp3d: 'Básico / Poca' },
      { age: '25-34', gender: 'Masculino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '45-54', gender: 'Femenino', freq: 'Cada pocos meses', exp3d: 'Ninguna' },
      { age: '18-24', gender: 'Femenino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '25-34', gender: 'Masculino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '35-44', gender: 'Masculino', freq: 'Mensual', exp3d: 'Básico / Poca' },
      { age: '18-24', gender: 'Femenino', freq: 'Semanal', exp3d: 'Ninguna' },
      { age: '25-34', gender: 'Femenino', freq: 'Mensual', exp3d: 'Intermedio' },
      { age: '25-34', gender: 'Masculino', freq: 'Semanal', exp3d: 'Experto' },
      { age: '18-24', gender: 'Masculino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '35-44', gender: 'Femenino', freq: 'Mensual', exp3d: 'Ninguna' },
      { age: '25-34', gender: 'Femenino', freq: 'Semanal', exp3d: 'Básico / Poca' },
      { age: '45-54', gender: 'Masculino', freq: 'Cada pocos meses', exp3d: 'Ninguna' },
      { age: '18-24', gender: 'Femenino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '25-34', gender: 'Masculino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '25-34', gender: 'Femenino', freq: 'Mensual', exp3d: 'Básico / Poca' },
      { age: '18-24', gender: 'Masculino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '35-44', gender: 'Masculino', freq: 'Mensual', exp3d: 'Ninguna' },
      { age: '25-34', gender: 'Femenino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '18-24', gender: 'Femenino', freq: 'Semanal', exp3d: 'Básico / Poca' },
      { age: '25-34', gender: 'Masculino', freq: 'Mensual', exp3d: 'Experto' },
      { age: '35-44', gender: 'Femenino', freq: 'Cada pocos meses', exp3d: 'Básico / Poca' },
      { age: '18-24', gender: 'Masculino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '25-34', gender: 'Femenino', freq: 'Semanal', exp3d: 'Intermedio' },
      { age: '25-34', gender: 'Masculino', freq: 'Semanal', exp3d: 'Básico / Poca' },
      { age: '45-54', gender: 'Femenino', freq: 'Cada pocos meses', exp3d: 'Ninguna' },
      { age: '18-24', gender: 'Femenino', freq: 'Semanal', exp3d: 'Ninguna' },
      { age: '25-34', gender: 'Masculino', freq: 'Mensual', exp3d: 'Intermedio' },
      { age: '35-44', gender: 'Masculino', freq: 'Semanal', exp3d: 'Básico / Poca' },
      { age: '18-24', gender: 'Masculino', freq: 'Semanal', exp3d: 'Experto' },
      { age: '25-34', gender: 'Femenino', freq: 'Semanal', exp3d: 'Intermedio' }
    ];

    const feedbackList = [
      'Poder girar la zapatilla y ver el grabado de la suela me convenció de que no era una imitación.',
      'En la silla 3D pude apreciar la curvatura del respaldo que en fotos planas no se entiende bien.',
      'Me da mucha más seguridad comprar sabiendo exactamente cómo se ve desde cualquier ángulo.',
      'Excelente experiencia, debería ser obligatorio en todas las tiendas de e-commerce.',
      'El zoom del modelo 3D me permitió revisar el acabado del metal de la botella.',
      'Las fotos 2D se quedan cortas cuando quieres ver detalles como costuras o texturas reales.',
      'Muy fácil de rotar en el celular y la laptop, me pareció súper fluido.',
      'Compraría sin dudar en una web con 3D porque me evita sorpresas desagradables al recibir el producto.'
    ];

    const generated: SurveySubmission[] = sampleProfiles.map((prof, idx) => {
      // Simulate realistic academic distribution where 3D has statistically significant higher scores
      const randInt = (min: number, max: number): LikertValue => {
        return Math.floor(Math.random() * (max - min + 1) + min) as LikertValue;
      };

      const answers: Record<string, LikertValue> = {
        q_pu_1: randInt(4, 5),
        q_pu_2: randInt(4, 5),
        q_pu_3: randInt(4, 5),
        q_peou_1: randInt(4, 5),
        q_peou_2: randInt(3, 5),
        q_tele_1: randInt(3, 5),
        q_tele_2: randInt(4, 5),
        q_unc_1: randInt(4, 5),
        q_unc_2: randInt(4, 5),
        q_pi_2d_1: randInt(2, 4),
        q_pi_2d_2: randInt(2, 3),
        q_pi_3d_1: randInt(4, 5),
        q_pi_3d_2: randInt(4, 5)
      };

      const scores = this.calculateDimensionScores(answers);
      const emailDomain = ['gmail.com', 'outlook.com', 'pucp.edu.pe', 'uni.edu.pe', 'unmsm.edu.pe', 'upc.edu.pe'][idx % 6];
      const feedback = idx % 4 === 0 ? feedbackList[Math.floor(Math.random() * feedbackList.length)] : undefined;

      return {
        id: `sample_${idx + 1}`,
        participantId: `part_sim_${idx + 1}`,
        participantEmail: `participante${idx + 1}@${emailDomain}`,
        participantAge: prof.age,
        participantGender: prof.gender,
        onlineShoppingFrequency: prof.freq,
        prior3dExperience: prof.exp3d,
        completedAt: new Date(Date.now() - (35 - idx) * 3600 * 1000 * 12).toISOString(),
        answers,
        preferredCatalog: '3D',
        purchaseIntentCatalog: '3D',
        qualitativeFeedback: feedback,
        scores
      };
    });

    this.submissions.set(generated);
    this.saveSubmissionsToStorage(generated);
    return generated;
  }
}
