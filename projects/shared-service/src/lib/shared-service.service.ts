import { Inject, Injectable, InjectionToken, ɵgetInjectableDef } from '@angular/core';

export interface MessageType {
    command: string;
    payload?: any;
    for: string;
}


// Create an InjectionToken for Window
export const WINDOW = new InjectionToken<Window>('Window', {
    providedIn: 'root',
    factory: () => window // This will provide the global window object
  });

@Harden(SharedService)
@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private listener?: (event: MessageEvent) => void;

    constructor(@Inject(WINDOW) private targetWindow: Window) {
        console.log('SharedService instance created');
    }

    sendMessage(message: MessageType) {
        this.targetWindow.postMessage(message, '*');
    }

    listenMessage(handler: (message: MessageType) => void) {
        this.listener = (event: MessageEvent) => {
            if (event.data && event.data.command) {
                handler(event.data);
            }
        };
        window.addEventListener('message', this.listener);
    }

    unsubscribe() {
        if (this.listener) {
            window.removeEventListener('message', this.listener);
            this.listener = undefined;
        }
    }
}

function Harden(target: any): any {
    let def = ɵgetInjectableDef(target) as any;
    const newFactory = def.factory;
    let value = undefined as any | undefined;
    def.factory = () => { value = value == undefined ? newFactory() : value; return value; };
}