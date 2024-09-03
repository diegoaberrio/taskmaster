import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: NgForm) {
    console.log('Form submitted', loginForm);
    if (loginForm.valid) {
      console.log('Form is valid', this.credentials);
      this.authService.login(this.credentials).subscribe(
        response => {
          console.log('User logged in successfully', response);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Error logging in', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
