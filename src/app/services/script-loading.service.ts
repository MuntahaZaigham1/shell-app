import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScriptLoadingService {
    scriptsMap: { [key: string]: string[] } = {
        'fast-code': [
            'https://127.0.0.1:4300/assets/js/jquery.min.js',
            'https://127.0.0.1:4300/assets/js/popper.min.js',
            'https://127.0.0.1:4300/assets/js/bootstrap.min.js',
            'https://127.0.0.1:4300/assets/js/jszip.js',
            'https://127.0.0.1:4300/assets/js/fileSaver.js',
        ],
        'uibuilder': [
            "https://unpkg.com/prettier@2.5.1/standalone.js",
            "https://unpkg.com/prettier@2.5.1/parser-typescript.js",
            "https://unpkg.com/prettier@2.5.1/parser-html.js",
            "https://unpkg.com/prettier@2.5.1/parser-angular.js",
            // 'https://127.0.0.1:4500/assets/js/jquery.slim.min.js',
            // 'https://127.0.0.1:4500/assets/js/jquery.min.js',
            'https://127.0.0.1:4500/assets/js/popper.min.js',
            // 'https://127.0.0.1:4500/assets/js/bootstrap.min.js',
            'https://127.0.0.1:4500/assets/js/jszip.js',
            'https://127.0.0.1:4500/assets/js/fileSaver.js',
            'https://127.0.0.1:4500/assets/js/myjs.js',
            // 'https://127.0.0.1:4500/assets/sass.sync.js',
        ]
    };

    constructor() {
    }

    loadRemoteScripts(remoteName: string) {
        const scripts = this.scriptsMap[remoteName];
        Object.keys(this.scriptsMap)
            .filter(k => k !== remoteName)
            .forEach(k => this.deleteRemoteScripts(k)); // ✅ Clean up scripts
    
        if (scripts) {
            scripts.forEach(src => {
                const scriptId = `remote-script-${remoteName}-${btoa(src)}`;
                if (!document.getElementById(scriptId)) {
                    const script = document.createElement('script');
                    script.src = src;
                    script.type = 'text/javascript';
                    script.async = false;
                    script.defer = true;
                    script.id = scriptId;
                    document.body.appendChild(script);
                }
            });
        }
    }
    

    deleteRemoteScripts(remoteName: string) {
        const scripts = this.scriptsMap[remoteName];
        if (scripts) {
            scripts.forEach(src => {
                const scriptId = `remote-script-${remoteName}-${btoa(src)}`;
                const script = document.getElementById(scriptId);
                if (script) {
                    script.remove();
                }
            });
        }
    }

    deleteAllRemoteScripts() {
        Object.keys(this.scriptsMap).forEach(remoteName => this.deleteRemoteScripts(remoteName));
    }


}