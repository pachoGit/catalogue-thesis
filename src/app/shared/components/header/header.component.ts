import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExperimentService } from '../../../core/services/experiment.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center gap-3">
            <a routerLink="/" class="flex items-center gap-2.5 group">
              <div
                class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div class="flex flex-col">
                <span
                  class="font-bold text-base tracking-tight text-white flex items-center gap-1.5"
                >
                  Catalogo
                  <span
                    class="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30"
                  >
                    Tesis 3D vs 2D
                  </span>
                </span>
                <span
                  class="text-[11px] text-slate-400 font-light truncate max-w-[200px] sm:max-w-xs"
                >
                  Entorno 3D e Intención de Compra
                </span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation Navigation -->
          <nav class="hidden lg:flex items-center gap-1">
            <a
              routerLink="/catalogo-2d"
              routerLinkActive="bg-slate-800 text-white font-medium"
              class="px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <span>🖼️ Catálogo 2D</span>
            </a>

            <a
              routerLink="/catalogo-3d"
              routerLinkActive="bg-slate-800 text-white font-medium"
              class="px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <span>🪐 Catálogo 3D</span>
            </a>

            <a
              routerLink="/comparacion"
              routerLinkActive="bg-slate-800 text-white font-medium"
              class="px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <span>⚡ Comparador Dual</span>
            </a>

            <a
              routerLink="/encuesta"
              routerLinkActive="bg-indigo-900/60 text-indigo-200 font-medium border border-indigo-500/40"
              class="px-3 py-2 rounded-lg text-xs text-indigo-300 hover:text-white hover:bg-indigo-950 transition-colors flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Encuesta TAM</span>
            </a>

            <!-- Sustentación / Admin Dashboard Button -->
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-emerald-950 text-emerald-300 font-medium ring-1 ring-emerald-500/50"
              class="ml-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>Panel de Sustentación</span>
            </a>
          </nav>

          <!-- Participant Status / Mobile Toggle -->
          <div class="flex items-center gap-2">
            @if (participant()) {
              <div
                class="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-xs"
              >
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span class="text-slate-300 truncate max-w-32">{{ participant()?.email }}</span>
                <button
                  type="button"
                  (click)="resetSession()"
                  title="Cambiar evaluador / Reiniciar sesión"
                  class="text-slate-400 hover:text-rose-400 text-[11px] ml-1"
                >
                  ✕
                </button>
              </div>
            } @else {
              <a
                routerLink="/"
                class="hidden sm:inline-flex items-center text-xs text-indigo-300 hover:text-white bg-indigo-900/40 px-2.5 py-1 rounded-full border border-indigo-700/50"
              >
                Identificarse
              </a>
            }

            <!-- Mobile Menu Toggle -->
            <button
              type="button"
              (click)="isMobileMenuOpen.update((v) => !v)"
              class="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        @if (isMobileMenuOpen()) {
          <div class="lg:hidden py-3 border-t border-slate-800 flex flex-col gap-1 pb-4">
            <a
              routerLink="/"
              (click)="isMobileMenuOpen.set(false)"
              class="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              1. Inicio & Consentimiento
            </a>
            <a
              routerLink="/catalogo-2d"
              (click)="isMobileMenuOpen.set(false)"
              class="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              2. Catálogo 2D (Fotos)
            </a>
            <a
              routerLink="/catalogo-3d"
              (click)="isMobileMenuOpen.set(false)"
              class="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              3. Catálogo 3D (Interactivo)
            </a>
            <a
              routerLink="/comparacion"
              (click)="isMobileMenuOpen.set(false)"
              class="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              ⚡ Comparador 2D vs 3D
            </a>
            <a
              routerLink="/encuesta"
              (click)="isMobileMenuOpen.set(false)"
              class="px-3 py-2 rounded-lg text-sm text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900"
            >
              📝 Encuesta de Tesis (TAM)
            </a>
            <a
              routerLink="/dashboard"
              (click)="isMobileMenuOpen.set(false)"
              class="px-3 py-2 rounded-lg text-sm text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900 font-semibold"
            >
              📊 Panel de Sustentación (Admin)
            </a>
          </div>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  public readonly isMobileMenuOpen = signal<boolean>(false);
  public readonly participant = computed(() => this.experimentService.participant());

  constructor(
    private experimentService: ExperimentService,
    private router: Router,
  ) {}

  resetSession(): void {
    if (confirm('¿Deseas reiniciar la sesión para que otro participante o evaluador comience?')) {
      this.experimentService.resetCurrentSession();
      this.router.navigate(['/']);
    }
  }
}
