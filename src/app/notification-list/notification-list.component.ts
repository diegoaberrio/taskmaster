import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../auth/auth.service';
import { Notification } from '../models/notification'; // Asumimos que tienes un modelo de notificación
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ], // Incluir los módulos necesarios
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.id !== undefined) {
      this.loadNotifications(currentUser.id);
    } else {
      console.error('User not logged in or invalid user ID');
    }
  }

  loadNotifications(userId: number): void {
    this.notificationService.getUserNotifications(userId).subscribe(
      (data) => {
        this.notifications = data;
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(
      () => {
        this.notifications = this.notifications.map(notification =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        );
      },
      (error) => {
        console.error('Error marking notification as read', error);
      }
    );
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId).subscribe(
      () => {
        this.notifications = this.notifications.filter(notification => notification.id !== notificationId);
      },
      (error) => {
        console.error('Error deleting notification', error);
      }
    );
  }
}
