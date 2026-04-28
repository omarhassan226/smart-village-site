import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications$ = new BehaviorSubject<Notification[]>([]);
  notifications$ = this._notifications$.asObservable();
  private counter = 0;

  show(message: string, type: NotificationType = 'success', duration = 3000): void {
    const id = ++this.counter;
    const list = [...this._notifications$.value, { id, message, type }];
    this._notifications$.next(list);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this._notifications$.next(this._notifications$.value.filter((n) => n.id !== id));
  }
}
