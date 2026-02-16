import path from "path";
import https from "https";
import fs from "fs";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all routes (SPA routing)
app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Self-signed certificate for localhost HTTPS
// SIGNLENT_CERT_DIR env var allows overriding the cert location (used by nix wrapper)
const certDir = process.env.SIGNLENT_CERT_DIR || path.join(__dirname, "../certs");
const keyPath = path.join(certDir, "key.pem");
const certPath = path.join(certDir, "cert.pem");

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error("❌ Missing TLS certificates. Generate them with:");
  console.error(
    `  mkdir -p ${certDir} && openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout ${keyPath} -out ${certPath} -days 365 -subj "/CN=localhost"`,
  );
  process.exit(1);
}

const server = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  app,
);

server.listen(port, () => {
  console.log(`🚀 SignLent running at https://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  server.close(() => process.exit(0));
});
