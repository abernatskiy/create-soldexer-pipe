export interface ProjectConfig {
  projectName: string;
  projectDescription: string;
  author: string;
  projectType: ProjectType;
  framework: Framework;
  network: Network;
  features: ProjectFeatures;
}

export enum ProjectType {
  DEFI = 'defi',
  NFT = 'nft',
  GENERAL = 'general'
}

export enum Framework {
  ANCHOR = 'anchor',
  NATIVE = 'native',
  SPL = 'spl'
}

export enum Network {
  MAINNET = 'mainnet',
  DEVNET = 'devnet',
  TESTNET = 'testnet'
}

export interface ProjectFeatures {
  testing: boolean;
  documentation: boolean;
  docker: boolean;
  ci: boolean;
  linting: boolean;
}



export interface TemplateData {
  config: ProjectConfig;
  [key: string]: any;
} 