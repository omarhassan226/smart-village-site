import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-confirm-modal',
  template: `
    <div class="confirm-modal" [class.confirm-modal--open]="isOpen">
      <div class="confirm-modal__overlay" (click)="cancel.emit()"></div>
      <div class="confirm-modal__container">
        <div class="confirm-modal__icon" [ngClass]="'confirm-modal__icon--' + type">
          <i class="uil" [ngClass]="icon"></i>
        </div>
        
        <div class="confirm-modal__content">
          <h3 class="confirm-modal__title">{{ title | translate }}</h3>
          <p class="confirm-modal__desc">{{ message | translate }}</p>
        </div>

        <div class="confirm-modal__footer">
          <button class="btn btn-outline btn-sm" (click)="cancel.emit()" [disabled]="loading">
            {{ 'CANCEL' | translate }}
          </button>
          <button 
            class="btn btn-sm" 
            [ngClass]="type === 'danger' ? 'btn-danger' : 'btn-primary'"
            (click)="confirm.emit()" 
            [disabled]="loading"
          >
            <span *ngIf="!loading">{{ confirmText | translate }}</span>
            <i class="uil uil-spinner-alt spin" *ngIf="loading"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-modal {
      position: fixed;
      inset: 0;
      z-index: 4000;
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: hidden;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .confirm-modal--open {
      visibility: visible;
      opacity: 1;
    }

    .confirm-modal--open .confirm-modal__container {
      transform: translateY(0) scale(1);
    }

    .confirm-modal__overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
    }

    .confirm-modal__container {
      position: relative;
      background: #fff;
      width: 90%;
      max-width: 400px;
      border-radius: 24px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .confirm-modal__icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
    }
    
    .confirm-modal__icon--danger {
      background: #fef2f2;
      color: #dc2626;
    }
    .confirm-modal__icon--warning {
      background: #fffbeb;
      color: #f59e0b;
    }
    .confirm-modal__icon--info {
      background: #eff6ff;
      color: #2563eb;
    }

    .confirm-modal__title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .confirm-modal__desc {
      font-size: 0.95rem;
      color: #4b5563;
      line-height: 1.5;
      margin-bottom: 2rem;
    }

    .confirm-modal__footer {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .confirm-modal__footer button {
      min-width: 120px;
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
    }

    .spin {
      animation: fa-spin 2s infinite linear;
    }

    @keyframes fa-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(359deg); }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() loading = false;
  @Input() title = 'ARE_YOU_SURE';
  @Input() message = 'CONFIRM_DELETE_MSG';
  @Input() confirmText = 'CONFIRM';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Input() icon = 'uil-exclamation-triangle';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
