import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TaskStats {
  totalTasks: number;
  tasksByStatus: {
    priority: string;
    status: string;
    count: number;
  }[];
  tasksByUser: {
    userId: number;
    name: string;
    count: number;
  }[];
}

export interface UserStats {
  totalUsers: number;
  usersByPoints: {
    userId: number;
    name: string;
    points: number;
    tasksCompleted: number;
    tasksAssigned: number;
  }[];
}

export interface RewardStats {
  totalRewards: number;
  totalPointsSpent: number;
  popularRewards: {
    times_redeemed: any;
    rewardId: number;
    rewardName: string;
    count: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTaskStatistics(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.apiUrl}/statistics/tasks`)
      .pipe(
        catchError(this.handleError<TaskStats>('getTaskStatistics', { totalTasks: 0, tasksByStatus: [], tasksByUser: [] }))
      );
  }

  getUserStatistics(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/statistics/users`)
      .pipe(
        catchError(this.handleError<UserStats>('getUserStatistics', { totalUsers: 0, usersByPoints: [] }))
      );
  }

  getRewardStatistics(): Observable<RewardStats> {
    return this.http.get<RewardStats>(`${this.apiUrl}/statistics/rewards`)
      .pipe(
        catchError(this.handleError<RewardStats>('getRewardStatistics', { totalRewards: 0, totalPointsSpent: 0, popularRewards: [] }))
      );
  }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
