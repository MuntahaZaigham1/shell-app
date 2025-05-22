import { Inject, Injectable, InjectionToken } from '@angular/core';

export interface MessageType {
  command: string;
  payload?: any;
  for: string;
}

export const WINDOW = new InjectionToken<Window>('Window', {
  providedIn: 'root',
  factory: () => window
});

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private static instance: SharedService | null = null;
  private listeners = new Map<Function, (event: MessageEvent) => void>();

  constructor(@Inject(WINDOW) private targetWindow: Window) {
    if (SharedService.instance) {
      return SharedService.instance;
    }
    SharedService.instance = this;
    console.log('SharedService initialized - Singleton enforced');
  }

  sendMessage(message: MessageType): void {
    this.targetWindow.postMessage(message, '*');
  }

  listenMessage(handler: (message: MessageType) => void): { unsubscribe: () => void } {
    const wrappedListener = (event: MessageEvent) => {
      if (event.data?.command) {
        handler(event.data);
      }
    };

    this.listeners.set(handler, wrappedListener);
    this.targetWindow.addEventListener('message', wrappedListener);

    return {
      unsubscribe: () => this.removeListener(handler)
    };
  }

  private removeListener(handler: Function): void {
    const listener = this.listeners.get(handler);
    if (listener) {
      this.targetWindow.removeEventListener('message', listener);
      this.listeners.delete(handler);
    }
  }

  destroy(): void {
    this.listeners.forEach((listener, handler) => {
      this.targetWindow.removeEventListener('message', listener);
    });
    this.listeners.clear();
    SharedService.instance = null;
  }
}