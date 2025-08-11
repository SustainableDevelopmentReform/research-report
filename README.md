# Research Report Publishing Platform

> Transform your research data into professional web dashboards and print-ready PDFs with automated publishing workflows

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**[🌐 Live Demo](https://sustainabledevelopmentreform.github.io/research-report/) • [Quick Start](#-quick-start-for-researchers) • [Examples](#-working-examples) • [Documentation](#-documentation)**

</div>

## 🎯 What This Platform Does

This platform provides researchers with a modern, reproducible workflow for creating data-driven research outputs that work both as **interactive web dashboards** and **professional PDF reports**. Built on Observable Framework with advanced PDF generation, it bridges the gap between dynamic data visualization and traditional academic publishing. 

The platform is a side-quest so please be patient (but also vocal and proactive) with any errors or issues you encounter. We are actively developing it to meet the needs of researchers and other stakeholders.

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
   git clone https://github.com/SustainableDevelopmentReform/research-report.git my-research
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


## 💡 Working Examples

### Using the Timeline Component
```javascript
import {Timeline} from "./components/timeline.js";

const events = [
  {date: "2023-01", label: "Project Start"},
  {date: "2023-06", label: "Data Collection"},
  {date: "2024-01", label: "Analysis Complete"}
];

Timeline(events, {
  title: "Research Timeline",
  width: 800
})
```

### Creating a Sankey Diagram
```javascript
import {SankeyDiagram} from "./components/sankey-diagram.js";

SankeyDiagram(data, {
  sourceField: "source",
  targetField: "target",
  valueField: "value"
})
```

### Data Loader Example
See `src/data/example.csv.js` for a working data loader that processes CSV files at build time.

## 🛠️ Features

### 🌐 Observable Framework Capabilities

Observable Framework provides powerful features for research computing:

#### Mathematical Notation
Write equations using TeX notation directly in markdown:
```markdown
The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Or display equations:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

#### Geospatial Analysis
- Built-in support for mapping with [Leaflet](https://observablehq.com/framework/lib/leaflet) and [Mapbox GL](https://observablehq.com/framework/lib/mapbox-gl)
- GeoJSON and TopoJSON data handling
- Interactive maps with data overlays
- [Geospatial examples](https://observablehq.com/framework/lib/geo)

#### SQL Queries
Query data directly with DuckDB:
```javascript
const results = await sql`
  SELECT year, AVG(temperature) as avg_temp
  FROM climate_data
  GROUP BY year
  ORDER BY year
`;
```
[Learn more about SQL in Observable](https://observablehq.com/framework/lib/sql)

#### Real-time Data
- WebSocket connections for live data
- Auto-refresh data loaders
- Reactive updates when data changes
- [API integration examples](https://observablehq.com/framework/loaders)

#### Scientific Computing
- [Apache Arrow](https://observablehq.com/framework/lib/arrow) for efficient data processing
- [Arquero](https://observablehq.com/framework/lib/arquero) for data transformation
- [Simple Statistics](https://observablehq.com/@observablehq/simple-statistics) for statistical analysis
- Python integration via data loaders

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

**The PDF export works excellently out-of-the-box!** Our sophisticated PDF generation automatically handles:

- **Professional Typography** - Clean, academic formatting by default
- **Smart Page Breaks** - Tables and figures stay together automatically
- **Table Handling** - Multi-page tables with proper headers and formatting
- **QR Code Integration** - Auto-generated QR codes link print to web versions
- **Custom Styling** - Easily match your institution's guidelines if needed
- **Batch Processing** - Export multiple reports at once

PDFs are generated in `pdf-export/output/` and automatically copied to `src/` for easy access.

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

## 📚 Referencing & Citations

### Current Support: Footnotes

The platform supports footnotes using standard markdown syntax:

```markdown
This is a statement that needs a reference[^1].

Another claim with a different source[^2].

[^1]: Smith, J. (2024). *Title of Paper*. Journal Name, 45(3), 123-145.
[^2]: Jones, A. & Brown, B. (2023). *Book Title*. Publisher.
```

Footnotes are automatically:
- Numbered sequentially
- Linked bi-directionally (click to jump between text and note)
- Styled appropriately in PDF output
- Placed at the bottom of the page in PDF

### Bibliography Management

Currently, bibliography management is manual. We recommend:

1. **For simple references**: Use footnotes as shown above
2. **For bibliography section**: Create a markdown list at the end of your document:

```markdown
## References

- Smith, J. (2024). *Title of Paper*. Journal Name, 45(3), 123-145.
- Jones, A. & Brown, B. (2023). *Book Title*. Publisher.
- Williams, C. (2023). "Article Title." *Conference Proceedings*, pp. 78-92.
```

3. **For consistent formatting**: Use a reference manager (Zotero, Mendeley) to export formatted citations, then paste into your markdown

**Note**: Full academic citation support (BibTeX, CSL) is on our roadmap (see below).

## 🚀 Deployment

### GitHub Pages (Public, Free)

This repository includes a GitHub Actions workflow for automatic deployment:

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Update research"
   git push origin main
   ```

3. **Automatic deployment**:
   - GitHub Actions builds your site
   - Deploys to `https://[username].github.io/[repository]/`
   - Usually takes 2-3 minutes

### Netlify (Free with Password Protection)

For private research or pre-publication drafts:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   
   **Option A: Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag your `dist` folder to the deployment area
   
   **Option B: Git Integration**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Enable password protection** (free tier):
   - Site Settings → Access Control → Password Protection
   - Set a password for your site

4. **Custom domain** (optional):
   - Domain Settings → Add custom domain

### Vercel (Alternative to Netlify)

Similar to Netlify with good performance:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   npm run build
   vercel dist
   ```

### Observable Platform

For Observable's hosted solution (requires account):
```bash
npm run deploy
```

## 🗺️ Feature Roadmap

### Near Term (Q1 2025)
- [ ] Full BibTeX support for academic citations
- [ ] CSL (Citation Style Language) integration
- [ ] Enhanced PDF templates for different document types
- [ ] Docker container for consistent environments

### Medium Term (Q2-Q3 2025)
- [ ] Ghost CMS integration for content management
- [ ] DOI minting via Zenodo integration
- [ ] EPUB export for e-readers
- [ ] Multi-language support

### Long Term (Q4 2025+)
- [ ] Real-time collaboration features
- [ ] Integration with reference managers (Zotero, Mendeley)
- [ ] Automated literature review tools
- [ ] LaTeX equation editor with live preview

### For Research Groups

- **Shared Templates** - Maintain consistency across projects
- **Component Library** - Reuse visualizations
- **Data Pipelines** - Standardize processing
- **Review Workflows** - Pull request reviews for quality control

## 🆘 Getting Help

### New to Git?
- Use [GitHub Desktop](https://desktop.github.com/) for visual interface
- Basic workflow: Edit → Commit → Push
- [Pro Git Book (free)](https://git-scm.com/book) - comprehensive guide

### Learning Resources
- [Observable Plot Gallery](https://observablehq.com/plot/gallery) - visualization examples
- [D3.js Examples](https://observablehq.com/@d3/gallery) - advanced visualizations
- [Markdown Guide](https://www.markdownguide.org/) - formatting reference

## 🚀 Next Steps & Planned Resources

### Coming Soon
We're actively developing additional resources to help researchers:

#### 🎬 Video Tutorials (Planned)
- Getting Started (10 min) - From zero to first visualization
- Adding Your Research Data (8 min) - CSV, JSON, and API data
- Creating Publication-Ready PDFs (12 min) - Export and formatting

#### 📝 Template Library (In Development)
- **Research Report Template** - Full paper with citations and figures
- **Policy Brief Template** - Executive summary with key visualizations
- **Conference Paper Template** - Academic formatting with bibliography
- **Systematic Review Dashboard** - Interactive literature analysis
- **Lab Notebook Template** - Daily research documentation
- **Grant Proposal Figures** - Publication-quality visualizations

#### 🔧 Additional Tools
- GitHub template repository for one-click setup
- VS Code extension with snippets
- Citation management integration
- Cloud deployment guides

### Want to Help?
We're looking for contributors to help create these resources! See the Contributing section below.

## 🤝 Contributing

We welcome contributions from the research community!

### How to Contribute
- **Report Issues** - Found a bug? Let us know!
- **Share Templates** - Created a useful layout? Share it!
- **Improve Docs** - Help other researchers get started
- **Add Features** - Extend functionality for your needs
- **Create Tutorials** - Help with the resources above!


## 📚 Resources

- [Observable Framework Documentation](https://observablehq.com/framework/)
- [D3.js Gallery](https://observablehq.com/@d3/gallery)
- [Observable Plot Examples](https://observablehq.com/plot/)
- [Academic Writing in Markdown](https://pandoc.org/MANUAL.html)

## 📄 Licensing

### This Project
MIT License - Use freely in your research, teaching, and publications!

### Open Source Dependencies
This platform is built on open-source software with permissive licenses:

| Component | License | Usage Rights |
|-----------|---------|-------------|
| Observable Framework | ISC | ✅ Free for any use |
| D3.js | BSD-3-Clause | ✅ Free with attribution |
| Puppeteer | Apache 2.0 | ✅ Free with patent protection |
| Other npm packages | Various MIT/ISC | ✅ All permissive |

**What this means for researchers**:
- ✅ Use freely in academic and commercial projects
- ✅ Modify and extend for your needs
- ✅ No licensing fees or restrictions
- ✅ Include in grant-funded research
- ✅ Publish and share your modifications

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