import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatisticsService, UserStats, RewardStats, TaskStats } from '../services/statistics.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  userStatistics: UserStats | null = null;
  rewardStatistics: RewardStats | null = null;
  taskStatistics: TaskStats | null = null;

  userStatisticsByPoints: any[] = [];
  topUsersChart: any;
  tasksByPriorityChart: any;
  workloadChart: any;
  taskCompletionChart: any;
  topRewardsChart: any;
  popularRewardsChart: any;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadUserStatistics();
    this.loadTaskStatistics();
    this.loadRewardStatistics();
  }

  loadUserStatistics(): void {
    this.statisticsService.getUserStatistics().subscribe(
      (data) => {
        this.userStatistics = data;
        this.userStatisticsByPoints = data.usersByPoints;
        console.log('User statistics:', this.userStatistics);
        this.createTopUsersChart();
        this.createTaskCompletionChart();
      },
      (error) => {
        console.error('Error loading user statistics', error);
      }
    );
  }

  loadTaskStatistics(): void {
    this.statisticsService.getTaskStatistics().subscribe(
      (data) => {
        this.taskStatistics = data;
        console.log('Task statistics:', this.taskStatistics);
        this.createTasksByPriorityChart();
        this.createWorkloadChart();
      },
      (error) => {
        console.error('Error loading task statistics', error);
      }
    );
  }

  loadRewardStatistics(): void {
    this.statisticsService.getRewardStatistics().subscribe(
      (data) => {
        this.rewardStatistics = data;
        console.log('Reward statistics:', this.rewardStatistics);
        this.createTopRewardsChart();
        this.createPopularRewardsChart();
      },
      (error) => {
        console.error('Error loading reward statistics', error);
      }
    );
  }

  createTopUsersChart(): void {
    if (this.userStatistics) {
      const topUsers = this.userStatistics.usersByPoints.slice(0, 3);
      const labels = topUsers.map(user => `👤 ${user.name}`);
      const data = topUsers.map(user => user.points);

      console.log('Top Users Chart Data:', { labels, data });

      this.topUsersChart = new Chart('topUsersChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Top Users by Points',
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 1,
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBorderColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            },
            x: {
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: '#ffeb3b'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw} 🪙`;
                }
              }
            }
          }
        }
      });
    } else {
      console.warn('No data for top users chart.');
    }
  }

  createTasksByPriorityChart(): void {
    if (this.taskStatistics) {
      const labels = this.taskStatistics.tasksByStatus.map(task => `${this.getPriorityIcon(task.priority)} ${task.priority} - ${this.getStatusIcon(task.status)} ${task.status}`);
      const data = this.taskStatistics.tasksByStatus.map(task => task.count);

      console.log('Tasks By Priority Chart Data:', { labels, data });

      this.tasksByPriorityChart = new Chart('tasksByPriorityChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Tasks by Priority and Status',
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderWidth: 1,
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBorderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            },
            x: {
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: '#ffeb3b'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw} tasks`;
                }
              }
            }
          }
        }
      });
    } else {
      console.warn('No data for tasks by priority chart.');
    }
  }

  createWorkloadChart(): void {
    if (this.taskStatistics) {
      const labels = this.taskStatistics.tasksByUser.map(user => `👤 ${user.name}`);
      const data = this.taskStatistics.tasksByUser.map(user => user.count);

      console.log('Workload Chart Data:', { labels, data });

      this.workloadChart = new Chart('workloadChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Tasks Assigned per User',
            data: data,
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
            hoverBackgroundColor: '#36A2EB',
            hoverBorderColor: '#36A2EB'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            },
            x: {
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: '#ffeb3b'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw} tasks`;
                }
              }
            }
          }
        }
      });
    } else {
      console.warn('No data for workload chart.');
    }
  }

  createTaskCompletionChart(): void {
    if (this.userStatistics) {
      const labels = this.userStatistics.usersByPoints.map(user => `👤 ${user.name}`);
      const totalTasks = this.userStatistics.usersByPoints.map(user => user.tasksAssigned || 0);
      const completedTasks = this.userStatistics.usersByPoints.map(user => user.tasksCompleted || 0);

      console.log('Task Completion Chart Data:', { labels, totalTasks, completedTasks });

      this.taskCompletionChart = new Chart('taskCompletionChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Tasks',
              data: totalTasks,
              backgroundColor: '#FFCE56',
              borderColor: '#FFCE56',
              borderWidth: 1,
              hoverBackgroundColor: '#FFCE56',
              hoverBorderColor: '#FFCE56'
            },
            {
              label: 'Completed Tasks',
              data: completedTasks,
              backgroundColor: '#36A2EB',
              borderColor: '#36A2EB',
              borderWidth: 1,
              hoverBackgroundColor: '#36A2EB',
              hoverBorderColor: '#36A2EB'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            },
            x: {
              ticks: {
                font: {
                  size: 12,
                },
                color: '#ffeb3b'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: '#ffeb3b'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw} tasks`;
                }
              }
            }
          }
        }
      });
    } else {
      console.warn('No data for task completion chart.');
    }
  }

  createTopRewardsChart(): void {
    if (this.rewardStatistics) {
        const topRewards = this.rewardStatistics.popularRewards.slice(0, 3);
        const labels = topRewards.map(reward => `${this.getRewardIcon(reward.rewardName)} ${reward.rewardName}`);
        const data = topRewards.map(reward => reward.times_redeemed);

        console.log('Top Rewards Chart Data:', { labels, data });

        this.topRewardsChart = new Chart('topRewardsChart', {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Top Redeemed Rewards',
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    borderWidth: 1,
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverBorderColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 12,
                            },
                            color: '#ffeb3b'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12,
                            },
                            color: '#ffeb3b'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#ffeb3b'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw} times redeemed`;
                            }
                        }
                    }
                }
            }
        });
    } else {
        console.warn('No data for top rewards chart.');
    }
  }

  createPopularRewardsChart(): void {
    if (this.rewardStatistics) {
        const labels = this.rewardStatistics.popularRewards.map(reward => `${this.getRewardIcon(reward.rewardName)} ${reward.rewardName}`);
        const data = this.rewardStatistics.popularRewards.map(reward => reward.times_redeemed);

        console.log('Popular Rewards Chart Data:', { labels, data });

        this.popularRewardsChart = new Chart('popularRewardsChart', {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Popular Rewards',
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    borderColor: '#fff',
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#ffeb3b'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw} times redeemed`;
                            }
                        }
                    }
                }
            }
        });
    } else {
        console.warn('No data for popular rewards chart.');
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🔴';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return '✔️';
      case 'pending':
        return '⏳';
      default:
        return '';
    }
  }

  getRewardIcon(rewardName: string): string {
    return '🎁'; // Aquí puedes cambiar los iconos según el nombre de la recompensa
  }
}
