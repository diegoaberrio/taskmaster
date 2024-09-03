import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';  
import { RewardService } from '../services/reward.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-reward-redeem',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule 
  ],
  templateUrl: './reward-redeem.component.html',
  styleUrls: ['./reward-redeem.component.css']
})
export class RewardRedeemComponent implements OnInit {
  rewardId: number | null = null;
  userId: number | null = null;

  constructor(
    private rewardService: RewardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.id !== undefined) {
      this.userId = currentUser.id;
    }
  }

  onSubmit(): void {
    if (this.userId && this.rewardId) {
      this.rewardService.redeemReward(this.userId, this.rewardId).subscribe(
        response => {
          alert('Reward redeemed successfully');
        },
        error => {
          console.error('Error redeeming reward', error);
        }
      );
    } else {
      alert('Please provide a valid reward ID.');
    }
  }
}
