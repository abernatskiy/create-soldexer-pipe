import inquirer from 'inquirer';
import { ProjectConfig, ProjectFeatures } from './types';

interface QuestionContext {
  projectType?: string;
  framework?: string;
  network?: string;
  features?: Partial<ProjectFeatures>;
}

async function askProjectDetails(): Promise<Partial<ProjectConfig>> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-solana-project'
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'Describe your project:',
      default: 'A Solana blockchain project'
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

async function askProjectType(): Promise<string> {
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'What type of project are you building?',
      choices: [
        'DeFi (Decentralized Finance)',
        'NFT (Non-Fungible Token)',
        'General Solana Project'
      ]
    }
  ]);

  return projectType;
}

async function askFramework(projectType: string): Promise<string> {
  const choices = [
    { name: 'Anchor (Recommended for most projects)', value: 'anchor' },
    { name: 'Native Solana (Low-level control)', value: 'native' }
  ];
  
  // Add SPL option for DeFi projects
  if (projectType === 'DeFi (Decentralized Finance)') {
    choices.push({ name: 'SPL (Solana Program Library)', value: 'spl' });
  }

  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework would you like to use?',
      choices
    }
  ]);

  return framework;
}

async function askNetwork(): Promise<string> {
  const { network } = await inquirer.prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Which network would you like to target?',
      choices: [
        'Devnet (Recommended for development)',
        'Testnet (For testing)',
        'Mainnet (Production - be careful!)'
      ],
      default: 'Devnet (Recommended for development)'
    }
  ]);

  return network;
}

async function askFeatures(context: QuestionContext): Promise<ProjectFeatures> {
  const features: ProjectFeatures = {
    testing: false,
    documentation: false,
    docker: false,
    ci: false,
    linting: false
  };

  // Ask about testing
  const { testing } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'testing',
      message: 'Would you like to include testing setup?',
      default: true
    }
  ]);
  features.testing = testing;

  // Ask about documentation
  const { documentation } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'documentation',
      message: 'Would you like to include documentation setup?',
      default: true
    }
  ]);
  features.documentation = documentation;

  // Ask about Docker (only if not a simple project)
  if (context.framework !== 'native') {
    const { docker } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'docker',
        message: 'Would you like to include Docker configuration?',
        default: false
      }
    ]);
    features.docker = docker;
  }

  // Ask about CI/CD (only for complex projects)
  if (context.projectType === 'DeFi (Decentralized Finance)' || context.framework === 'anchor') {
    const { ci } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'ci',
        message: 'Would you like to include CI/CD configuration?',
        default: false
      }
    ]);
    features.ci = ci;
  }

  // Ask about linting
  const { linting } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'linting',
      message: 'Would you like to include linting and formatting?',
      default: true
    }
  ]);
  features.linting = linting;

  return features;
}

async function askConfirmation(config: ProjectConfig): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with project generation?',
      default: true
    }
  ]);

  return confirm;
}

export async function runQuestionnaire(): Promise<ProjectConfig> {
  // Step 1: Get basic project details
  const projectDetails = await askProjectDetails();
  
  // Step 2: Ask about project type
  const projectType = await askProjectType();
  
  // Step 3: Ask about framework (depends on project type)
  const framework = await askFramework(projectType);
  
  // Step 4: Ask about network
  const network = await askNetwork();
  
  // Step 5: Ask about features (depends on previous answers)
  const context: QuestionContext = {
    projectType,
    framework,
    network
  };
  const features = await askFeatures(context);

  // Build the complete config
  const config: ProjectConfig = {
    projectName: projectDetails.projectName!,
    projectDescription: projectDetails.projectDescription!,
    author: projectDetails.author!,
    projectType: projectType.toLowerCase().replace(/[^a-z]/g, '') as any,
    framework: framework as any,
    network: network.toLowerCase().replace(/[^a-z]/g, '') as any,
    features
  };

  return config;
}

export async function confirmGeneration(config: ProjectConfig): Promise<boolean> {
  return await askConfirmation(config);
} 