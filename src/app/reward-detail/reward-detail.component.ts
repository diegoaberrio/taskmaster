import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { RewardService } from '../services/reward.service';
import { Reward } from '../models/reward';

@Component({
  selector: 'app-reward-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './reward-detail.component.html',
  styleUrls: ['./reward-detail.component.css']
})
export class RewardDetailComponent implements OnInit {
  reward: Reward | null = null;
  rewardId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private rewardService: RewardService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.rewardId = Number(params.get('id'));
      if (this.rewardId) {
        this.fetchRewardDetail(this.rewardId);
      }
    });
  }

  fetchRewardDetail(id: number): void {
    this.rewardService.getRewardById(id).subscribe(
      (reward) => {
        this.reward = reward;
      },
      (error) => {
        console.error('Error fetching reward details', error);
      }
    );
  }
}
