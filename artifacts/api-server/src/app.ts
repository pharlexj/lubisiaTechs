import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.type("text/html").send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LubisiaTech API Server</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          padding: 60px 40px;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 2.5em;
        }
        .version {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 30px;
        }
        .status {
          display: inline-block;
          background: #4caf50;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 30px;
        }
        .endpoints {
          margin-top: 40px;
          text-align: left;
        }
        .endpoints h2 {
          color: #333;
          font-size: 1.2em;
          margin-bottom: 20px;
        }
        .endpoint-link {
          display: block;
          padding: 12px 16px;
          margin: 10px 0;
          background: #f5f5f5;
          border-left: 4px solid #667eea;
          text-decoration: none;
          color: #667eea;
          border-radius: 4px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .endpoint-link:hover {
          background: #e8eaf6;
          transform: translateX(5px);
        }
        .endpoint-label {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 0.8em;
          margin-right: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 LubisiaTech API</h1>
        <div class="version">v1.0.0</div>
        <div class="status">● Running</div>
        
        <div class="endpoints">
          <h2>📍 Endpoints</h2>
          <a href="/api/healthz" class="endpoint-link">
            <span class="endpoint-label">GET</span>
            Health Check: /api/healthz
          </a>
          <a href="/api" class="endpoint-link">
            <span class="endpoint-label">API</span>
            API Root: /api
          </a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.use("/api", router);

export default app;
