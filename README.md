# create-soldexer-pipe

An interactive CLI tool to create Solana development environments with customizable configurations.

## Installation

```bash
npm install -g create-soldexer-pipe
```

## Usage

```bash
npx create-soldexer-pipe
```

## Features

- Interactive questionnaire to configure your Solana project
- Multiple choice questions for framework selection
- Y/N questions for optional features
- String input for project names and configurations
- Dynamic template generation based on user responses
- Mustache template support for flexible file generation

## Example Flow

1. **Project Type Selection**: Choose between DeFi, NFT, or General Solana project
2. **Framework Selection**: Select your preferred framework (Anchor, Native, or SPL)
3. **Network Configuration**: Choose between Mainnet, Devnet, or Testnet
4. **Feature Selection**: Enable/disable optional features like testing, documentation, etc.
5. **Project Details**: Enter project name, description, and author information
6. **Template Generation**: Automatically generate project files based on your choices

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development mode with watch
npm run dev

# Clean build artifacts
npm run clean
```

## License

MIT 