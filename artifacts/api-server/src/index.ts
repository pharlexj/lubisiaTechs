import app from "./app";
import { logger } from "./lib/logger";

const DEFAULT_PORT = 3000;
const FALLBACK_PORT = 3001;
const rawPort = process.env["PORT"] ?? String(DEFAULT_PORT);

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
	throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const attemptedPorts = new Set<number>();
const fallbackPorts = [port, FALLBACK_PORT, 0];

function listenOnNextPort() {
	const nextPort = fallbackPorts.find((p) => !attemptedPorts.has(p));
	if (nextPort === undefined) {
		logger.error(
			{ attemptedPorts: Array.from(attemptedPorts) },
			"No available ports found",
		);
		process.exit(1);
	}

	attemptedPorts.add(nextPort);
	app.listen(nextPort, (err) => {
		if (err) {
			if ((err as any).code === "EADDRINUSE") {
				logger.warn(
					{ err, port: nextPort },
					"Port in use, trying next available port",
				);
				listenOnNextPort();
				return;
			}
			logger.error({ err }, "Error listening on port");
			process.exit(1);
		}

		logger.info({ port: nextPort }, "Server listening");
	});
}

listenOnNextPort();
