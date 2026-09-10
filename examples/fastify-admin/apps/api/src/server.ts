import 'dotenv/config';
import { buildApp } from './app.js';

const app = await buildApp();
const port = Number.parseInt(process.env.PORT ?? '8080', 10);

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => void app.close());
}

await app.listen({ host: '0.0.0.0', port });
