import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output, inject } from '@angular/core';

@Directive({ selector: '[appInfiniteScrollSentinel]', standalone: true })
export class InfiniteScrollSentinelDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  @Output() reached = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) this.reached.emit();
    }, { rootMargin: '240px 0px' });
    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
