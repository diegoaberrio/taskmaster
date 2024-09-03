import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task';

interface CompleteTaskResponse {
  id: number;
  points: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las tareas.
   * @returns Observable con la lista de tareas.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Obtiene todas las tareas. Método redundante pero puede ser útil en caso de renombrar en el futuro.
   * @returns Observable con la lista de tareas.
   */
  getAllTasks(): Observable<Task[]> {
    return this.getTasks();
  }

  /**
   * Obtiene una tarea por su ID.
   * @param id - El ID de la tarea.
   * @returns Observable con los detalles de la tarea.
   */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva tarea.
   * @param task - Los datos de la tarea a crear.
   * @returns Observable con la tarea creada.
   */
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /**
   * Actualiza una tarea existente.
   * @param id - El ID de la tarea a actualizar.
   * @param task - Los datos actualizados de la tarea.
   * @returns Observable con la tarea actualizada.
   */
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  /**
   * Elimina una tarea por su ID.
   * @param id - El ID de la tarea a eliminar.
   * @returns Observable<void> indicando el resultado de la operación.
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene estadísticas de las tareas.
   * @returns Observable con las estadísticas de las tareas.
   */
  getTaskStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  /**
   * Obtiene tareas por su estado.
   * @param status - El estado de las tareas a obtener.
   * @returns Observable con la lista de tareas.
   */
  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?status=${status}`);
  }

  /**
   * Obtiene tareas por su prioridad.
   * @param priority - La prioridad de las tareas a obtener.
   * @returns Observable con la lista de tareas.
   */
  getTasksByPriority(priority: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?priority=${priority}`);
  }

  /**
   * Marca una tarea como completada.
   * @param id - El ID de la tarea a completar.
   * @returns Observable con el ID de la tarea completada y los puntos otorgados.
   */
  completeTask(id: number): Observable<{ id: number, points: number }> {
    return this.http.put<{ id: number, points: number }>(`${this.apiUrl}/${id}/complete`, {});
  }
}
