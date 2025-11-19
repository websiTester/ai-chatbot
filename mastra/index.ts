
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';

import { weatherAgent } from './agents/weather-agent';
import { finalAgent } from './agents/final-agent';
import { ecommerceWorkflow } from './workflows/analyze-workflow';
import { streamingAgent } from './agents/streaming-agent';
import { getTemplateWorkflow } from './workflows/get-template-workflow';
import { shortWorkflow } from './workflows/short-workflow';
import { finalShortAgent } from './agents/final-short-agent';
//import { obsidianAgent } from './agents/obsidian-agent';

const globalForMastra = globalThis as unknown as { mastra: Mastra };
export const mastra = globalForMastra.mastra || new Mastra({
  workflows: {ecommerceWorkflow, getTemplateWorkflow, shortWorkflow},
  agents: { weatherAgent, finalAgent, streamingAgent, finalShortAgent},
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false, 
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true }, 
  },
});
// if (process.env.NODE_ENV !== "production") globalForMastra.mastra = mastra;

if (!globalForMastra.mastra) {
  globalForMastra.mastra = mastra;
}