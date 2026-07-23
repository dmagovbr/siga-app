import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface HealthResponse { status: string; application: string; timestamp: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  readonly apiStatus = signal<'carregando' | 'online' | 'offline'>('carregando');
  constructor(private readonly http: HttpClient) {}
  ngOnInit(): void {
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: response => this.apiStatus.set(response.status === 'ok' ? 'online' : 'offline'),
      error: () => this.apiStatus.set('offline')
    });
  }
}
