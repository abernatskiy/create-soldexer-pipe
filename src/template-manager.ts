import * as fs from 'fs-extra';
import * as path from 'path';
import * as mustache from 'mustache';
import { TemplateData, ProjectConfig } from './types';

export class TemplateManager {
  private templatesDir: string;

  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'templates');
  }

  async generateProject(config: ProjectConfig): Promise<void> {
    const templateData: TemplateData = {
      config,
      currentYear: new Date().getFullYear(),
      timestamp: new Date().toISOString()
    };

    // Generate package.json
    await this.generateFile('package.json.mustache', 'package.json', templateData);
    
    // Generate README.md
    await this.generateFile('README.md.mustache', 'README.md', templateData);
    
    // Generate TypeScript config
    await this.generateFile('tsconfig.json.mustache', 'tsconfig.json', templateData);
    
    // Generate source files based on framework
    await this.generateFrameworkFiles(config, templateData);
    
    // Generate feature-specific files
    await this.generateFeatureFiles(config, templateData);
  }

  private async generateFile(templateName: string, outputName: string, data: TemplateData): Promise<void> {
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

  private async generateFrameworkFiles(config: ProjectConfig, data: TemplateData): Promise<void> {
    const framework = config.framework;
    
    switch (framework) {
      case 'anchor':
        await this.generateFile('anchor/Cargo.toml.mustache', 'Cargo.toml', data);
        await this.generateFile('anchor/Anchor.toml.mustache', 'Anchor.toml', data);
        await this.generateDirectory('anchor/src');
        await this.generateFile('anchor/src/lib.rs.mustache', 'src/lib.rs', data);
        break;
      case 'native':
        await this.generateFile('native/Cargo.toml.mustache', 'Cargo.toml', data);
        await this.generateDirectory('native/src');
        await this.generateFile('native/src/lib.rs.mustache', 'src/lib.rs', data);
        break;
      case 'spl':
        await this.generateFile('spl/Cargo.toml.mustache', 'Cargo.toml', data);
        await this.generateDirectory('spl/src');
        await this.generateFile('spl/src/lib.rs.mustache', 'src/lib.rs', data);
        break;
    }
  }

  private async generateFeatureFiles(config: ProjectConfig, data: TemplateData): Promise<void> {
    const { features } = config;

    if (features.testing) {
      await this.generateDirectory('tests');
      await this.generateFile('tests/test.ts.mustache', 'tests/test.ts', data);
    }

    if (features.documentation) {
      await this.generateFile('docs/README.md.mustache', 'docs/README.md', data);
    }

    if (features.docker) {
      await this.generateFile('docker/Dockerfile.mustache', 'Dockerfile', data);
      await this.generateFile('docker/docker-compose.yml.mustache', 'docker-compose.yml', data);
    }

    if (features.ci) {
      await this.generateFile('ci/.github/workflows/ci.yml.mustache', '.github/workflows/ci.yml', data);
    }

    if (features.linting) {
      await this.generateFile('linting/.eslintrc.js.mustache', '.eslintrc.js', data);
      await this.generateFile('linting/.prettierrc.mustache', '.prettierrc', data);
    }
  }

  private async generateDirectory(dirName: string): Promise<void> {
    const dirPath = path.join(process.cwd(), dirName);
    await fs.ensureDir(dirPath);
  }
} 