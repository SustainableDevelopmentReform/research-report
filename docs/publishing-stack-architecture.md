# Publishing Stack Architecture for Think Tank

## Overview

This document outlines a comprehensive open-source publishing stack for a global think tank, supporting both technical data visualization staff and narrative content authors. The architecture evolves the existing Observable Framework codebase while maintaining vendor independence.

## Architecture Components

### Upstream (Authoring & Content Management)

#### 1. Extend Observable Framework with Frontmatter

```yaml
---
title: "Climate Finance Flows 2024"
type: "report" # or "dashboard", "brief", "article"
tags: ["climate", "finance", "policy"]
doi: true # Flag for DOI minting
pdf: true # Flag for PDF generation
authors: ["Jane Smith", "John Doe"]
date: 2024-01-15
abstract: "Brief description for metadata"
---
```

#### 2. Authoring Options

- **Technical staff**: VS Code with GitHub Codespaces (browser-based)
- **Non-technical**: Prose.io or GitLab Web IDE (better markdown preview)
- **Alternative**: Decap CMS (formerly Netlify CMS) - git-based, open source

### Midstream (Processing & Distribution)

#### 1. Build Pipeline Architecture

```
GitHub Actions Workflow:
├── Observable Build → Static HTML
├── Content Processor
│   ├── Extract frontmatter → content.json manifest
│   ├── Generate content for Ghost import
│   └── Create tag indices
├── PDF Pipeline (for flagged content)
│   └── Puppeteer → PDF with custom styling
├── DOI Service Integration
│   └── Zenodo API (free, academic-friendly)
├── Ghost CMS Sync
│   └── Push content via Admin API
└── Deploy to Multiple Targets
    ├── Dashboards → data.thinktank.org
    └── Ghost CMS → www.thinktank.org
```

#### 2. Ghost CMS Configuration

**Ghost** serves as the primary CMS for several reasons:
- **Professional themes** - Publication-ready designs out of the box
- **Built-in membership & newsletter** - Essential for think tank audience engagement
- **SEO optimized** - Critical for research discoverability
- **Content API** - Clean integration with Observable Framework
- **Self-hostable** - Maintains independence while offering managed options

**Ghost Setup:**
```javascript
// ghost-config.production.json
{
  "url": "https://www.thinktank.org",
  "server": {
    "port": 2368,
    "host": "0.0.0.0"
  },
  "database": {
    "client": "sqlite3",
    "connection": {
      "filename": "/var/lib/ghost/content/data/ghost.db"
    }
  },
  "mail": {
    "transport": "SMTP",
    "options": {/* your email config */}
  },
  "logging": {
    "transports": ["file", "stdout"]
  }
}
```

### Downstream (Presentation & Discovery)

#### 1. Dual-Site Architecture

```
Main Site (Ghost CMS):
├── www.thinktank.org
├── Professional theme (e.g., Solo, Edition)
├── Reports, articles, policy briefs
├── Tag-based navigation and search
├── Newsletter subscriptions
├── Author profiles and bios
└── PDF downloads with DOI citations

Data Dashboard Site (Observable Framework):
├── data.thinktank.org
├── Interactive visualizations
├── Embedded in Ghost posts via iframes
├── Direct deep-linking from Ghost
└── Standalone dashboard access
```

#### 2. Ghost Theme Customization

```handlebars
{{!-- custom-theme/post.hbs --}}
{{#post}}
<article class="{{post_class}}">
  <header class="post-header">
    <h1>{{title}}</h1>
    {{#if custom.doi}}
      <div class="doi-badge">
        <a href="https://doi.org/{{custom.doi}}">DOI: {{custom.doi}}</a>
      </div>
    {{/if}}
  </header>
  
  {{#has tag="dashboard"}}
    <div class="dashboard-embed">
      <iframe src="https://data.thinktank.org/{{custom.dashboard_path}}" 
              width="100%" height="600" frameborder="0">
      </iframe>
      <a href="https://data.thinktank.org/{{custom.dashboard_path}}" target="_blank">
        Open in new window →
      </a>
    </div>
  {{/has}}
  
  <div class="post-content">
    {{content}}
  </div>
  
  {{#if custom.pdf_url}}
    <footer class="post-footer">
      <a href="{{custom.pdf_url}}" class="download-pdf">
        Download PDF Report
      </a>
    </footer>
  {{/if}}
</article>
{{/post}}
```

#### 3. Ghost Integration Implementation

```javascript
// ghost-sync/sync-to-ghost.js
const GhostAdminAPI = require('@tryghost/admin-api');
const matter = require('gray-matter');
const fs = require('fs-extra');

const api = new GhostAdminAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_ADMIN_KEY,
  version: 'v5.0'
});

async function syncContent() {
  const contentManifest = await fs.readJson('dist/content-manifest.json');
  
  for (const item of contentManifest) {
    if (item.type === 'report' || item.type === 'article') {
      const htmlContent = await fs.readFile(item.htmlPath, 'utf8');
      
      // Create or update Ghost post
      const post = {
        title: item.title,
        html: htmlContent,
        tags: item.tags.map(tag => ({name: tag})),
        custom_excerpt: item.abstract,
        published_at: item.date,
        authors: item.authors.map(name => ({name})),
        // Custom fields for DOI and PDF
        codeinjection_head: `
          <meta name="doi" content="${item.doi}">
          <meta name="pdf_url" content="${item.pdfUrl}">
        `
      };
      
      try {
        await api.posts.add(post);
        console.log(`Synced: ${item.title}`);
      } catch (error) {
        console.error(`Failed to sync: ${item.title}`, error);
      }
    }
  }
}

// Handle dashboard references
async function createDashboardPosts() {
  const dashboards = contentManifest.filter(item => item.type === 'dashboard');
  
  for (const dashboard of dashboards) {
    const post = {
      title: dashboard.title,
      html: `
        <div class="dashboard-preview">
          <img src="${dashboard.screenshotUrl}" alt="${dashboard.title} preview">
          <p>${dashboard.description}</p>
          <a href="https://data.thinktank.org/${dashboard.path}" class="button">
            View Interactive Dashboard
          </a>
        </div>
      `,
      tags: [...dashboard.tags, 'dashboard'],
      custom_excerpt: dashboard.description
    };
    
    await api.posts.add(post);
  }
}
```

## Key Services & Tools

### DOI Minting
- **Zenodo** (free, CERN-backed, API-driven)
- **Crossref** (paid but standard for publications)

### Search/Filtering
- **MeiliSearch** (open source, self-hosted)
- **Typesense** (open source alternative)

### PDF Generation
- Enhance existing Puppeteer pipeline with:
  - Prince XML (better typography but paid)
  - WeasyPrint (open source alternative)

### Deployment
- **Coolify** (open source Vercel/Netlify alternative)
- **Dokku** (Heroku-like PaaS)
- **Direct VPS** with Caddy server

## GitHub Actions Workflow Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build Observable
        run: npm run build
      
      - name: Generate Content Manifest
        run: node ghost-sync/generate-manifest.js
      
      - name: Build PDFs
        run: |
          for file in $(jq -r '.[] | select(.pdf == true) | .path' dist/content-manifest.json); do
            npm run pdf:export -- $file
          done
      
      - name: Upload PDFs to CDN
        run: |
          aws s3 sync pdf-export/output/ s3://thinktank-pdfs/ --acl public-read
      
      - name: Mint DOIs via Zenodo
        run: |
          for item in $(jq -c '.[] | select(.doi == true)' dist/content-manifest.json); do
            ./scripts/zenodo-mint-doi.sh "$item"
          done
      
      - name: Sync to Ghost CMS
        env:
          GHOST_URL: ${{ secrets.GHOST_URL }}
          GHOST_ADMIN_KEY: ${{ secrets.GHOST_ADMIN_KEY }}
        run: node ghost-sync/sync-to-ghost.js
      
      - name: Deploy Observable Dashboards
        run: |
          rsync -av --delete dist/ data.thinktank.org:/var/www/html/
          
      - name: Clear Ghost Cache
        run: |
          curl -X DELETE ${{ secrets.GHOST_URL }}/ghost/api/admin/site/cache/ \
            -H "Authorization: Ghost ${{ secrets.GHOST_ADMIN_KEY }}"
```

## Benefits of This Architecture

1. **Complete open-source stack** - No vendor lock-in
2. **Flexible authoring** - Supports both technical and non-technical users
3. **Automated workflows** - Git-based with CI/CD pipeline
4. **Professional outputs** - Web and print-ready PDFs with DOIs
5. **Scalable** - Can grow with organizational needs
6. **Maintainable** - Clear separation of concerns

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. Set up Ghost instance with chosen theme (Solo or Edition)
2. Implement frontmatter support in Observable Framework
3. Create ghost-sync module for content synchronization
4. Configure GitHub Actions workflow

### Phase 2: Integration (Week 3-4)
1. Implement Zenodo DOI minting integration
2. Set up PDF generation and CDN storage
3. Create Ghost custom theme modifications
4. Test end-to-end publishing pipeline

### Phase 3: Polish (Week 5-6)
1. Implement dashboard embedding in Ghost
2. Configure newsletter and membership features
3. Set up monitoring and backup strategies
4. Documentation and team training

## Technical Requirements

- **Ghost Hosting**: DigitalOcean droplet (2GB RAM minimum) or Ghost(Pro)
- **Dashboard Hosting**: Same server or separate VPS for Observable
- **PDF Storage**: S3-compatible storage (AWS S3, Backblaze B2, or MinIO)
- **Domain Setup**: 
  - www.thinktank.org → Ghost
  - data.thinktank.org → Observable dashboards
  - cdn.thinktank.org → PDF/asset storage

## Cost Estimates

- **Self-hosted option**: ~$30-50/month
  - VPS hosting: $20-30/month
  - Object storage: $5-10/month
  - Backup storage: $5-10/month
  
- **Managed option**: ~$50-150/month
  - Ghost(Pro): $25-99/month
  - Vercel/Netlify for dashboards: $0-20/month
  - AWS S3: $10-30/month