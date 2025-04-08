import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StylesLoadingService {

    stylesMap: { [key: string]: string } = {
        'fast-code': 'https://127.0.0.1:4300/styles.css',
        'studio': 'http://localhost:4202/styles.css',
        'tool1': 'http://localhost:4201/styles.css',
        'uibuilder': 'https://127.0.0.1:4500/styles.css',
    };

    constructor() {
    }

    loadRemoteStyles(remoteName: string) {
        const stylesMap: { [key: string]: string } = { ...this.stylesMap };

        Object.keys(stylesMap).filter(k => k != remoteName).forEach(key => {
            this.deleteRemoteStyles(key);
        });

        if (stylesMap[remoteName]) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylesMap[remoteName];
            link.id = `remote-styles-${remoteName}`;
            document.head.appendChild(link);
        }
    }

    deleteRemoteStyles(remoteName: string) {
        const link = document.getElementById(`remote-styles-${remoteName}`);
        if (link) {
            link.remove();
        }
    }

    deleteAllRemoteStyles() {
        const stylesMap: { [key: string]: string } = { ...this.stylesMap };
        Object.keys(stylesMap).forEach(key => {
            this.deleteRemoteStyles(key);
        });
    }

}