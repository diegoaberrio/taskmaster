import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule]
})
export class DashboardComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(
    public authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.getAuthStatus().subscribe({
      next: (status) => {
        this.isLoggedIn = !!status;
        this.userName = status?.name || ''; // Obtener el nombre del usuario
        console.log('DashboardComponent userName:', this.userName); // Verificar nombre de usuario
        console.log('Auth status:', status); // Verificar el estado de autenticación
        console.log('User name:', this.userName); // Verificar el nombre del usuario
        this.cd.detectChanges(); // Forzar la detección de cambios si es necesario
      },
      error: (err) => {
        console.error('Error fetching auth status', err);
      }
    });
  }

}
