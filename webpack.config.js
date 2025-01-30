const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
const dependencies = require('./package.json').dependencies;
module.exports = withModuleFederationPlugin({
  remotes: {
    "studio": "http://localhost:4202/remoteEntry.js",
  },
  shared: {}      // No shared libraries required
});