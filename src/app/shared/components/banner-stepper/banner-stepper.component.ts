import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExperimentService } from '../../../core/services/experiment.service';

@Component({
  selector: 'app-banner-stepper',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 py-2.5">
        <div class="flex items-center justify-between gap-2 overflow-x-auto">
          
          <!-- Step 1: Registro -->
          <a
            routerLink="/"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            [ngClass]="activeStep() === 'welcome' ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' : 'text-slate-600 hover:text-slate-900'"
          >
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
              [ngClass]="hasParticipant() ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'"
            >
              @if (hasParticipant()) { ✓ } @else { 1 }
            </span>
            <span>1. Registro / Consentimiento</span>
          </a>

          <div class="w-4 h-0.5 bg-slate-200 shrink-0"></div>

          <!-- Step 2: Catálogo 2D -->
          <a
            routerLink="/catalogo-2d"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            [ngClass]="activeStep() === 'catalog-2d' ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' : 'text-slate-600 hover:text-slate-900'"
          >
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
              [ngClass]="hasTested2D() ? 'bg-emerald-500 text-white' : (activeStep() === 'catalog-2d' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700')"
            >
              @if (hasTested2D()) { ✓ } @else { 2 }
            </span>
            <span>2. Explorar Catálogo 2D (Fotos)</span>
          </a>

          <div class="w-4 h-0.5 bg-slate-200 shrink-0"></div>

          <!-- Step 3: Catálogo 3D -->
          <a
            routerLink="/catalogo-3d"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            [ngClass]="activeStep() === 'catalog-3d' ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' : 'text-slate-600 hover:text-slate-900'"
          >
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
              [ngClass]="hasTested3D() ? 'bg-emerald-500 text-white' : (activeStep() === 'catalog-3d' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700')"
            >
              @if (hasTested3D()) { ✓ } @else { 3 }
            </span>
            <span>3. Explorar Catálogo 3D (Interactivo)</span>
          </a>

          <div class="w-4 h-0.5 bg-slate-200 shrink-0"></div>

          <!-- Step 4: Encuesta -->
          <a
            routerLink="/encuesta"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            [ngClass]="activeStep() === 'survey' ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' : 'text-slate-600 hover:text-slate-900'"
          >
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
              [ngClass]="activeStep() === 'survey' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'"
            >
              4
            </span>
            <span class="flex items-center gap-1">
              <span>4. Encuesta de Tesis</span>
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </span>
          </a>

        </div>
      </div>
    </div>
  `
})
export class BannerStepperComponent {
  public readonly activeStep = computed(() => this.experimentService.currentStep());
  public readonly hasParticipant = computed(() => !!this.experimentService.participant());
  public readonly hasTested2D = computed(() => this.experimentService.hasTested2D());
  public readonly hasTested3D = computed(() => this.experimentService.hasTested3D());

  constructor(public experimentService: ExperimentService) {}
}
