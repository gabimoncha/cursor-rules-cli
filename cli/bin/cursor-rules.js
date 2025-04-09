#!/usr/bin/env node

const nodeVersion = process.versions.node;
const [major] = nodeVersion.split('.').map(Number);

const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
};

if (major < 16) {
  console.error(`Cursor Rules requires Node.js version 18 or higher. Current version: ${nodeVersion}\n`);
  process.exit(EXIT_CODES.ERROR);
}

function setupErrorHandlers() {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(EXIT_CODES.ERROR);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
    process.exit(EXIT_CODES.ERROR);
  });

  function shutdown() {
    process.exit(EXIT_CODES.SUCCESS);
  }

  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Shutting down...');
    shutdown();
  });
  process.on('SIGTERM', shutdown);
}

(async () => {
  try {
    setupErrorHandlers();
    let cli;
    try {
      cli = await import('../src/cli/cliRun.ts');
    } catch(e) {
      cli = await import('../lib/cli/cliRun.js');
    }
    await cli.run();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fatal Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Fatal Error:', error);
    }

    process.exit(EXIT_CODES.ERROR);
  }
})(); 