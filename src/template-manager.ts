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

    // TODO: Implement indexer-specific template generation
    console.log('Template generation not yet implemented');
    console.log('Configuration received:', JSON.stringify(config, null, 2));
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

  private async generateDirectory(dirName: string): Promise<void> {
    const dirPath = path.join(process.cwd(), dirName);
    await fs.ensureDir(dirPath);
  }
} 