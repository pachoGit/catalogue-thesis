import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { ExperimentService } from '../../core/services/experiment.service';
import { SurveySubmission } from '../../core/models/survey.model';

@Component({
  selector: 'app-complete',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './complete.component.html'
})
export class CompleteComponent implements OnInit {
  public readonly latestSubmission = signal<SurveySubmission | null>(null);

  constructor(
    private surveyService: SurveyService,
    private experimentService: ExperimentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const list = this.surveyService.submissions();
    if (list.length > 0) {
      this.latestSubmission.set(list[0]);
    }
  }

  restartNewParticipant(): void {
    this.experimentService.resetCurrentSession();
    this.router.navigate(['/']);
  }
}
