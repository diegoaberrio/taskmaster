import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { RewardListComponent } from './reward-list/reward-list.component';
import { RewardDetailComponent } from './reward-detail/reward-detail.component';
import { RewardRedeemComponent } from './reward-redeem/reward-redeem.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },
  { path: 'create-task', component: TaskCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit-task/:id', component: TaskEditComponent, canActivate: [AuthGuard] },
  { path: 'rewards', component: RewardListComponent, canActivate: [AuthGuard] },
  { path: 'rewards/:id', component: RewardDetailComponent, canActivate: [AuthGuard] },
  { path: 'redeem-reward', component: RewardRedeemComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/dashboard' }
];
