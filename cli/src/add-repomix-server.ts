import * as fs from 'node:fs'
import {logger} from '~/shared/logger.js';

const mcpJsonPath = '.cursor/mcp.json'

const mcpJson = {
  mcpServers: {
    repomix: {
      command: 'npx',
      args: ['-y', 'repomix', '--mcp'],
    },
  },
}

export default function addRepomixServer() {
  if (!fs.existsSync(mcpJsonPath)) {
    fs.writeFileSync(mcpJsonPath, JSON.stringify(mcpJson, null, 2))
    logger.trace('Created project MCP Server config file with Repomix server')
  } else {
    const existingMcpJson = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'))
    
    if (!existingMcpJson.mcpServers || !existingMcpJson.mcpServers.repomix) {
      if (!existingMcpJson.mcpServers) {
        existingMcpJson.mcpServers = {}
      }
      
      existingMcpJson.mcpServers.repomix = mcpJson.mcpServers.repomix
      
      fs.writeFileSync(mcpJsonPath, JSON.stringify(existingMcpJson, null, 2))

      logger.log('Added repomix to existing project MCP Server config file')
    } else {
      logger.trace('Project MCP Server config file already has Repomix server')
    }
  }
  logger.log('\n Go to "Cursor Settings" > "MCP Servers" and make sure "repomix" is enabled.')
  logger.log('To use the tool type ')
}
