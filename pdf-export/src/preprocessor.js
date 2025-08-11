import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';

export class HTMLPreprocessor {
  constructor() {
    this.elementsToRemove = [
      '.observablehq-header',
      '.observablehq-footer',
      '.observablehq-sidebar',
      '.observablehq-sidebar-toggle',
      '.observablehq-toc',
      '.observablehq-toc-toggle',
      '.observablehq-search',
      '.observablehq-theme-toggle',
      '.observablehq-pager',
      '#observablehq-sidebar-toggle',
      '#observablehq-toc-toggle'
    ];
  }

  async processHTML(filePath) {
    const html = await readFile(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove Observable UI elements
    this.elementsToRemove.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Update main content area for full width
    const mainContent = document.querySelector('.observablehq-main');
    if (mainContent) {
      mainContent.style.maxWidth = 'none';
      mainContent.style.margin = '0';
      mainContent.style.padding = '0';
    }

    // Ensure all images and assets use absolute paths
    this.fixAssetPaths(document, filePath);

    // Wait for any lazy-loaded content
    this.ensureContentLoaded(document);

    return dom.serialize();
  }

  fixAssetPaths(document, filePath) {
    // Fix image sources
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        // Convert relative paths to absolute
        img.setAttribute('src', this.resolveAssetPath(src, filePath));
      }
    });

    // Fix link hrefs for stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        link.setAttribute('href', this.resolveAssetPath(href, filePath));
      }
    });
  }

  resolveAssetPath(relativePath, htmlFilePath) {
    // This is a simple implementation - adjust based on your actual file structure
    if (relativePath.startsWith('/')) {
      return `file://${process.cwd()}/dist${relativePath}`;
    }
    return `file://${process.cwd()}/dist/${relativePath}`;
  }

  ensureContentLoaded(document) {
    // Add markers to indicate content is ready for PDF
    document.querySelectorAll('svg').forEach(svg => {
      svg.setAttribute('data-rendered', 'true');
    });

    // Remove any loading indicators
    document.querySelectorAll('.loading, .spinner').forEach(el => el.remove());
  }
}