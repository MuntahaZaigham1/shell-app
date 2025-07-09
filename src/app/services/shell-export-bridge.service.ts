import { Injectable } from '@angular/core';
import { SharedService, MessageType } from 'fastcode-shared-service';

export enum MessageCommand {
    CodeExported = 'code-exported',
    ExportStatus = 'export-status',
}

@Injectable({ providedIn: 'root' })
export class ShellExportBridgeService {

    constructor(private sharedService: SharedService) {
        debugger;
        this.sharedService.listenMessage(this.handleToolMessage.bind(this));
        window.addEventListener('message', this.handleExtensionMessage.bind(this));
    }
    
    init() {
        debugger;
        this.sharedService.listenMessage(this.handleToolMessage.bind(this));
        window.addEventListener('message', this.handleExtensionMessage.bind(this));
    } 

    private handleToolMessage(message: MessageType) {
        switch (message.command) {
            case MessageCommand.CodeExported:
                this.sendToExtension({
                    command: MessageCommand.CodeExported,
                    payload: message.payload
                });
                break;
        }
    }

    // Handle messages from the extension
    private handleExtensionMessage(event: MessageEvent) {
        const message = event.data;
        if (!message?.command) return;

        switch (message.command) {
            case MessageCommand.ExportStatus:
                this.sharedService.sendMessage({
                    command: "code-export-status",
                    for: 'all-tools',
                    payload: message.data
                });
                break;
        }
    }

    private sendToExtension(message: any) {
        window.parent.postMessage(message, '*'); // Make sure this is secured in production
    }

}
