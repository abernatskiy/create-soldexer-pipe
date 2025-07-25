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
    console.log(chalk.green.bold('\n📋 Indexer Configuration:'));
    console.log(chalk.white(`  Project Name: ${config.projectName}`));
    console.log(chalk.white(`  Description: ${config.projectDescription}`));
    console.log(chalk.white(`  Author: ${config.author}`));
    
    if (config.instructions && config.instructions.length > 0) {
      console.log(chalk.white(`  Instructions to Index: ${config.instructions.length}`));
      config.instructions.forEach((instruction, index) => {
        console.log(chalk.gray(`    ${index + 1}. Program IDs: ${instruction.programId?.join(', ') || 'All'}`));
        console.log(chalk.gray(`       Discriminators: ${instruction.discriminator?.join(', ') || 'All'}`));
      });
    } else {
      console.log(chalk.white(`  Instructions to Index: None`));
    }
    
    if (config.tokenBalances && config.tokenBalances.length > 0) {
      console.log(chalk.white(`  Token Balances to Track: ${config.tokenBalances.length}`));
      config.tokenBalances.forEach((balance, index) => {
        console.log(chalk.gray(`    ${index + 1}. Accounts: ${balance.account?.join(', ') || 'All'}`));
        console.log(chalk.gray(`       Mints: ${balance.mint?.join(', ') || 'All'}`));
      });
    } else {
      console.log(chalk.white(`  Token Balances to Track: None`));
    }

    // Confirm generation
    const confirm = await confirmGeneration(config);

    if (!confirm) {
      console.log(chalk.yellow('Project generation cancelled.'));
      process.exit(0);
    }

    // Generate project
    const spinner = ora('Generating your Solana indexer project...').start();
    
    const templateManager = new TemplateManager();
    await templateManager.generateProject(config);
    
    spinner.succeed('Project generated successfully!');

    // Show next steps
    console.log(chalk.green.bold('\n🎉 Your Solana indexer is ready!'));
    console.log(chalk.white('\nNext steps:'));
    console.log(chalk.cyan(`  1. cd ${config.projectName}`));
    console.log(chalk.cyan('  2. yarn install --frozen-lockfile'));
    console.log(chalk.cyan('  3. docker compose up -d'));
    console.log(chalk.cyan('  4. yarn start'));
    console.log(chalk.gray('\nHappy indexing! 🚀\n'));

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

// Export main function for direct execution
export { main };

// Run the CLI if this is the main module
if (require.main === module) {
  main();
} 