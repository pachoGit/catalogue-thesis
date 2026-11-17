import { Injectable } from '@angular/core';
import { SurveySubmission } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  /**
   * Generates and triggers download of a standardized CSV dataset for SPSS / R / Excel
   */
  exportToCsv(submissions: SurveySubmission[], filename: string = 'tesis_datos_evaluacion_3d_vs_2d.csv') {
    if (!submissions || submissions.length === 0) {
      alert('No hay respuestas registradas para exportar.');
      return;
    }

    const headers = [
      'ID_PARTICIPANTE',
      'FECHA_REGISTRO',
      'EMAIL',
      'GRUPO_EDAD',
      'GENERO',
      'FRECUENCIA_COMPRA_ONLINE',
      'EXPERIENCIA_PREVIA_3D',
      'PU1_UTILIDAD_INFO',
      'PU2_UTILIDAD_PROPORCION',
      'PU3_UTILIDAD_VALOR',
      'PEOU1_FACILIDAD_USO',
      'PEOU2_FACILIDAD_CONFUSION_REV',
      'TEL1_TELEPRESENCIA_FISICA',
      'TEL2_TELEPRESENCIA_IMAGINACION',
      'UNC1_REDUCCION_DUDA_RECEPCION',
      'UNC2_CONFIANZA_TIENDA_3D',
      'PI_2D_1_DISPUESTO_COMPRAR',
      'PI_2D_2_MOTIVACION_ACTUAL',
      'PI_3D_1_AUMENTO_DESEO_COMPRA',
      'PI_3D_2_ELECCION_PREFERENCIAL',
      'MEDIA_PU_UTILIDAD',
      'MEDIA_PEOU_FACILIDAD',
      'MEDIA_TELEPRESENCIA',
      'MEDIA_REDUCCION_INCERTIDUMBRE',
      'MEDIA_INTENCION_COMPRA_2D',
      'MEDIA_INTENCION_COMPRA_3D',
      'DELTA_INTENCION_COMPRA_3D_VS_2D',
      'CATALOGO_PREFERIDO',
      'CATALOGO_DECISION_COMPRA',
      'FEEDBACK_CUALITATIVO'
    ];

    const rows = submissions.map(sub => {
      const answers = sub.answers || {};
      const delta = (sub.scores.purchaseIntent3DScore - sub.scores.purchaseIntent2DScore).toFixed(2);
      const cleanFeedback = (sub.qualitativeFeedback || '').replace(/"/g, '""');

      return [
        sub.participantId,
        sub.completedAt,
        `"${sub.participantEmail}"`,
        `"${sub.participantAge}"`,
        `"${sub.participantGender}"`,
        `"${sub.onlineShoppingFrequency}"`,
        `"${sub.prior3dExperience}"`,
        answers['q_pu_1'] || '',
        answers['q_pu_2'] || '',
        answers['q_pu_3'] || '',
        answers['q_peou_1'] || '',
        answers['q_peou_2'] || '',
        answers['q_tele_1'] || '',
        answers['q_tele_2'] || '',
        answers['q_unc_1'] || '',
        answers['q_unc_2'] || '',
        answers['q_pi_2d_1'] || '',
        answers['q_pi_2d_2'] || '',
        answers['q_pi_3d_1'] || '',
        answers['q_pi_3d_2'] || '',
        sub.scores.usefulnessScore,
        sub.scores.easeOfUseScore,
        sub.scores.telepresenceScore,
        sub.scores.uncertaintyReductionScore,
        sub.scores.purchaseIntent2DScore,
        sub.scores.purchaseIntent3DScore,
        delta,
        `"${sub.preferredCatalog}"`,
        `"${sub.purchaseIntentCatalog}"`,
        `"${cleanFeedback}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
