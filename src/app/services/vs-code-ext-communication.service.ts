import { Injectable } from '@angular/core';
import { InitializeToolsService } from './initialize-tools.service';

@Injectable({
    providedIn: 'root'
})
export class VsCodeExtCommunicationService {
    constructor(
        private initializeToolsService: InitializeToolsService
    ) {
    }

    initializeApplicationLoader() {
        window.addEventListener('message', (event) => {
            if (event.data?.command === 'application-metadata') {
                const metadata = event?.data?.data;
                // Initialize shell state with metadata (tools, projectId, etc.)
                this.initializeToolsService.initializePortal(metadata);
            }
        });
        window.parent.postMessage({ command: 'shell-ready' }, '*');
    }
}