import { Injectable, OnDestroy } from '@angular/core';
import { InitializeToolsService } from './initialize-tools.service';

@Injectable({
    providedIn: 'root'
})
export class VsCodeExtCommunicationService implements OnDestroy {
    private messageEventListener: ((event: MessageEvent) => void) | null = null;

    constructor(
        private initializeToolsService: InitializeToolsService
    ) { }

    initializeApplicationLoader() {
        // Remove existing listener if it exists
        if (this.messageEventListener) {
            window.removeEventListener('message', this.messageEventListener);
        }

        // Create new listener
        this.messageEventListener = (event) => {
            if (event.data?.command === 'application-metadata') {
                const metadata = event?.data?.data;
                // Initialize shell state with metadata (tools, projectId, etc.)
                this.initializeToolsService.initializePortal(metadata);
            }
            if (event.data?.command === 'workspace-zip') {
                const zipdata = event?.data?.data;
                this.initializeToolsService.sendZipToDomainTool(zipdata);
            }
            if (event.data?.command === 'accelerator-files-required') {
                const data = event?.data?.payload;
                this.initializeToolsService.sendZipToAddonsTool(data);
            }
        };

        // Add the listener
        window.addEventListener('message', this.messageEventListener);
        window.parent.postMessage({ command: 'shell-ready' }, '*');
    }

    ngOnDestroy() {
        // Clean up the listener when service is destroyed
        if (this.messageEventListener) {
            window.removeEventListener('message', this.messageEventListener);
        }
    }
}