import QRCode from 'qrcode';
import { basename } from 'path';

export class QRGenerator {
  constructor(config = {}) {
    this.config = {
      width: 65,
      margin: 1,
      errorCorrectionLevel: 'M',
      // High-contrast ocean theme
      colors: {
        dark: '#003355', // Dark ocean blue for high contrast
        light: '#ffffff' // White background
      },
      ...config
    };
  }

  /**
   * Generate a QR code as a data URL for a given file path
   * @param {string} filePath - The HTML file path
   * @param {Object} qrConfig - QR code specific configuration
   * @returns {Promise<string>} - Data URL of the QR code
   */
  async generateForFile(filePath, qrConfig = {}) {
    const config = { ...this.config, ...qrConfig };
    
    // Generate URL based on file path and config
    const url = this.generateURL(filePath, config);
    
    if (!url) {
      return null;
    }
    
    try {
      // Generate QR code as SVG string with solid colors
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        width: config.width,
        margin: config.margin,
        errorCorrectionLevel: config.errorCorrectionLevel,
        color: config.colors || config.color
      });
      
      // Convert to data URL without additional styling
      const svgBase64 = Buffer.from(svgString).toString('base64');
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
      
      return dataUrl;
    } catch (error) {
      console.error(`Failed to generate QR code for ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Generate the URL to encode in the QR code
   * @param {string} filePath - The HTML file path
   * @param {Object} config - Configuration object
   * @returns {string} - URL to encode
   */
  generateURL(filePath, config) {
    if (!config.baseUrl) {
      return null;
    }
    
    // Always return the base URL (index page) for all QR codes
    return config.baseUrl;
  }

  /**
   * Generate QR code HTML element to inject into page
   * @param {string} dataUrl - QR code data URL
   * @param {string} url - The URL the QR code points to
   * @param {Object} position - Position configuration
   * @returns {string} - HTML string
   */
  generateHTML(dataUrl, url, position = {}) {
    if (!dataUrl) {
      return '';
    }
    
    const positionClass = position.class || 'qr-code-top-right';
    const title = position.title || 'Scan to view online';
    
    return `
      <div class="qr-code-container qr-code-first-page ${positionClass}">
        <a href="${url}" target="_blank" rel="noopener noreferrer">
          <img src="${dataUrl}" class="qr-code-image" />
        </a>
      </div>
    `;
  }

  /**
   * Generate JavaScript to inject QR code into page
   * @param {string} dataUrl - QR code data URL
   * @param {string} url - The URL the QR code points to
   * @param {Object} position - Position configuration
   * @returns {string} - JavaScript code to execute in page context
   */
  generateInjectionScript(dataUrl, url, position = {}) {
    if (!dataUrl) {
      return '';
    }
    
    const html = this.generateHTML(dataUrl, url, position);
    
    return `
      (() => {
        // Remove any existing QR codes
        const existing = document.querySelectorAll('.qr-code-container');
        existing.forEach(el => el.remove());
        
        // Create and inject new QR code
        const container = document.createElement('div');
        container.innerHTML = \`${html}\`;
        const qrElement = container.firstElementChild;
        
        // Find the best place to inject based on document structure
        const body = document.body;
        const main = document.querySelector('main, #observablehq-main, .observablehq');
        const target = main || body;
        
        if (target) {
          target.appendChild(qrElement);
          // Position is now handled entirely by CSS classes
        }
      })();
    `;
  }
}