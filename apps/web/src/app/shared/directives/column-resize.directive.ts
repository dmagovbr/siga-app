/** OBJETIVO DO ARQUIVO: Adiciona redimensionamento de largura às colunas do grid.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

// Declara uma diretiva reutilizável que adiciona comportamento a um elemento.
@Directive({ selector: '[appColumnResize]', standalone: true })
// Exporta este contrato ou implementação para uso por outros módulos.
export class ColumnResizeDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly larguraMinima = 90;

  @HostListener('pointerdown', ['$event'])
  /** Executa `iniciar` e mantém esta etapa do fluxo concentrada em um único ponto. */
  iniciar(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const coluna = this.element.nativeElement.parentElement as HTMLElement | null;
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (!coluna) return;

    const inicioX = event.clientX;
    const larguraInicial = coluna.getBoundingClientRect().width;
    const mover = (movimento: PointerEvent) => this.redimensionar(coluna, larguraInicial + movimento.clientX - inicioX);
    const soltar = () => {
      window.removeEventListener('pointermove', mover);
      document.body.classList.remove('grid-resizing');
    };

    document.body.classList.add('grid-resizing');
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar, { once: true });
  }

  /** Executa `redimensionar` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private redimensionar(coluna: HTMLElement, larguraDesejada: number): void {
    const largura = Math.max(this.larguraMinima, Math.round(larguraDesejada));
    coluna.style.width = `${largura}px`;
    coluna.style.minWidth = `${largura}px`;
    coluna.style.maxWidth = `${largura}px`;
  }
}
