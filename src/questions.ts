import { Question } from './types';

export const getQuestions = (): Question[] => [
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
  },
  {
    type: 'list',
    name: 'projectType',
    message: 'What type of project are you building?',
    choices: [
      'DeFi (Decentralized Finance)',
      'NFT (Non-Fungible Token)',
      'General Solana Project'
    ]
  },
  {
    type: 'list',
    name: 'framework',
    message: 'Which framework would you like to use?',
    choices: (answers) => {
      const choices = [
        { name: 'Anchor (Recommended for most projects)', value: 'anchor' },
        { name: 'Native Solana (Low-level control)', value: 'native' }
      ];
      
      // Add SPL option for DeFi projects
      if (answers.projectType === 'defi') {
        choices.push({ name: 'SPL (Solana Program Library)', value: 'spl' });
      }
      
      return choices;
    }
  },
  {
    type: 'list',
    name: 'network',
    message: 'Which network would you like to target?',
    choices: [
      'Devnet (Recommended for development)',
      'Testnet (For testing)',
      'Mainnet (Production - be careful!)'
    ],
    default: 'devnet'
  },
  {
    type: 'confirm',
    name: 'features.testing',
    message: 'Would you like to include testing setup?',
    default: true
  },
  {
    type: 'confirm',
    name: 'features.documentation',
    message: 'Would you like to include documentation setup?',
    default: true
  },
  {
    type: 'confirm',
    name: 'features.docker',
    message: 'Would you like to include Docker configuration?',
    default: false
  },
  {
    type: 'confirm',
    name: 'features.ci',
    message: 'Would you like to include CI/CD configuration?',
    default: false
  },
  {
    type: 'confirm',
    name: 'features.linting',
    message: 'Would you like to include linting and formatting?',
    default: true
  }
]; 