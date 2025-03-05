const { share, shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

ModuleFederationConfigPlugin = withModuleFederationPlugin({
  remotes: {
    "fast-code": "https://127.0.0.1:4300/remoteEntry.js"
  },
  shared: share({
    "zone.js": { singleton: true, strictVersion: true, requiredVersion: '0.11.8', eager: true },
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/material": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@ngx-translate/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@ngx-translate/http-loader": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "fastcode-shared-service": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  })
});

ModuleFederationConfigPlugin.devServer = {
  server: 'https',
  host: '127.0.0.1',
  port: 4200,
  allowedHosts: 'all',
  hot: true,
  webSocketServer: 'ws',  // Ensure WebSockets work
},

  ModuleFederationConfigPlugin.output.publicPath = 'https://127.0.0.1:4200/'
ModuleFederationConfigPlugin.output.uniqueName = 'shell'


module.exports = ModuleFederationConfigPlugin
