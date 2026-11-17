import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import confetti from 'canvas-confetti';
import { SurveyService } from '../../core/services/survey.service';
import { ExperimentService } from '../../core/services/experiment.service';
import { LIKERT_OPTIONS, LikertValue, SurveyQuestion } from '../../core/models/survey.model';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {
  public questions: SurveyQuestion[] = [];
  public readonly likertOptions = LIKERT_OPTIONS;

  public answers: Record<string, LikertValue> = {};
  public preferredCatalog: '2D' | '3D' | 'AMBOS' | 'NINGUNO' = '3D';
  public purchaseIntentCatalog: '2D' | '3D' | 'INDIFERENTE' = '3D';
  public qualitativeFeedback: string = '';

  public readonly answeredCount = signal<number>(0);
  public readonly validationError = signal<string | null>(null);
  public readonly isSubmitting = signal<boolean>(false);

  // Group questions by dimension title for clear presentation
  public groupedQuestions: { title: string; questions: SurveyQuestion[] }[] = [];

  constructor(
    private surveyService: SurveyService,
    private experimentService: ExperimentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.experimentService.setCurrentStep('survey');
    this.questions = this.surveyService.getQuestions();

    // Grouping
    const groupsMap = new Map<string, SurveyQuestion[]>();
    for (const q of this.questions) {
      const list = groupsMap.get(q.dimensionTitle) || [];
      list.push(q);
      groupsMap.set(q.dimensionTitle, list);
    }
    this.groupedQuestions = Array.from(groupsMap.entries()).map(([title, questions]) => ({
      title,
      questions
    }));
  }

  setAnswer(questionId: string, val: LikertValue): void {
    this.answers[questionId] = val;
    this.answeredCount.set(Object.keys(this.answers).length);
    if (this.validationError()) {
      this.validationError.set(null);
    }
  }

  submitSurvey(): void {
    // Check all questions answered
    const missing = this.questions.filter(q => this.answers[q.id] === undefined);
    if (missing.length > 0) {
      this.validationError.set(`Por favor responde todas las preguntas. Faltan ${missing.length} pregunta(s).`);
      // Scroll to first unanswered question
      const firstMissingId = missing[0].id;
      const el = document.getElementById(firstMissingId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.isSubmitting.set(true);

    const participant = this.experimentService.participant() || {
      id: 'p_anon_' + Date.now().toString(36),
      email: 'anonimo@evaluacion.com',
      ageGroup: '25-34' as const,
      gender: 'Prefiero no decir' as const,
      shoppingFrequency: 'Mensual' as const,
      prior3dExperience: 'Intermedio' as const,
      deviceType: 'Desktop / Laptop' as const,
      registeredAt: new Date().toISOString()
    };

    const submission = this.surveyService.submitSurvey(
      participant.id,
      participant.email,
      participant.ageGroup,
      participant.gender,
      participant.shoppingFrequency,
      participant.prior3dExperience,
      this.answers,
      this.preferredCatalog,
      this.purchaseIntentCatalog,
      this.qualitativeFeedback
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    this.experimentService.setCurrentStep('complete');
    this.router.navigate(['/completado']);
  }
}
