/** OBJETIVO DO ARQUIVO: Detecta quando o usuário chegou ao fim da lista para carregar mais itens.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output, inject } from '@angular/core';

// Declara uma diretiva reutilizável que adiciona comportamento a um elemento.
@Directive({ selector: '[appInfiniteScrollSentinel]', standalone: true })
// Exporta este contrato ou implementação para uso por outros módulos.
export class InfiniteScrollSentinelDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  @Output() reached = new EventEmitter<void>();

  /** Executa `ngAfterViewInit` e mantém esta etapa do fluxo concentrada em um único ponto. */
  ngAfterViewInit(): void {
    // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
    this.observer = new IntersectionObserver(entries => {
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (entries.some(entry => entry.isIntersecting)) this.reached.emit();
    }, { rootMargin: '240px 0px' });
    this.observer.observe(this.element.nativeElement);
  }

  /** Executa `ngOnDestroy` e mantém esta etapa do fluxo concentrada em um único ponto. */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
