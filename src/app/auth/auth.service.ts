import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');
    console.log('Stored user from localStorage:', storedUser);
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string, password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        if (user) {
          console.log('User received from API:', user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          console.log('User subject updated:', this.currentUserValue);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getAuthStatus(): Observable<User | null> {
    return this.currentUser;
  }

  getUserId(): number | undefined {
    const currentUser = this.currentUserValue;
    console.log('Getting user ID - Current user:', currentUser);
    return currentUser ? currentUser.id : undefined;
  }

  getUserEmail(): string | undefined {
    const currentUser = this.currentUserValue;
    console.log('Getting user Email - Current user:', currentUser);
    return currentUser ? currentUser.email : undefined;
  }

  getUserPoints(): number | undefined {
    const currentUser = this.currentUserValue;
    console.log('Getting user Points - Current user:', currentUser);
    return currentUser ? currentUser.points : undefined;
  }
}
