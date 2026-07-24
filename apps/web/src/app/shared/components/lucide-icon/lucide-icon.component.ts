/** OBJETIVO DO ARQUIVO: Encapsula a renderização segura dos ícones Lucide usados na interface.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Exporta este contrato ou implementação para uso por outros módulos.
export type LucideIconName = 'square-pen' | 'calculator' | 'x' | 'delete';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-lucide-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name) {
        @case ('calculator') {
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <line x1="8" x2="16" y1="6" y2="6" />
          <line x1="16" x2="16" y1="14" y2="18" />
          <path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
        }
        @case ('x') {
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        }
        @case ('delete') {
          <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" /><line x1="18" x2="12" y1="9" y2="15" /><line x1="12" x2="18" y1="9" y2="15" />
        }
        @case ('square-pen') {
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
        }
      }
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; width: 16px; height: 16px; flex: 0 0 auto; }
    svg { width: 100%; height: 100%; }
  `]
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class LucideIconComponent {
  @Input({ required: true }) name!: LucideIconName;
}
