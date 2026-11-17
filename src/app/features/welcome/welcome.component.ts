import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExperimentService } from '../../core/services/experiment.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  public form!: FormGroup;
  public readonly isSubmitting = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private experimentService: ExperimentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.experimentService.setCurrentStep('welcome');

    const existing = this.experimentService.participant();

    // Auto-detect device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const defaultDevice = isMobile ? 'Móvil' : 'Desktop / Laptop';

    this.form = this.fb.group({
      email: [existing?.email || '', [Validators.required, Validators.email]],
      fullName: [existing?.fullName || ''],
      ageGroup: [existing?.ageGroup || '25-34', Validators.required],
      gender: [existing?.gender || 'Prefiero no decir', Validators.required],
      shoppingFrequency: [existing?.shoppingFrequency || 'Mensual', Validators.required],
      prior3dExperience: [existing?.prior3dExperience || 'Básico / Poca', Validators.required],
      deviceType: [existing?.deviceType || defaultDevice, Validators.required],
      consent: [true, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const val = this.form.value;

    this.experimentService.registerParticipant({
      email: val.email,
      fullName: val.fullName,
      ageGroup: val.ageGroup,
      gender: val.gender,
      shoppingFrequency: val.shoppingFrequency,
      prior3dExperience: val.prior3dExperience,
      deviceType: val.deviceType
    });

    this.experimentService.setCurrentStep('catalog-2d');
    this.router.navigate(['/catalogo-2d']);
  }

  startDirectDemo(): void {
    // Quick registration for jury evaluation
    this.experimentService.registerParticipant({
      email: 'jurado.sustentacion@tesis.edu.pe',
      fullName: 'Miembro del Jurado Calificador',
      ageGroup: '35-44',
      gender: 'Prefiero no decir',
      shoppingFrequency: 'Semanal',
      prior3dExperience: 'Intermedio',
      deviceType: 'Desktop / Laptop'
    });
    this.router.navigate(['/catalogo-2d']);
  }
}
