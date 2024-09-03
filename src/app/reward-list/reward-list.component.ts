import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardService } from '../services/reward.service';
import { AuthService } from '../auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Reward } from '../models/reward';
import { User } from '../models/user';
import { EditRewardDialog } from '../edit-reward-dialog/edit-reward-dialog.component';

@Component({
  selector: 'app-reward-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.css']
})
export class RewardListComponent implements OnInit, OnDestroy {
  rewards: Reward[] = [];
  currentUser: User | null = null;
  private authSubscription: Subscription = new Subscription();
  newReward: Reward = { id: 0, reward_name: '', points_required: 0 };
  editedReward: Reward | null = null;

  constructor(
    private rewardService: RewardService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('RewardListComponent initialized');
    this.loadRewards();

    // Suscribirse al estado del usuario actual
    this.authSubscription.add(
      this.authService.currentUser.subscribe({
        next: (user) => {
          this.currentUser = user;
          console.log('Current User:', this.currentUser);
          this.cd.detectChanges(); // Forzar la detección de cambios si es necesario
        },
        error: (err) => {
          console.error('Error fetching auth status', err);
        }
      })
    );
  }

  loadRewards(): void {
    this.rewardService.getAllRewards().subscribe({
      next: (data) => {
        console.log('Rewards data loaded:', data);
        this.rewards = data;
      },
      error: (error) => {
        console.error('Error loading rewards:', error);
      }
    });
  }

  redeemReward(rewardId: number): void {
    const userId = this.authService.getUserId();
    if (userId !== undefined) {
      console.log('Current User ID:', userId);
      console.log('Reward ID:', rewardId);

      this.rewardService.redeemReward(userId, rewardId).subscribe({
        next: () => {
          alert('Reward redeemed successfully');
          this.loadRewards();
        },
        error: (err) => {
          if (err.error) {
            console.error('Error redeeming reward:', err.error.message || err.error);
            alert(`Error redeeming reward: ${err.error.message || JSON.stringify(err.error)}`);
          } else {
            console.error('Error redeeming reward:', err);
            alert(`Error redeeming reward: ${JSON.stringify(err)}`);
          }
        }
      });
    } else {
      console.error('User not logged in or invalid user ID');
      alert('User not logged in or invalid user ID');
    }
  }

  createReward(): void {
    if (this.newReward.reward_name && this.newReward.points_required > 0) {
      this.rewardService.createReward(this.newReward).subscribe({
        next: (reward) => {
          alert('Reward created successfully');
          this.rewards.push(reward);
          this.newReward = { id: 0, reward_name: '', points_required: 0 };
        },
        error: (err) => {
          console.error('Error creating reward:', err);
          alert('Error creating reward');
        }
      });
    } else {
      alert('Please provide valid reward details');
    }
  }

  editReward(reward: Reward): void {
    this.editedReward = { ...reward };
    const dialogRef = this.dialog.open(EditRewardDialog, {
      data: { reward: this.editedReward }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateReward(result);
      }
    });
  }

  updateReward(reward: Reward): void {
    if (reward.id !== undefined && reward.id !== 0) {
      this.rewardService.updateReward(reward.id, reward).subscribe({
        next: () => {
          alert('Reward updated successfully');
          this.loadRewards();
        },
        error: (err) => {
          console.error('Error updating reward:', err);
          alert('Error updating reward');
        }
      });
    } else {
      console.error('Reward ID is undefined or invalid');
      alert('Reward ID is undefined or invalid');
    }
  }

  deleteReward(id: number): void {
    if (id !== undefined) {
      this.rewardService.deleteReward(id).subscribe({
        next: () => {
          alert('Reward deleted successfully');
          this.loadRewards();
        },
        error: (err) => {
          console.error('Error deleting reward:', err);
          alert('Error deleting reward');
        }
      });
    } else {
      console.error('Reward ID is undefined');
      alert('Reward ID is undefined');
    }
  }

  saveReward(reward: Reward): void {
    this.updateReward(reward);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe(); // Limpiar suscripciones para evitar fugas de memoria
  }
}
