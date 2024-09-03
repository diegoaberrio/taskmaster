import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatTooltipModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus: string = '';
  selectedUser: number | null = null;
  selectedPriority: string = '';
  users: User[] = [];
  selectedDateRange: string = 'all';
  isLoggedIn: boolean = false;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe({
      next: (status) => {
        this.isLoggedIn = !!status;
        if (this.isLoggedIn) {
          this.loadTasks();
          this.loadUsers();
        } else {
          this.router.navigate(['/login']);
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching auth status', err);
      }
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  applyFilter(): void {
    const now = new Date();
    let startDate: Date;

    switch (this.selectedDateRange) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatus = this.selectedStatus ? task.status === this.selectedStatus : true;
      const matchesUser = this.selectedUser ? task.user_id === this.selectedUser : true;
      const matchesPriority = this.selectedPriority ? task.priority === this.selectedPriority : true;
      const taskStartDate = task.start_date ? new Date(task.start_date) : new Date(0);
      const matchesDate = taskStartDate >= startDate;
      return matchesStatus && matchesUser && matchesPriority && matchesDate;
    });
  }

  confirmDeleteTask(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask(id);
      }
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      }
    });
  }

  completeTask(id: number): void {
    this.taskService.completeTask(id).subscribe({
      next: (response) => {
        console.log(`Task completed. Points awarded: ${response.points}`);
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error completing task:', err);
      }
    });
}


  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'hourglass_empty';
      case 'in-progress':
        return 'autorenew';
      case 'completed':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getStatusColorClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'in-progress':
        return 'in-progress';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'low':
        return 'arrow_downward';
      case 'medium':
        return 'arrow_forward';
      case 'high':
        return 'arrow_upward';
      default:
        return 'help';
    }
  }

  getPriorityColorClass(priority: string): string {
    switch (priority) {
      case 'low':
        return 'low';
      case 'medium':
        return 'medium';
      case 'high':
        return 'high';
      default:
        return '';
    }
  }

  getDateRangeIcon(dateRange: string): string {
    switch (dateRange) {
      case 'day':
        return 'today';
      case 'week':
        return 'date_range';
      case 'month':
        return 'event';
      default:
        return 'date_range';
    }
  }

  getDateRangeColorClass(dateRange: string): string {
    switch (dateRange) {
      case 'day':
        return 'day-icon';
      case 'week':
        return 'week-icon';
      case 'month':
        return 'month-icon';
      default:
        return '';
    }
  }

  getUserName(userId: number): string {
    const user = this.users.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  }

  navigateToCreateTask(): void {
    this.router.navigate(['/create-task']);
  }
}
