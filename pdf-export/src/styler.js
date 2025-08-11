import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class StyleManager {
  constructor() {
    this.stylesPath = join(__dirname, '..', 'config', 'styles.css');
    this.customStyles = null;
  }

  async loadStyles() {
    if (!this.customStyles) {
      this.customStyles = await readFile(this.stylesPath, 'utf8');
    }
    return this.customStyles;
  }

  async injectStyles(html) {
    const styles = await this.loadStyles();
    
    // Find the closing head tag and inject styles before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex === -1) {
      throw new Error('No </head> tag found in HTML');
    }

    const styleTag = `\n<style id="pdf-export-styles">\n${styles}\n</style>\n`;
    
    return html.slice(0, headEndIndex) + styleTag + html.slice(headEndIndex);
  }

  // Generate page-specific styles based on configuration
  generatePageStyles(pageConfig) {
    const styles = [];

    if (pageConfig.format) {
      styles.push(`@page { size: ${pageConfig.format}; }`);
    }

    if (pageConfig.landscape) {
      styles.push(`@page { size: ${pageConfig.format || 'A4'} landscape; }`);
    }

    if (pageConfig.margin) {
      const { top, right, bottom, left } = pageConfig.margin;
      styles.push(`@page { margin: ${top} ${right} ${bottom} ${left}; }`);
    }

    if (pageConfig.headerTemplate) {
      styles.push(`@page { @top-center { content: "${pageConfig.headerTemplate}"; } }`);
    }

    if (pageConfig.footerTemplate) {
      styles.push(`@page { @bottom-center { content: "${pageConfig.footerTemplate}"; } }`);
    }

    return styles.join('\n');
  }

  // Apply document-specific overrides
  applyDocumentOverrides(html, documentType) {
    let modifiedHtml = html;

    // Apply specific modifications based on document type
    switch (documentType) {
      case 'dashboard':
        // For dashboards, we might want to preserve more width
        modifiedHtml = modifiedHtml.replace(
          /<body([^>]*)>/,
          '<body$1 class="pdf-dashboard">'
        );
        break;
      
      case 'report':
        // For reports, we might want more traditional styling
        modifiedHtml = modifiedHtml.replace(
          /<body([^>]*)>/,
          '<body$1 class="pdf-report">'
        );
        break;
      
      case 'chart':
        // For chart-heavy pages
        modifiedHtml = modifiedHtml.replace(
          /<body([^>]*)>/,
          '<body$1 class="pdf-chart">'
        );
        break;
    }

    return modifiedHtml;
  }

  // Optimize SVGs for print
  optimizeSVGs(html) {
    // Add viewBox if missing and set explicit dimensions
    return html.replace(/<svg([^>]*)>/g, (match, attrs) => {
      if (!attrs.includes('viewBox')) {
        // Try to extract width and height to create viewBox
        const widthMatch = attrs.match(/width=["']?(\d+)/);
        const heightMatch = attrs.match(/height=["']?(\d+)/);
        
        if (widthMatch && heightMatch) {
          const width = widthMatch[1];
          const height = heightMatch[1];
          return `<svg${attrs} viewBox="0 0 ${width} ${height}">`;
        }
      }
      return match;
    });
  }

  // Ensure images have explicit dimensions
  optimizeImages(html) {
    // This is a simple implementation - in production you might want to
    // actually read image dimensions
    return html.replace(/<img([^>]*)>/g, (match, attrs) => {
      if (!attrs.includes('width') && !attrs.includes('height')) {
        return `<img${attrs} style="max-width: 100%; height: auto;">`;
      }
      return match;
    });
  }

  // Full processing pipeline
  async processForPDF(html, options = {}) {
    let processedHtml = await this.injectStyles(html);
    
    if (options.documentType) {
      processedHtml = this.applyDocumentOverrides(processedHtml, options.documentType);
    }
    
    if (options.pageConfig) {
      const pageStyles = this.generatePageStyles(options.pageConfig);
      if (pageStyles) {
        processedHtml = processedHtml.replace(
          '</style>\n</head>',
          `${pageStyles}\n</style>\n</head>`
        );
      }
    }
    
    processedHtml = this.optimizeSVGs(processedHtml);
    processedHtml = this.optimizeImages(processedHtml);
    
    return processedHtml;
  }
}