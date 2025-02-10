const { share,shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
ModuleFederationConfigPlugin = withModuleFederationPlugin({
  // remotes: {
  //   "studio": 'studio@http://localhost:4202/remoteEntry.js',
  //   // "products": "http://localhost:4201/remoteEntry.js",    

  // },
  shared:share({
    // ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' }
  })
  // shared: {}
});

ModuleFederationConfigPlugin.output.publicPath = 'http://localhost:4200/'
ModuleFederationConfigPlugin.output.uniqueName = 'shell'
module.exports = ModuleFederationConfigPlugin
