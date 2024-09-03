import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardRedeemComponent } from './reward-redeem.component';

describe('RewardRedeemComponent', () => {
  let component: RewardRedeemComponent;
  let fixture: ComponentFixture<RewardRedeemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardRedeemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardRedeemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
