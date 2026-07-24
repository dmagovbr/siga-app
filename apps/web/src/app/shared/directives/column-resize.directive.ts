import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({ selector: '[appColumnResize]', standalone: true })
export class ColumnResizeDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly larguraMinima = 90;

  @HostListener('pointerdown', ['$event'])
  iniciar(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const coluna = this.element.nativeElement.parentElement as HTMLElement | null;
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

  private redimensionar(coluna: HTMLElement, larguraDesejada: number): void {
    const largura = Math.max(this.larguraMinima, Math.round(larguraDesejada));
    coluna.style.width = `${largura}px`;
    coluna.style.minWidth = `${largura}px`;
    coluna.style.maxWidth = `${largura}px`;
  }
}
