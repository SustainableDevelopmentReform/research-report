import { join, basename, dirname, relative } from 'path';
import { mkdir } from 'fs/promises';
import chalk from 'chalk';

export class Logger {
  constructor(verbose = true) {
    this.verbose = verbose;
  }

  info(message) {
    if (this.verbose) {
      console.log(chalk.blue('ℹ'), message);
    }
  }

  success(message) {
    console.log(chalk.green('✓'), message);
  }

  error(message) {
    console.error(chalk.red('✗'), message);
  }

  warn(message) {
    console.warn(chalk.yellow('⚠'), message);
  }

  progress(current, total, message) {
    const percentage = Math.round((current / total) * 100);
    console.log(chalk.cyan(`[${current}/${total}]`), `${percentage}%`, message);
  }
}

export async function ensureDirectory(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export function getDocumentType(filePath) {
  const fileName = basename(filePath, '.html');
  
  // Check for common patterns
  if (fileName.includes('dashboard')) return 'dashboard';
  if (fileName.includes('report')) return 'report';
  if (fileName.includes('chart')) return 'chart';
  if (fileName === 'index') return 'index';
  
  return 'default';
}

export function generateOutputPath(inputPath, inputDir, outputDir) {
  const relativePath = relative(inputDir, inputPath);
  const outputPath = join(outputDir, relativePath).replace('.html', '.pdf');
  return outputPath;
}

export function shouldExclude(filePath, excludePatterns) {
  const relativePath = filePath;
  return excludePatterns.some(pattern => relativePath.includes(pattern));
}

export async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}