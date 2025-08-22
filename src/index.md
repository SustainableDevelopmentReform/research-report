# Research Report Publishing Platform

## Transform Your Data Into Professional Research Outputs

Welcome to the Research Report Publishing Platform - a modern framework for creating interactive web dashboards and print-ready PDF reports from your research data. This platform bridges the gap between dynamic data visualization and traditional academic publishing.

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {Timeline} from "./components/timeline.js";
import {SankeyDiagram} from "./components/sankey-diagram.js";
```

## 🎯 Platform Overview

This demonstration showcases the full capabilities of our research publishing platform. Each section below demonstrates different visualization techniques and data presentation methods that are essential for modern research communication.

### Key Features

```js
const features = [
  {category: "Visualization", feature: "Interactive Charts", status: "✓", description: "D3.js and Observable Plot integration"},
  {category: "Visualization", feature: "Custom Components", status: "✓", description: "Timeline, Sankey diagrams, and more"},
  {category: "Data", feature: "Multiple Formats", status: "✓", description: "CSV, JSON, Parquet, API integration"},
  {category: "Data", feature: "Real-time Updates", status: "✓", description: "Live data with auto-refresh"},
  {category: "Output", feature: "Web Dashboard", status: "✓", description: "Responsive, interactive web pages"},
  {category: "Output", feature: "PDF Export", status: "✓", description: "Professional print-ready documents"},
  {category: "Publishing", feature: "GitHub Pages", status: "✓", description: "Free hosting with version control"},
  {category: "Publishing", feature: "Citation Support", status: "✓", description: "Footnotes and bibliography management"}
];

Inputs.table(features, {
  columns: ["category", "feature", "description"],
  header: {
    category: "Category",
    feature: "Feature",
    description: "Description"
  }
})
```

## 📊 Interactive Demonstrations

Explore our comprehensive examples showing how to present research data effectively:

<div class="demo-grid">

### [Statistical Analysis](./statistical-analysis)
Comprehensive statistical visualizations including distributions, hypothesis testing, confidence intervals, and effect sizes. Perfect for presenting quantitative research findings.

### [Time Series Analysis](./time-series)
Advanced time series visualizations with trend analysis, seasonal decomposition, and forecasting. Ideal for longitudinal studies and temporal data.

### [Network Analysis](./network-analysis)
Interactive network graphs, community detection, and relationship mapping. Essential for social network analysis and systems research.

### [Geospatial Mapping](./geospatial)
Interactive maps with data overlays, choropleth visualizations, and location-based analysis. Perfect for geographic and demographic research.

### [Data Tables](./data-tables)
Sortable, filterable, and searchable tables with export capabilities. Efficiently present large datasets and detailed results.

### [Research Methods](./methods)
Document your methodology with process diagrams, sampling visualizations, and validation techniques. Ensure reproducibility and transparency.

</div>

## 🚀 Quick Example: Research Timeline

Here's a simple example of our custom Timeline component showing a typical research project progression:

```js
const researchEvents = [
  {date: "2023-01", label: "Project Initiation", type: "milestone"},
  {date: "2023-03", label: "Literature Review Complete", type: "phase"},
  {date: "2023-06", label: "Data Collection Started", type: "milestone"},
  {date: "2023-09", label: "Preliminary Analysis", type: "phase"},
  {date: "2024-01", label: "Peer Review Submission", type: "milestone"},
  {date: "2024-03", label: "Publication", type: "milestone"}
];

Timeline(researchEvents, {
  title: "Research Project Timeline",
  subtitle: "Key milestones and phases",
  width: 800,
  height: 200
})
```

## 📈 Sample Data Visualization

Let's demonstrate the platform's visualization capabilities with a simple interactive chart:

```js
// Generate sample research data
const sampleData = d3.range(12).map(i => ({
  month: new Date(2024, i, 1),
  citations: Math.floor(10 + Math.random() * 50 + i * 3),
  downloads: Math.floor(50 + Math.random() * 200 + i * 10),
  impact: (Math.random() * 5 + i * 0.3).toFixed(2)
}));

Plot.plot({
  title: "Research Impact Metrics Over Time",
  subtitle: "Citations and downloads tracking",
  width: 800,
  height: 400,
  marginLeft: 60,
  marginBottom: 40,
  y: {
    label: "Count →",
    grid: true
  },
  marks: [
    Plot.lineY(sampleData, {
      x: "month",
      y: "citations",
      stroke: "steelblue",
      strokeWidth: 2,
      marker: true
    }),
    Plot.lineY(sampleData, {
      x: "month",
      y: "downloads",
      stroke: "orange",
      strokeWidth: 2,
      marker: true
    }),
    Plot.text(sampleData.slice(-1), {
      x: "month",
      y: "citations",
      text: d => "Citations",
      dx: 10,
      fill: "steelblue"
    }),
    Plot.text(sampleData.slice(-1), {
      x: "month",
      y: "downloads",
      text: d => "Downloads",
      dx: 10,
      fill: "orange"
    })
  ]
})
```

## 💡 Getting Started

### For Researchers

1. **Clone the repository** and install dependencies
2. **Add your data** to the `src/data/` directory
3. **Create visualizations** using Observable Plot and D3.js
4. **Generate PDFs** with professional formatting
5. **Publish online** via GitHub Pages

### For Developers

Extend the platform with:
- Custom visualization components
- New data loaders and processors
- Additional export formats
- Integration with reference managers

## 📚 Platform Capabilities

### Mathematical Notation

Write equations using LaTeX notation:

$$\chi^2 = \sum_{i=1}^{n} \frac{(O_i - E_i)^2}{E_i}$$

Where $O_i$ represents observed frequencies and $E_i$ represents expected frequencies.

### Code Integration

```js
// Example: Load and process research data
const processedData = {
  async load() {
    const raw = await d3.csv("data/research-results.csv");
    return raw.map(d => ({
      ...d,
      value: +d.value,
      date: new Date(d.date)
    }));
  }
};
```

### Interactive Components

All visualizations are interactive - hover for details, click to select, and export for presentations.

## 🔬 Research Applications

This platform is ideal for:

- **Academic Papers** - Interactive supplementary materials
- **Dissertations** - Chapter-by-chapter analysis presentation
- **Grant Proposals** - Data-driven project justification
- **Conference Presentations** - Live demonstrations and handouts
- **Lab Reports** - Reproducible research documentation
- **Policy Briefs** - Evidence-based recommendations

## 📖 Documentation & Resources

- **[GitHub Repository](https://github.com/SustainableDevelopmentReform/research-report)** - Source code and issues
- **[Observable Framework](https://observablehq.com/framework/)** - Core framework documentation
- **[D3.js Gallery](https://observablehq.com/@d3/gallery)** - Visualization examples
- **[Plot Examples](https://observablehq.com/plot/)** - Chart gallery and recipes

## 🚀 Next Steps

Ready to create your own research dashboard? Start by exploring the demonstration pages above to see what's possible, then follow our quick start guide to begin building your own professional research outputs.

<div class="cta-box">
  <h3>Transform Your Research Today</h3>
  <p>Join researchers worldwide using modern tools for academic publishing</p>
  <p><strong>View Examples → Edit Content → Generate PDFs → Publish Online</strong></p>
</div>

---

*This platform combines the power of Observable Framework with advanced PDF generation to create a complete research publishing solution. All visualizations are reproducible, version-controlled, and ready for both web and print distribution.*

<style>
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.demo-grid h3 {
  margin-top: 0;
  color: #0066cc;
}

.demo-grid > div {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.cta-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin: 2rem 0;
}

.cta-box h3 {
  margin-top: 0;
  font-size: 1.8rem;
}

.cta-box p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.cta-box strong {
  font-size: 1.2rem;
}
</style>