#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { runQuestionnaire, confirmGeneration } from './questions';
import { TemplateManager } from './template-manager';
import { SolanaPipeConfig } from './types';

async function main(): Promise<void> {
  console.log(chalk.blue.bold('\n🚀 Welcome to create-soldexer-pipe!'));
  console.log(chalk.gray('Let\'s create your Solana project together.\n'));

  try {
    // Run the dynamic questionnaire
    const config: SolanaPipeConfig = await runQuestionnaire();

    // Show summary
    console.log(chalk.green.bold('\n📋 Project Configuration:'));
    console.log(chalk.white(`  Project Name: ${config.projectName}`));
    console.log(chalk.white(`  Description: ${config.projectDescription}`));
    console.log(chalk.white(`  Author: ${config.author}`));
    console.log(chalk.white(`  Type: ${config.projectType}`));
    console.log(chalk.white(`  Framework: ${config.framework}`));
    console.log(chalk.white(`  Network: ${config.network}`));
    console.log(chalk.white(`  Features: ${Object.entries(config.features)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature)
      .join(', ') || 'None'}`));

    // Confirm generation
    const confirm = await confirmGeneration(config);

    if (!confirm) {
      console.log(chalk.yellow('Project generation cancelled.'));
      process.exit(0);
    }

    // Generate project
    const spinner = ora('Generating your Solana project...').start();
    
    const templateManager = new TemplateManager();
    await templateManager.generateProject(config);
    
    spinner.succeed('Project generated successfully!');

    // Show next steps
    console.log(chalk.green.bold('\n🎉 Your project is ready!'));
    console.log(chalk.white('\nNext steps:'));
    console.log(chalk.cyan(`  1. cd ${config.projectName}`));
    console.log(chalk.cyan('  2. npm install'));
    
    if (config.framework === 'anchor') {
      console.log(chalk.cyan('  3. anchor build'));
      console.log(chalk.cyan('  4. anchor test'));
    } else {
      console.log(chalk.cyan('  3. npm run build'));
      console.log(chalk.cyan('  4. npm test'));
    }

    console.log(chalk.gray('\nHappy coding! 🚀\n'));

  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error:'), error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red.bold('\n❌ Unhandled Rejection at:'), promise);
  console.error(chalk.red('Reason:'), reason);
  process.exit(1);
});

// Run the CLI
if (require.main === module) {
  main();
} 