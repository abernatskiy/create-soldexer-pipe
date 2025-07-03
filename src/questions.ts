import inquirer from 'inquirer';
import { SolanaPipeConfig, InstructionRequest, TokenBalanceRequest } from './types';

async function askProjectDetails(): Promise<Partial<SolanaPipeConfig>> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your indexer project name?',
      default: 'my-solana-indexer'
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'Describe your Solana indexer:',
      default: 'A Solana blockchain indexer'
    },
    {
      type: 'input',
      name: 'author',
      message: 'What is your name?',
      default: 'Developer'
    }
  ]);

  return answers;
}

async function askInstructionDetails(): Promise<InstructionRequest> {
  const { programId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'programId',
      message: 'Enter program IDs to index (comma-separated):',
      default: '',
      filter: (input: string) => input.split(',').map(id => id.trim()).filter(id => id.length > 0)
    }
  ]);

  const { discriminator } = await inquirer.prompt([
    {
      type: 'input',
      name: 'discriminator',
      message: 'Enter instruction discriminators to index (comma-separated, leave empty for all):',
      default: '',
      filter: (input: string) => input.split(',').map(d => d.trim()).filter(d => d.length > 0)
    }
  ]);

  return {
    programId: programId.length > 0 ? programId : undefined,
    discriminator: discriminator.length > 0 ? discriminator : undefined
  };
}

async function askInstructions(): Promise<InstructionRequest[]> {
  const instructions: InstructionRequest[] = [];
  
  // Ask if user wants to index instructions
  const { indexInstructions } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'indexInstructions',
      message: 'Do you want to index instructions?',
      default: true
    }
  ]);

  if (!indexInstructions) {
    return [];
  }

  let addMore = true;
  let instructionCount = 1;

  while (addMore) {
    console.log(`\n📝 Instruction ${instructionCount}:`);
    const instruction = await askInstructionDetails();
    instructions.push(instruction);

    const { continueAdding } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAdding',
        message: 'Do you want to add another instruction to index?',
        default: false
      }
    ]);

    addMore = continueAdding;
    instructionCount++;
  }

  return instructions;
}

async function askTokenBalanceDetails(): Promise<TokenBalanceRequest> {
  const { account } = await inquirer.prompt([
    {
      type: 'input',
      name: 'account',
      message: 'Enter account addresses to track (comma-separated):',
      default: '',
      filter: (input: string) => input.split(',').map(acc => acc.trim()).filter(acc => acc.length > 0)
    }
  ]);

  const { mint } = await inquirer.prompt([
    {
      type: 'input',
      name: 'mint',
      message: 'Enter token mint addresses to track (comma-separated, leave empty for all):',
      default: '',
      filter: (input: string) => input.split(',').map(m => m.trim()).filter(m => m.length > 0)
    }
  ]);

  return {
    account: account.length > 0 ? account : undefined,
    mint: mint.length > 0 ? mint : undefined
  };
}

async function askTokenBalances(): Promise<TokenBalanceRequest[]> {
  const tokenBalances: TokenBalanceRequest[] = [];
  
  // Ask if user wants to track token balances
  const { trackTokenBalances } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'trackTokenBalances',
      message: 'Do you want to track token balance updates?',
      default: false
    }
  ]);

  if (!trackTokenBalances) {
    return [];
  }

  let addMore = true;
  let balanceCount = 1;

  while (addMore) {
    console.log(`\n💰 Token Balance ${balanceCount}:`);
    const tokenBalance = await askTokenBalanceDetails();
    tokenBalances.push(tokenBalance);

    const { continueAdding } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAdding',
        message: 'Do you want to add another token balance tracking configuration?',
        default: false
      }
    ]);

    addMore = continueAdding;
    balanceCount++;
  }

  return tokenBalances;
}

async function askConfirmation(config: SolanaPipeConfig): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with indexer generation?',
      default: true
    }
  ]);

  return confirm;
}

export async function runQuestionnaire(): Promise<SolanaPipeConfig> {
  // Step 1: Get basic project details
  const projectDetails = await askProjectDetails();
  
  // Step 2: Ask about instructions to index
  const instructions = await askInstructions();
  
  // Step 3: Ask about token balances to track
  const tokenBalances = await askTokenBalances();

  // Build the complete config
  const config: SolanaPipeConfig = {
    projectName: projectDetails.projectName!,
    projectDescription: projectDetails.projectDescription!,
    author: projectDetails.author!,
    instructions: instructions.length > 0 ? instructions : undefined,
    tokenBalances: tokenBalances.length > 0 ? tokenBalances : undefined
  };

  return config;
}

export async function confirmGeneration(config: SolanaPipeConfig): Promise<boolean> {
  return await askConfirmation(config);
} 