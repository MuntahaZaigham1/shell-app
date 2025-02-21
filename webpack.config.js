const { share, shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

ModuleFederationConfigPlugin = withModuleFederationPlugin({
  shared: share({
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/material": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@ngx-translate/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@ngx-translate/http-loader": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  })
});



ModuleFederationConfigPlugin.output.publicPath = 'http://localhost:4200/'
ModuleFederationConfigPlugin.output.uniqueName = 'shell'


module.exports = ModuleFederationConfigPlugin
