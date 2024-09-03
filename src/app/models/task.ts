// src/app/models/task.ts
export interface Task {
  id?: number;
  user_id: number;
  userName?: string;  // Añadido para incluir el nombre del usuario
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  start_date?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}
