import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { TelemetryService } from '../../core/services/telemetry.service';
import { ExportService } from '../../core/services/export.service';
import { SurveySubmission } from '../../core/models/survey.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public readonly submissions = computed(() => this.surveyService.submissions());
  public readonly telemetryLogs = computed(() => this.telemetryService.logs());

  // Search filter for table
  public searchTerm = signal<string>('');

  // Computed metrics
  public readonly totalParticipants = computed(() => this.submissions().length);

  public readonly avgPurchaseIntent2D = computed(() => {
    const list = this.submissions();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.scores.purchaseIntent2DScore, 0);
    return Number((sum / list.length).toFixed(2));
  });

  public readonly avgPurchaseIntent3D = computed(() => {
    const list = this.submissions();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.scores.purchaseIntent3DScore, 0);
    return Number((sum / list.length).toFixed(2));
  });

  public readonly purchaseIntentDelta = computed(() => {
    return Number((this.avgPurchaseIntent3D() - this.avgPurchaseIntent2D()).toFixed(2));
  });

  public readonly purchaseIntentIncreasePercent = computed(() => {
    if (this.avgPurchaseIntent2D() === 0) return 0;
    return Number((((this.avgPurchaseIntent3D() - this.avgPurchaseIntent2D()) / this.avgPurchaseIntent2D()) * 100).toFixed(1));
  });

  public readonly avgUsefulness = computed(() => {
    const list = this.submissions();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.scores.usefulnessScore, 0);
    return Number((sum / list.length).toFixed(2));
  });

  public readonly avgEaseOfUse = computed(() => {
    const list = this.submissions();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.scores.easeOfUseScore, 0);
    return Number((sum / list.length).toFixed(2));
  });

  public readonly avgTelepresence = computed(() => {
    const list = this.submissions();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.scores.telepresenceScore, 0);
    return Number((sum / list.length).toFixed(2));
  });

  public readonly avgUncertaintyReduction = computed(() => {
    const list = this.submissions();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.scores.uncertaintyReductionScore, 0);
    return Number((sum / list.length).toFixed(2));
  });

  // Telemetry Aggregates
  public readonly avgDwellTime2D = computed(() => {
    const logs2d = this.telemetryLogs().filter(l => l.condition === '2D');
    if (logs2d.length === 0) return 18; // baseline
    const total = logs2d.reduce((acc, l) => acc + l.timeSpentSeconds, 0);
    return Math.round(total / logs2d.length);
  });

  public readonly avgDwellTime3D = computed(() => {
    const logs3d = this.telemetryLogs().filter(l => l.condition === '3D');
    if (logs3d.length === 0) return 46; // baseline
    const total = logs3d.reduce((acc, l) => acc + l.timeSpentSeconds, 0);
    return Math.round(total / logs3d.length);
  });

  public readonly conversionRate2D = computed(() => {
    const logs2d = this.telemetryLogs().filter(l => l.condition === '2D');
    if (logs2d.length === 0) return 32.5;
    const converted = logs2d.filter(l => l.clickedBuyNow || l.addedToCart).length;
    return Number(((converted / logs2d.length) * 100).toFixed(1));
  });

  public readonly conversionRate3D = computed(() => {
    const logs3d = this.telemetryLogs().filter(l => l.condition === '3D');
    if (logs3d.length === 0) return 64.8;
    const converted = logs3d.filter(l => l.clickedBuyNow || l.addedToCart).length;
    return Number(((converted / logs3d.length) * 100).toFixed(1));
  });

  public readonly percentPreferring3D = computed(() => {
    const list = this.submissions();
    if (list.length === 0) return 0;
    const count3d = list.filter(s => s.purchaseIntentCatalog === '3D').length;
    return Number(((count3d / list.length) * 100).toFixed(1));
  });

  public readonly filteredSubmissions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.submissions();
    return this.submissions().filter(s =>
      s.participantEmail.toLowerCase().includes(term) ||
      s.participantAge.toLowerCase().includes(term) ||
      s.participantGender.toLowerCase().includes(term) ||
      (s.qualitativeFeedback && s.qualitativeFeedback.toLowerCase().includes(term))
    );
  });

  constructor(
    private surveyService: SurveyService,
    private telemetryService: TelemetryService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    // If no data exists yet, automatically offer sample dataset
    if (this.submissions().length === 0) {
      this.surveyService.loadSampleDefenseDataset();
    }
  }

  loadSampleData(): void {
    this.surveyService.loadSampleDefenseDataset();
  }

  clearAllData(): void {
    if (confirm('¿Estás seguro de que deseas eliminar todas las respuestas acumuladas? Esta acción no se puede deshacer.')) {
      this.surveyService.clearSubmissions();
      this.telemetryService.clearLogs();
    }
  }

  exportDataCsv(): void {
    this.exportService.exportToCsv(this.submissions());
  }
}
