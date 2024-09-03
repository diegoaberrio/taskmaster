import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { fadeInAnimation, bounceAnimation } from '../animations';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [fadeInAnimation, bounceAnimation]
})
export class NavbarComponent implements OnInit, OnDestroy { 
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(
    public authService: AuthService, 
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.getAuthStatus().subscribe({
      next: (status) => {
        this.isLoggedIn = !!status;
        console.log('NavbarComponent isLoggedIn:', this.isLoggedIn); // Log para verificar el estado
        this.cd.detectChanges(); // Forzar la detección de cambios si es necesario
      },
      error: (err) => {
        console.error('Error fetching auth status', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
