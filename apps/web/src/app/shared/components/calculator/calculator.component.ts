/** OBJETIVO DO ARQUIVO: Implementa a lógica da calculadora comum e científica.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

type CalculatorMode = 'standard' | 'scientific';
type Token = { type: 'number'; value: number } | { type: 'operator'; value: string } | { type: 'function'; value: string } | { type: 'leftParen' | 'rightParen' };

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [LucideIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
// Exporta este contrato ou implementação para uso por outros módulos.
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

  /** Executa `openCalculator` e mantém esta etapa do fluxo concentrada em um único ponto. */
  openCalculator(): void {
    this.open.set(true);
    queueMicrotask(() => this.dialog?.nativeElement.focus());
  }

  /** Executa `closeCalculator` e mantém esta etapa do fluxo concentrada em um único ponto. */
  closeCalculator(): void {
    this.open.set(false);
  }

  /** Executa `setMode` e mantém esta etapa do fluxo concentrada em um único ponto. */
  setMode(mode: CalculatorMode): void {
    this.mode.set(mode);
  }

  /** Executa `input` e mantém esta etapa do fluxo concentrada em um único ponto. */
  input(value: string): void {
    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (this.justEvaluated && /[0-9.(]/.test(value)) {
      this.expression.set('');
      this.display.set('0');
      // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
      this.lastOperation = null;
    }
    // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
    this.justEvaluated = false;

    const normalized = value === ',' ? '.' : value;
    const next = `${this.expression()}${normalized}`;
    this.expression.set(next);
    this.display.set(next || '0');
  }

  /** Executa `functionInput` e mantém esta etapa do fluxo concentrada em um único ponto. */
  functionInput(name: string): void {
    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (this.justEvaluated) {
      this.expression.set('');
      // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
      this.justEvaluated = false;
    }
    const next = `${this.expression()}${name}(`;
    this.expression.set(next);
    this.display.set(next);
  }

  /** Executa `clear` e mantém esta etapa do fluxo concentrada em um único ponto. */
  clear(): void {
    this.expression.set('');
    this.display.set('0');
    // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
    this.justEvaluated = false;
    // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
    this.lastOperation = null;
  }

  /** Executa `backspace` e mantém esta etapa do fluxo concentrada em um único ponto. */
  backspace(): void {
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (this.justEvaluated) return;
    const next = this.expression().slice(0, -1);
    this.expression.set(next);
    this.display.set(next || '0');
  }

  /** Executa `toggleSign` e mantém esta etapa do fluxo concentrada em um único ponto. */
  toggleSign(): void {
    const current = this.expression().trim();
    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (!current) {
      this.expression.set('-');
      this.display.set('-');
      return;
    }
    const match = current.match(/(-?\d+(?:\.\d+)?)$/);
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (!match || match.index === undefined) return;
    const number = match[1];
    const replacement = number.startsWith('-') ? number.slice(1) : `-${number}`;
    const next = `${current.slice(0, match.index)}${replacement}`;
    this.expression.set(next);
    this.display.set(next);
  }

  /** Executa `percent` e mantém esta etapa do fluxo concentrada em um único ponto. */
  percent(): void {
    const current = this.expression().trim();
    const match = current.match(/(-?\d+(?:\.\d+)?)$/);
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (!match || match.index === undefined) return;
    const value = Number(match[1]) / 100;
    const next = `${current.slice(0, match.index)}${this.format(value)}`;
    this.expression.set(next);
    this.display.set(next);
  }

  /** Executa `evaluate` e mantém esta etapa do fluxo concentrada em um único ponto. */
  evaluate(): void {
    try {
      /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
      if (this.justEvaluated && this.lastOperation) {
        const currentValue = Number(this.display().replace(',', '.'));
        const repeated = this.applyOperator(currentValue, this.lastOperation.operator, this.lastOperation.operand);
        this.display.set(this.format(repeated));
        this.expression.set(this.format(repeated));
        return;
      }

      const source = this.expression().trim();
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (!source) return;
      const result = this.calculate(source);
      this.captureLastOperation(source);
      const formatted = this.format(result);
      this.display.set(formatted);
      this.expression.set(formatted);
      // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
      this.justEvaluated = true;
    } catch {
      this.display.set('Erro');
      // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
      this.justEvaluated = true;
      // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
      this.lastOperation = null;
    }
  }

  memoryClear(): void { this.memory.set(0); this.hasMemory.set(false); }
  memoryRecall(): void { this.expression.set(this.format(this.memory())); this.display.set(this.format(this.memory())); this.justEvaluated = false; }
  memoryAdd(): void { this.updateMemory(1); }
  memorySubtract(): void { this.updateMemory(-1); }

  /** Executa `updateMemory` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private updateMemory(direction: 1 | -1): void {
    try {
      const value = this.expression().trim() ? this.calculate(this.expression()) : Number(this.display());
      // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
      this.memory.update(current => current + direction * value);
      this.hasMemory.set(true);
    } catch { /* mantém memória inalterada */ }
  }

  @HostListener('document:keydown', ['$event'])
  /** Executa `onKeydown` e mantém esta etapa do fluxo concentrada em um único ponto. */
  onKeydown(event: KeyboardEvent): void {
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (!this.open()) return;

    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeCalculator();
      return;
    }
    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      this.evaluate();
      return;
    }
    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.backspace();
      return;
    }
    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (event.key === 'Delete') {
      event.preventDefault();
      this.clear();
      return;
    }
    /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
    if (/^[0-9()+\-*/^.,]$/.test(event.key)) {
      event.preventDefault();
      // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
      this.input(event.key === '*' ? '×' : event.key === '/' ? '÷' : event.key);
    }
  }

  /** Executa `calculate` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private calculate(source: string): number {
    const normalized = source
      .replace(/,/g, '.')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E));
    const tokens = this.tokenize(normalized);
    const output = this.toRpn(tokens);
    // Retorna o valor calculado sem manter estado oculto.
    return this.evaluateRpn(output);
  }

  /** Executa `tokenize` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    let index = 0;
    /** Executa `while` e mantém esta etapa do fluxo concentrada em um único ponto. */
    while (index < source.length) {
      const char = source[index];
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (/\s/.test(char)) { index++; continue; }
      /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
      if (/[0-9.]/.test(char)) {
        let number = char;
        index++;
        while (index < source.length && /[0-9.]/.test(source[index])) number += source[index++];
        const value = Number(number);
        // Interrompe ou direciona o fluxo conforme o estado atual.
        if (!Number.isFinite(value)) throw new Error('Número inválido');
        tokens.push({ type: 'number', value });
        continue;
      }
      /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
      if (/[a-z]/i.test(char)) {
        let name = char;
        index++;
        while (index < source.length && /[a-z]/i.test(source[index])) name += source[index++];
        tokens.push({ type: 'function', value: name.toLowerCase() });
        continue;
      }
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if ('+-*/^'.includes(char)) { tokens.push({ type: 'operator', value: char }); index++; continue; }
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (char === '(') { tokens.push({ type: 'leftParen' }); index++; continue; }
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (char === ')') { tokens.push({ type: 'rightParen' }); index++; continue; }
      throw new Error('Símbolo inválido');
    }
    // Retorna o valor calculado sem manter estado oculto.
    return this.normalizeUnaryMinus(tokens);
  }

  /** Executa `normalizeUnaryMinus` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private normalizeUnaryMinus(tokens: Token[]): Token[] {
    const result: Token[] = [];
    tokens.forEach((token, index) => {
      /** Executa `if` e mantém esta etapa do fluxo concentrada em um único ponto. */
      if (token.type === 'operator' && token.value === '-' && (index === 0 || ['operator', 'leftParen'].includes(tokens[index - 1].type))) {
        result.push({ type: 'number', value: 0 });
      }
      result.push(token);
    });
    // Retorna o valor calculado sem manter estado oculto.
    return result;
  }

  /** Executa `toRpn` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private toRpn(tokens: Token[]): Token[] {
    const output: Token[] = [];
    const stack: Token[] = [];
    const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

    /** Executa `for` e mantém esta etapa do fluxo concentrada em um único ponto. */
    for (const token of tokens) {
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (token.type === 'number') output.push(token);
      else if (token.type === 'function') stack.push(token);
      else if (token.type === 'operator') {
        /** Executa `while` e mantém esta etapa do fluxo concentrada em um único ponto. */
        while (stack.length) {
          const top = stack[stack.length - 1];
          // Interrompe ou direciona o fluxo conforme o estado atual.
          if (top.type === 'function' || (top.type === 'operator' && ((precedence[top.value] > precedence[token.value]) || (precedence[top.value] === precedence[token.value] && token.value !== '^')))) output.push(stack.pop()!);
          else break;
        }
        stack.push(token);
      } else if (token.type === 'leftParen') stack.push(token);
      else {
        while (stack.length && stack[stack.length - 1].type !== 'leftParen') output.push(stack.pop()!);
        // Interrompe ou direciona o fluxo conforme o estado atual.
        if (!stack.length) throw new Error('Parênteses inválidos');
        stack.pop();
        // Interrompe ou direciona o fluxo conforme o estado atual.
        if (stack.length && stack[stack.length - 1].type === 'function') output.push(stack.pop()!);
      }
    }
    /** Executa `while` e mantém esta etapa do fluxo concentrada em um único ponto. */
    while (stack.length) {
      const token = stack.pop()!;
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (token.type === 'leftParen' || token.type === 'rightParen') throw new Error('Parênteses inválidos');
      output.push(token);
    }
    // Retorna o valor calculado sem manter estado oculto.
    return output;
  }

  /** Executa `evaluateRpn` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private evaluateRpn(tokens: Token[]): number {
    const stack: number[] = [];
    /** Executa `for` e mantém esta etapa do fluxo concentrada em um único ponto. */
    for (const token of tokens) {
      // Interrompe ou direciona o fluxo conforme o estado atual.
      if (token.type === 'number') stack.push(token.value);
      else if (token.type === 'operator') {
        const right = stack.pop(); const left = stack.pop();
        // Interrompe ou direciona o fluxo conforme o estado atual.
        if (left === undefined || right === undefined) throw new Error('Expressão inválida');
        stack.push(this.applyOperator(left, token.value, right));
      } else if (token.type === 'function') {
        const value = stack.pop();
        // Interrompe ou direciona o fluxo conforme o estado atual.
        if (value === undefined) throw new Error('Função inválida');
        stack.push(this.applyFunction(token.value, value));
      }
    }
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (stack.length !== 1 || !Number.isFinite(stack[0])) throw new Error('Resultado inválido');
    // Retorna o valor calculado sem manter estado oculto.
    return stack[0];
  }

  /** Executa `applyOperator` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private applyOperator(left: number, operator: string, right: number): number {
    /** Executa `switch` e mantém esta etapa do fluxo concentrada em um único ponto. */
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': if (right === 0) throw new Error('Divisão por zero'); return left / right;
      case '^': return Math.pow(left, right);
      default: throw new Error('Operador inválido');
    }
  }

  /** Executa `applyFunction` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private applyFunction(name: string, value: number): number {
    /** Executa `switch` e mantém esta etapa do fluxo concentrada em um único ponto. */
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

  /** Executa `captureLastOperation` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private captureLastOperation(source: string): void {
    const normalized = source.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.');
    const match = normalized.match(/([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*$/);
    // Atualiza o estado local usado pela interface ou pelo próximo passo do fluxo.
    this.lastOperation = match ? { operator: match[1], operand: Number(match[2]) } : null;
  }

  /** Executa `format` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private format(value: number): string {
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (!Number.isFinite(value)) throw new Error('Resultado inválido');
    const rounded = Math.abs(value) < 1e-12 ? 0 : Number(value.toPrecision(14));
    // Retorna o valor calculado sem manter estado oculto.
    return String(rounded);
  }
}
