import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// Serve static files from the built frontend
const publicPath = path.resolve(
	__dirname,
	"..",
	"..",
	"lubisiateks",
	"dist",
	"public",
);
app.use(express.static(publicPath));

app.use("/api", router);

// SPA fallback: serve index.html for all routes not matched by /api or static files
app.use((_req, res) => {
	res.sendFile(path.resolve(publicPath, "index.html"));
});

export default app;
