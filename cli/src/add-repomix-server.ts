import * as fs from 'node:fs'

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
    console.log('Created project MCP Server config file with Repomix server')
  } else {
    const existingMcpJson = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'))
    
    if (!existingMcpJson.mcpServers || !existingMcpJson.mcpServers.repomix) {
      if (!existingMcpJson.mcpServers) {
        existingMcpJson.mcpServers = {}
      }
      
      existingMcpJson.mcpServers.repomix = mcpJson.mcpServers.repomix
      
      fs.writeFileSync(mcpJsonPath, JSON.stringify(existingMcpJson, null, 2))

      console.log('Added repomix to existing project MCP Server config file')
    } else {
      console.log('Project MCP Server config file already has Repomix server')
    }
  }
  console.log('\nGo to "Cursor Settings" > "MCP Servers" and make sure "repomix" is enabled.')
  console.log('To use the tool type ')
}
