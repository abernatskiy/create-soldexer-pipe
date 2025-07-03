export interface SolanaPipeConfig {
  projectName: string;
  projectDescription: string;
  author: string;
  instructions: InstructionRequest[] | undefined;
  tokenBalances: TokenBalanceRequest[] | undefined;
}

export interface InstructionRequest {
  programId: string[] | undefined;
  discriminator: string[] | undefined;
}

export interface TokenBalanceRequest {
  account: string[] | undefined;
  mint: string[] | undefined;
}