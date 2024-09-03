// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las notificaciones de un usuario específico.
   * @param userId - El ID del usuario.
   * @returns Observable con la lista de notificaciones.
   */
  getUserNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Marca una notificación como leída.
   * @param notificationId - El ID de la notificación.
   * @returns Observable con el resultado de la operación.
   */
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }

  /**
   * Elimina una notificación.
   * @param notificationId - El ID de la notificación.
   * @returns Observable con el resultado de la operación.
   */
  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`);
  }

  // Puedes agregar otros métodos para manejar notificaciones aquí, como crear, etc.
}
