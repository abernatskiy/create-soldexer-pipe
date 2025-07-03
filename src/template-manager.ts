import * as fs from 'fs-extra';
import * as path from 'path';
import * as mustache from 'mustache';
import { SolanaPipeConfig } from './types';

export class TemplateManager {
  private templatesDir: string;

  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'templates');
  }

  async generateProject(config: SolanaPipeConfig): Promise<void> {
    const templateData = {
      config,
      currentYear: new Date().getFullYear(),
      timestamp: new Date().toISOString()
    };

    // Create project directory
    const projectDir = path.join(process.cwd(), config.projectName);
    await fs.ensureDir(projectDir);
    
    // Change to project directory for file generation
    const originalCwd = process.cwd();
    process.chdir(projectDir);

    try {
      // Generate root level files
      await this.generateFile('package.json.mustache', 'package.json', templateData);
      await this.generateFile('README.md.mustache', 'README.md', templateData);
      await this.generateFile('tsconfig.json.mustache', 'tsconfig.json', templateData);
      await this.generateFile('docker-compose.yml.mustache', 'docker-compose.yml', templateData);
      await this.generateFile('.gitignore.mustache', '.gitignore', templateData);

      // Generate src directory and files
      await this.generateDirectory('src');
      await this.generateFile('src/main.ts.mustache', 'src/main.ts', templateData);
      await this.generateFile('src/database-setup.sql.mustache', 'src/database-setup.sql', templateData);
      
      // Copy static files
      await this.copyStaticFile('src/clickhouse.ts', 'src/clickhouse.ts');
      await this.copyStaticFile('src/logger.ts', 'src/logger.ts');

      console.log(`✓ Generated Solana indexer project: ${config.projectName}`);
      console.log(`✓ Project location: ${projectDir}`);
      
    } finally {
      // Restore original working directory
      process.chdir(originalCwd);
    }
  }

  private async generateFile(templateName: string, outputName: string, data: any): Promise<void> {
    const templatePath = path.join(this.templatesDir, templateName);
    const outputPath = path.join(process.cwd(), outputName);

    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      const rendered = mustache.render(template, data);
      await fs.writeFile(outputPath, rendered);
      console.log(`✓ Generated ${outputName}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${outputName}:`, error);
    }
  }

  private async copyStaticFile(templateName: string, outputName: string): Promise<void> {
    const templatePath = path.join(this.templatesDir, templateName);
    const outputPath = path.join(process.cwd(), outputName);

    try {
      await fs.copyFile(templatePath, outputPath);
      console.log(`✓ Copied ${outputName}`);
    } catch (error) {
      console.error(`✗ Failed to copy ${outputName}:`, error);
    }
  }

  private async generateDirectory(dirName: string): Promise<void> {
    const dirPath = path.join(process.cwd(), dirName);
    await fs.ensureDir(dirPath);
  }
} 