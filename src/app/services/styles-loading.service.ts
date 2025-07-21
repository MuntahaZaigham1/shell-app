import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StylesLoadingService {

    stylesMap: { [key: string]: string[] } = {
        'fast-code': ['https://127.0.0.1:4300/styles.css'],
        'apiBuilder': [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
            'https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,600,700,800,900&display=swap',
            'https://127.0.0.1:3030/assets/lib/patternfly.min.css',
            'https://127.0.0.1:3030/assets/lib/patternfly.css',
            'https://127.0.0.1:3030/assets/lib/patternfly-additions.css',
            'https://127.0.0.1:3030/styles.css',
        ],
        'tool1': ['http://localhost:4201/styles.css'],
        'uibuilder': ['https://127.0.0.1:4500/styles.css'],
    };

    constructor() { }

    loadRemoteStyles(remoteName: string) {
        this.deleteAllRemoteStylesExcept(remoteName);

        const styleUrls = this.stylesMap[remoteName];
        if (styleUrls?.length) {
            styleUrls.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.setAttribute('data-tool', remoteName); // <-- use data attribute
                document.head.appendChild(link);
            });
        }
    }

    deleteRemoteStyles(remoteName: string) {
        const links = document.querySelectorAll(`link[data-tool="${remoteName}"]`);
        links.forEach(link => link.remove());
    }

    deleteAllRemoteStyles() {
        Object.keys(this.stylesMap).forEach(tool => this.deleteRemoteStyles(tool));
    }

    private deleteAllRemoteStylesExcept(remoteName: string) {
        Object.keys(this.stylesMap)
            .filter(tool => tool !== remoteName)
            .forEach(tool => this.deleteRemoteStyles(tool));
    }
}
