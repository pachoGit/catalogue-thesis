import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ExperimentSession, ExperimentStep, ParticipantProfile } from '../models/experiment.model';
import { TelemetryService } from './telemetry.service';
import { SurveyService } from './survey.service';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {
  private readonly SESSION_KEY = 'catalogue_thesis_active_participant';

  public readonly participant = signal<ParticipantProfile | null>(this.loadParticipantFromStorage());
  public readonly currentStep = signal<ExperimentStep>('welcome');
  public readonly hasTested2D = signal<boolean>(false);
  public readonly hasTested3D = signal<boolean>(false);

  public readonly isParticipantRegistered = computed(() => !!this.participant());

  constructor(
    private router: Router,
    private telemetryService: TelemetryService,
    private surveyService: SurveyService
  ) {}

  registerParticipant(data: {
    email: string;
    fullName?: string;
    ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
    gender: 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no decir';
    shoppingFrequency: 'Semanal' | 'Mensual' | 'Cada pocos meses' | 'Rara vez / Nunca';
    prior3dExperience: 'Experto' | 'Intermedio' | 'Básico / Poca' | 'Ninguna';
    deviceType: 'Desktop / Laptop' | 'Tablet' | 'Móvil';
  }): ParticipantProfile {
    const profile: ParticipantProfile = {
      id: 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      ...data,
      registeredAt: new Date().toISOString()
    };
    this.participant.set(profile);
    this.saveParticipantToStorage(profile);
    return profile;
  }

  markCatalogTested(condition: '2D' | '3D') {
    if (condition === '2D') {
      this.hasTested2D.set(true);
    } else {
      this.hasTested3D.set(true);
    }
  }

  setCurrentStep(step: ExperimentStep) {
    this.currentStep.set(step);
  }

  resetCurrentSession() {
    this.participant.set(null);
    this.hasTested2D.set(false);
    this.hasTested3D.set(false);
    this.currentStep.set('welcome');
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  private loadParticipantFromStorage(): ParticipantProfile | null {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading active participant', e);
    }
    return null;
  }

  private saveParticipantToStorage(profile: ParticipantProfile) {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving active participant', e);
    }
  }
}
