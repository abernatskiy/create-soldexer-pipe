#!/usr/bin/env node

// Import the main function and run it directly
const { main } = require('../lib/cli.js');

// Run the CLI
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
}); 