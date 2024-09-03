import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';

// Fade-in animation
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.5s', style({ opacity: 1 }))
  ])
]);

// Bounce animation
export const bounceAnimation = trigger('bounce', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('0.5s', style({ transform: 'translateY(0)' }))
  ])
]);

// Slide-in-out animation
export const slideInOutAnimation = trigger('slideInOut', [
  state('in', style({ transform: 'translateX(0)' })),
  transition('void => *', [
    style({ transform: 'translateX(-100%)' }),
    animate('0.3s ease-in')
  ]),
  transition('* => void', [
    animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
  ])
]);
