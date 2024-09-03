import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Reward } from '../models/reward';

@Component({
  selector: 'app-edit-reward-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './edit-reward-dialog.component.html',
  styleUrls: ['./edit-reward-dialog.component.css']
})
export class EditRewardDialog {
  constructor(
    public dialogRef: MatDialogRef<EditRewardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { reward: Reward }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data.reward);
  }
}
