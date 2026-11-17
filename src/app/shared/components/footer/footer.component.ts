import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div class="flex flex-col gap-1 text-center md:text-left">
          <p class="font-medium text-slate-300">
            Proyecto de Tesis de Grado:
            <span class="text-white italic">
              «Entorno y modelos 3D para la interacción con productos de los catálogos online y su influencia en la intención de compra»
            </span>
          </p>
          <p class="text-slate-500">
            Instrumento de medición basado en el Modelo de Aceptación Tecnológica (TAM - Davis) y Telepresencia e Intención de Compra.
          </p>
        </div>

        <div class="flex items-center gap-4 text-slate-500">
          <span>WebGL • Three.js</span>
          <span>•</span>
          <span>TypeScript & Angular</span>
          <span>•</span>
          <span>Análisis Estadístico SPSS</span>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {}
