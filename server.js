// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const https = require('https');
// const app = express();

// // Serve static files from the Angular build directory
// const appName = 'shell-app'; // Change this to your Angular project name
// const buildPath = path.join(__dirname, 'dist', appName);

// app.use(express.static(buildPath));

// // Redirect all requests to index.html (Angular handles routing)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(buildPath, 'index.html'));
// });

// const mkcert = require("mkcert");

// mkcert.createCA({
//   organization: "Hello CA",
//   countryCode: "NP",
//   state: "Bagmati",
//   locality: "Kathmandu",
//   validity: 365
// }).then(ca => {
//   return mkcert.createCert({
//     ca: { key: ca.key, cert: ca.cert },
//     domains: ["127.0.0.1", "localhost"],
//     validity: 365
//   }).then(cert => {
//     console.log(cert.key, cert.cert); // certificate info
//     console.log(`${cert.cert}${ca.cert}`);

//     const sslOptions = {
//         key: cert.key,
//         cert: cert.cert
//     };
    
//     // Start HTTPS Server
//     const PORT = 4200;
//     https.createServer(sslOptions, app).listen(PORT, () => {
//         console.log(`🚀 Secure Angular app is running on https://localhost:${PORT}`);
//     });
//   });
// }).catch(err => console.error("Error generating certificates:", err));

// // Load the certificates



const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const cors = require("cors");

const app = express();
const PORT = 4200;
const appName = "shell-app"; // Change to your Angular build folder name
const buildPath = path.join(__dirname, "dist", appName);

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(buildPath));

// Handle Angular routing
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Load SSL Certificates (Generated using mkcert)
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 Secure Angular app is running at: https://localhost:${PORT}`);
});
