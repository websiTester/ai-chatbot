import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { getAllAgents } from "../db/agent-service";


const agents = await getAllAgents();
console.log("!!!!!!!!!==========\n"+agents+"\n==========!!!!!!!!!");
export const model1 = 'google/gemini-2.5-flash';
export const model2 = 'google/gemini-2.0-flash';
export const model3 = 'google/gemini-2.0-flash-lite';


export var shortOverviewAgent = new Agent({
  name: 'Agent 1',
  instructions: `
    ${agents[0].instruction}
  `,
  model: 'google/gemini-2.5-flash',
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});


export const shortMermaidAgent = new Agent({
  name: 'Agent 2',
  instructions: `
    ${agents[1].instruction}
    `,
  model: 'google/gemini-2.0-flash',
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});



export const shortUiAgent = new Agent({
  name: 'Agent 3',
  instructions: `
      ${agents[2].instruction}
 `,
  model: 'google/gemini-2.0-flash-lite',
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});



export const shortSummaryAgent = new Agent({
  name: 'Agent 4',
  instructions: `
      ${agents[3].instruction}`,
  model: 'google/gemini-2.5-flash',
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});



export function createAgentWithInstruction(agentName: string, newInstruction: string, model: string) {
  return new Agent({
    name: agentName,
    instructions: newInstruction,
    model: model,
    tools: {},
    memory: new Memory({
      storage: new LibSQLStore({
        url: 'file:../mastra.db',
      }),
    }),
  });
}