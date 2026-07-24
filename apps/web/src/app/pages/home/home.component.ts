/** OBJETIVO DO ARQUIVO: Exibe a página inicial após o login.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class HomeComponent {}
