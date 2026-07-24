import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

type CalculatorMode = 'standard' | 'scientific';
type Token = { type: 'number'; value: number } | { type: 'operator'; value: string } | { type: 'function'; value: string } | { type: 'leftParen' | 'rightParen' };

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [LucideIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  @ViewChild('dialog') dialog?: ElementRef<HTMLElement>;

  readonly open = signal(false);
  readonly mode = signal<CalculatorMode>('standard');
  readonly expression = signal('');
  readonly display = signal('0');
  readonly memory = signal(0);
  readonly hasMemory = signal(false);

  private justEvaluated = false;
  private lastOperation: { operator: string; operand: number } | null = null;

  openCalculator(): void {
    this.open.set(true);
    queueMicrotask(() => this.dialog?.nativeElement.focus());
  }

  closeCalculator(): void {
    this.open.set(false);
  }

  setMode(mode: CalculatorMode): void {
    this.mode.set(mode);
  }

  input(value: string): void {
    if (this.justEvaluated && /[0-9.(]/.test(value)) {
      this.expression.set('');
      this.display.set('0');
      this.lastOperation = null;
    }
    this.justEvaluated = false;

    const normalized = value === ',' ? '.' : value;
    const next = `${this.expression()}${normalized}`;
    this.expression.set(next);
    this.display.set(next || '0');
  }

  functionInput(name: string): void {
    if (this.justEvaluated) {
      this.expression.set('');
      this.justEvaluated = false;
    }
    const next = `${this.expression()}${name}(`;
    this.expression.set(next);
    this.display.set(next);
  }

  clear(): void {
    this.expression.set('');
    this.display.set('0');
    this.justEvaluated = false;
    this.lastOperation = null;
  }

  backspace(): void {
    if (this.justEvaluated) return;
    const next = this.expression().slice(0, -1);
    this.expression.set(next);
    this.display.set(next || '0');
  }

  toggleSign(): void {
    const current = this.expression().trim();
    if (!current) {
      this.expression.set('-');
      this.display.set('-');
      return;
    }
    const match = current.match(/(-?\d+(?:\.\d+)?)$/);
    if (!match || match.index === undefined) return;
    const number = match[1];
    const replacement = number.startsWith('-') ? number.slice(1) : `-${number}`;
    const next = `${current.slice(0, match.index)}${replacement}`;
    this.expression.set(next);
    this.display.set(next);
  }

  percent(): void {
    const current = this.expression().trim();
    const match = current.match(/(-?\d+(?:\.\d+)?)$/);
    if (!match || match.index === undefined) return;
    const value = Number(match[1]) / 100;
    const next = `${current.slice(0, match.index)}${this.format(value)}`;
    this.expression.set(next);
    this.display.set(next);
  }

  evaluate(): void {
    try {
      if (this.justEvaluated && this.lastOperation) {
        const currentValue = Number(this.display().replace(',', '.'));
        const repeated = this.applyOperator(currentValue, this.lastOperation.operator, this.lastOperation.operand);
        this.display.set(this.format(repeated));
        this.expression.set(this.format(repeated));
        return;
      }

      const source = this.expression().trim();
      if (!source) return;
      const result = this.calculate(source);
      this.captureLastOperation(source);
      const formatted = this.format(result);
      this.display.set(formatted);
      this.expression.set(formatted);
      this.justEvaluated = true;
    } catch {
      this.display.set('Erro');
      this.justEvaluated = true;
      this.lastOperation = null;
    }
  }

  memoryClear(): void { this.memory.set(0); this.hasMemory.set(false); }
  memoryRecall(): void { this.expression.set(this.format(this.memory())); this.display.set(this.format(this.memory())); this.justEvaluated = false; }
  memoryAdd(): void { this.updateMemory(1); }
  memorySubtract(): void { this.updateMemory(-1); }

  private updateMemory(direction: 1 | -1): void {
    try {
      const value = this.expression().trim() ? this.calculate(this.expression()) : Number(this.display());
      this.memory.update(current => current + direction * value);
      this.hasMemory.set(true);
    } catch { /* mantém memória inalterada */ }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeCalculator();
      return;
    }
    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      this.evaluate();
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.backspace();
      return;
    }
    if (event.key === 'Delete') {
      event.preventDefault();
      this.clear();
      return;
    }
    if (/^[0-9()+\-*/^.,]$/.test(event.key)) {
      event.preventDefault();
      this.input(event.key === '*' ? '×' : event.key === '/' ? '÷' : event.key);
    }
  }

  private calculate(source: string): number {
    const normalized = source
      .replace(/,/g, '.')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E));
    const tokens = this.tokenize(normalized);
    const output = this.toRpn(tokens);
    return this.evaluateRpn(output);
  }

  private tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    let index = 0;
    while (index < source.length) {
      const char = source[index];
      if (/\s/.test(char)) { index++; continue; }
      if (/[0-9.]/.test(char)) {
        let number = char;
        index++;
        while (index < source.length && /[0-9.]/.test(source[index])) number += source[index++];
        const value = Number(number);
        if (!Number.isFinite(value)) throw new Error('Número inválido');
        tokens.push({ type: 'number', value });
        continue;
      }
      if (/[a-z]/i.test(char)) {
        let name = char;
        index++;
        while (index < source.length && /[a-z]/i.test(source[index])) name += source[index++];
        tokens.push({ type: 'function', value: name.toLowerCase() });
        continue;
      }
      if ('+-*/^'.includes(char)) { tokens.push({ type: 'operator', value: char }); index++; continue; }
      if (char === '(') { tokens.push({ type: 'leftParen' }); index++; continue; }
      if (char === ')') { tokens.push({ type: 'rightParen' }); index++; continue; }
      throw new Error('Símbolo inválido');
    }
    return this.normalizeUnaryMinus(tokens);
  }

  private normalizeUnaryMinus(tokens: Token[]): Token[] {
    const result: Token[] = [];
    tokens.forEach((token, index) => {
      if (token.type === 'operator' && token.value === '-' && (index === 0 || ['operator', 'leftParen'].includes(tokens[index - 1].type))) {
        result.push({ type: 'number', value: 0 });
      }
      result.push(token);
    });
    return result;
  }

  private toRpn(tokens: Token[]): Token[] {
    const output: Token[] = [];
    const stack: Token[] = [];
    const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

    for (const token of tokens) {
      if (token.type === 'number') output.push(token);
      else if (token.type === 'function') stack.push(token);
      else if (token.type === 'operator') {
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (top.type === 'function' || (top.type === 'operator' && ((precedence[top.value] > precedence[token.value]) || (precedence[top.value] === precedence[token.value] && token.value !== '^')))) output.push(stack.pop()!);
          else break;
        }
        stack.push(token);
      } else if (token.type === 'leftParen') stack.push(token);
      else {
        while (stack.length && stack[stack.length - 1].type !== 'leftParen') output.push(stack.pop()!);
        if (!stack.length) throw new Error('Parênteses inválidos');
        stack.pop();
        if (stack.length && stack[stack.length - 1].type === 'function') output.push(stack.pop()!);
      }
    }
    while (stack.length) {
      const token = stack.pop()!;
      if (token.type === 'leftParen' || token.type === 'rightParen') throw new Error('Parênteses inválidos');
      output.push(token);
    }
    return output;
  }

  private evaluateRpn(tokens: Token[]): number {
    const stack: number[] = [];
    for (const token of tokens) {
      if (token.type === 'number') stack.push(token.value);
      else if (token.type === 'operator') {
        const right = stack.pop(); const left = stack.pop();
        if (left === undefined || right === undefined) throw new Error('Expressão inválida');
        stack.push(this.applyOperator(left, token.value, right));
      } else if (token.type === 'function') {
        const value = stack.pop();
        if (value === undefined) throw new Error('Função inválida');
        stack.push(this.applyFunction(token.value, value));
      }
    }
    if (stack.length !== 1 || !Number.isFinite(stack[0])) throw new Error('Resultado inválido');
    return stack[0];
  }

  private applyOperator(left: number, operator: string, right: number): number {
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': if (right === 0) throw new Error('Divisão por zero'); return left / right;
      case '^': return Math.pow(left, right);
      default: throw new Error('Operador inválido');
    }
  }

  private applyFunction(name: string, value: number): number {
    switch (name) {
      case 'sin': return Math.sin(value * Math.PI / 180);
      case 'cos': return Math.cos(value * Math.PI / 180);
      case 'tan': return Math.tan(value * Math.PI / 180);
      case 'sqrt': return Math.sqrt(value);
      case 'log': return Math.log10(value);
      case 'ln': return Math.log(value);
      case 'abs': return Math.abs(value);
      default: throw new Error('Função desconhecida');
    }
  }

  private captureLastOperation(source: string): void {
    const normalized = source.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.');
    const match = normalized.match(/([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*$/);
    this.lastOperation = match ? { operator: match[1], operand: Number(match[2]) } : null;
  }

  private format(value: number): string {
    if (!Number.isFinite(value)) throw new Error('Resultado inválido');
    const rounded = Math.abs(value) < 1e-12 ? 0 : Number(value.toPrecision(14));
    return String(rounded);
  }
}
