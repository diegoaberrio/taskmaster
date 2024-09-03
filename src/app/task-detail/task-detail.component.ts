import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule // Asegúrate de importar RouterModule aquí
  ]
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(+taskId);
    }
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe(task => {
      this.task = task;
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
}
