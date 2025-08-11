# Research Report Publishing Platform

> Transform your research data into professional web dashboards and print-ready PDFs with automated publishing workflows

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**[Quick Start](#-quick-start-for-researchers) • [Examples](#-examples--templates) • [Documentation](#-documentation) • [Why This Platform?](#-why-this-platform)**

</div>

## 🎯 What This Platform Does

This platform provides researchers with a modern, reproducible workflow for creating data-driven research outputs that work both as **interactive web dashboards** and **professional PDF reports**. Built on Observable Framework with advanced PDF generation, it bridges the gap between dynamic data visualization and traditional academic publishing.

```
📊 Your Data → 🎨 Visualizations → 🌐 Interactive Web + 📄 Print PDF → 🚀 Published Research
```

## 🚀 Why This Platform?

### Comparison with Traditional Tools

| Feature | This Platform | R/RMarkdown | LaTeX | Jupyter | MS Word |
|---------|--------------|-------------|--------|---------|---------|
| **Interactive Web Dashboards** | ✅ Native, responsive | ⚠️ Limited (Shiny) | ❌ None | ⚠️ Basic | ❌ None |
| **Professional PDF Output** | ✅ Automated with typography | ✅ Good | ✅ Excellent | ⚠️ Basic | ⚠️ Manual |
| **Version Control** | ✅ Git-native | ⚠️ Possible | ⚠️ Possible | ✅ Good | ❌ Poor |
| **Real-time Collaboration** | ✅ GitHub/GitLab | ❌ Limited | ❌ Limited | ⚠️ Limited | ⚠️ OneDrive |
| **Data Reproducibility** | ✅ Built-in pipeline | ✅ Good | ❌ Manual | ✅ Good | ❌ None |
| **Learning Curve** | 🟡 Medium | 🔴 Steep | 🔴 Very Steep | 🟡 Medium | 🟢 Easy |
| **Modern Web Tech** | ✅ D3.js, Observable | ❌ Limited | ❌ None | ⚠️ Limited | ❌ None |

### Key Advantages

- **📱 Responsive First**: Your research adapts to any screen size automatically
- **🔄 Live Reloading**: See changes instantly while developing
- **📊 Professional Visualizations**: Same tools used by NYT, Guardian, and FT data teams
- **🖨️ Smart PDF Generation**: Automatic page breaks, QR codes, and proper typography
- **🔗 Connected Outputs**: QR codes in PDFs link to live web versions
- **📦 No Installation Hell**: Just Node.js - no R package conflicts or LaTeX distributions
- **🚀 GitHub Pages Ready**: Free hosting for your research dashboards

## 📚 Perfect For

- **🎓 PhD Students** - Creating interactive dissertation chapters with accompanying PDFs
- **🏛️ Research Institutions** - Publishing annual reports with data dashboards
- **📋 Policy Analysts** - Generating data-driven policy briefs for stakeholders
- **🎤 Conference Organizers** - Creating proceedings with interactive visualizations
- **🧪 Lab Groups** - Sharing research findings internally and externally
- **📈 Think Tanks** - Multi-format distribution of research insights

## 🎓 Quick Start for Researchers

### Prerequisites

You'll need:
- [Node.js](https://nodejs.org/) (version 18+) - [Installation guide for academics](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/) - [GitHub Desktop](https://desktop.github.com/) for a visual interface
- A text editor - We recommend [VS Code](https://code.visualstudio.com/)

### Your First Research Dashboard in 5 Minutes

1. **Clone this template**
   ```bash
   git clone https://github.com/yourusername/research-report.git my-research
   cd my-research
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd pdf-export && npm install && cd ..
   ```

3. **Start developing**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 to see your dashboard!

4. **Add your data**
   - Drop CSV files in `src/data/`
   - They're automatically available in your pages

5. **Create visualizations**
   - Edit `src/index.md` using markdown
   - Add charts with Observable Plot
   - Use our built-in components (timeline, Sankey diagrams)

6. **Generate PDF**
   ```bash
   npm run build
   npm run export:pdf
   ```
   Your PDF appears in `pdf-export/output/`!

### 🎬 Video Tutorials

- [Getting Started (10 min)](https://example.com) - From zero to first visualization
- [Adding Your Research Data (8 min)](https://example.com) - CSV, JSON, and API data
- [Creating Publication-Ready PDFs (12 min)](https://example.com) - Export and formatting

## 💡 Examples & Templates

### Research Report with Citations
```markdown
# Climate Change Impact Analysis

${ResearchSummary}

## Introduction

Recent studies [@smith2023; @jones2024] demonstrate...

```javascript
Plot.plot({
  marks: [
    Plot.line(data, {x: "year", y: "temperature"})
  ]
})
```
```
[See full example →](examples/research-report.md)

### Policy Brief Template
- Executive summary with key findings
- Interactive data visualizations
- Auto-generated PDF with QR code
- [View template →](examples/policy-brief.md)

### Conference Paper
- Proper academic formatting
- Figure and table numbering
- Bibliography management
- [View template →](examples/conference-paper.md)

## 🛠️ Features

### 📊 Visualization Components

#### Built-in Components
- **Timeline** - Perfect for historical data and event sequences
- **Sankey Diagrams** - Visualize flows and relationships
- **Statistical Plots** - Via Observable Plot (histograms, scatter plots, etc.)
- **Custom D3.js** - Full power of D3 for bespoke visualizations

#### Example: Creating a Research Timeline
```javascript
import {Timeline} from "./components/timeline.js";

Timeline(events, {
  title: "Research Project Milestones",
  startDate: "2023-01",
  endDate: "2024-12"
})
```

### 📄 PDF Export Pipeline

Our sophisticated PDF generation includes:

- **Smart Page Breaks** - Tables and figures stay together
- **QR Code Integration** - Links print versions to web
- **Academic Typography** - Professional formatting
- **Custom Styling** - Match your institution's guidelines
- **Batch Processing** - Export multiple reports at once

Configuration in `pdf-export/config/config.json`:
```json
{
  "format": "A4",
  "margin": {"top": "20mm", "bottom": "20mm"},
  "headerTemplate": "{{title}} - {{date}}",
  "footerTemplate": "Page {{page}} of {{pages}}"
}
```

### 📦 Data Management

- **Multiple Formats**: CSV, JSON, Parquet, Arrow
- **Data Loaders**: Process data at build time
- **API Integration**: Fetch from external sources
- **Caching**: Efficient rebuilds
- **Version Control**: Track data changes with Git

Example data loader (`src/data/analysis.csv.js`):
```javascript
import {csvParse} from "d3-dsv";

const raw = await FileAttachment("./raw-data.csv").text();
const data = csvParse(raw, d => ({
  date: new Date(d.date),
  value: +d.value
}));

export default data;
```

## 📖 Documentation

### Project Structure

```
my-research/
├── src/                    # Your research content
│   ├── index.md           # Homepage/main report
│   ├── methods.md         # Additional pages
│   ├── data/              # Data files and loaders
│   │   ├── results.csv    # Raw data
│   │   └── results.csv.js # Data processing
│   └── components/        # Reusable visualizations
├── pdf-export/            # PDF generation system
│   ├── config/           # PDF settings
│   ├── output/           # Generated PDFs
│   └── src/              # Export logic
└── dist/                  # Built website (git-ignored)
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with live reload |
| `npm run build` | Build production website |
| `npm run export:pdf` | Generate PDF from built site |
| `npm run export:watch` | Auto-regenerate PDF on changes |
| `npm run clean` | Clean build artifacts |
| `npm run deploy` | Deploy to GitHub Pages |

### Configuration

#### Observable Framework (`observablehq.config.js`)
```javascript
export default {
  title: "My Research Project",
  pages: [
    {name: "Introduction", path: "/"},
    {name: "Methods", path: "/methods"},
    {name: "Results", path: "/results"}
  ],
  theme: "air"  // or "near-midnight" for dark mode
}
```

#### PDF Export (`pdf-export/config/config.json`)
- Page size and margins
- Headers and footers
- QR code settings
- Per-document overrides

## 🔬 Advanced Features

### Publishing Pipeline Integration

- **Ghost CMS Integration** - Manage content separately from code
- **DOI Minting** - Zenodo integration for citations
- **Automated Workflows** - GitHub Actions for CI/CD
- **Multi-format Export** - HTML, PDF, and future EPUB support

### For Research Groups

- **Shared Templates** - Maintain consistency across projects
- **Component Library** - Reuse visualizations
- **Data Pipelines** - Standardize processing
- **Review Workflows** - Pull request reviews for quality control

## 🆘 Help for Researchers

### Coming from R?
- Observable Plot is similar to ggplot2 but for the web
- Data manipulation uses JavaScript instead of dplyr
- [Migration guide from R →](docs/from-r.md)

### Coming from LaTeX?
- Markdown is simpler but powerful enough for most needs
- Math rendering via KaTeX: `$$\alpha + \beta = \gamma$$`
- Bibliography management via CSL
- [LaTeX users guide →](docs/from-latex.md)

### New to Git?
- Use GitHub Desktop for visual interface
- Basic workflow: Edit → Commit → Push
- [Git for researchers →](docs/git-basics.md)

## 🤝 Contributing

We welcome contributions from the research community!

### How to Contribute
- **Report Issues** - Found a bug? Let us know!
- **Share Templates** - Created a useful layout? Share it!
- **Improve Docs** - Help other researchers get started
- **Add Features** - Extend functionality for your needs

### Community Templates
- [Systematic Review Dashboard](community/systematic-review)
- [Lab Notebook Template](community/lab-notebook)
- [Grant Proposal Figures](community/grant-proposal)

## 📚 Resources

- [Observable Framework Documentation](https://observablehq.com/framework/)
- [D3.js Gallery](https://observablehq.com/@d3/gallery)
- [Observable Plot Examples](https://observablehq.com/plot/)
- [Academic Writing in Markdown](https://pandoc.org/MANUAL.html)

## 📄 License

MIT - Use freely in your research!

## 🙏 Acknowledgments

Built on:
- [Observable Framework](https://observablehq.com/framework/) by Observable Inc.
- [D3.js](https://d3js.org/) by Mike Bostock
- [Puppeteer](https://pptr.dev/) for PDF generation

---

<div align="center">

**Ready to modernize your research publishing?**

[Get Started](#-quick-start-for-researchers) • [View Examples](examples/) • [Read Docs](docs/)

</div>