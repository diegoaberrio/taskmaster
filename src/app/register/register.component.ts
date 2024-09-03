import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule
import { UserService } from '../services/user.service'; // Asegúrate de importar el UserService
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule // Agrega MatCardModule aquí
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(registerForm: any) {
    console.log('Form submitted', registerForm);
    if (registerForm.valid) {
      console.log('Form is valid', this.user);
      this.userService.register(this.user).subscribe(
        response => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error registering user', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
